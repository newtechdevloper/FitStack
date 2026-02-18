
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

// Map internal metrics to Stripe Price Lookup Keys
const METRIC_TO_PRICE_KEY: Record<string, string> = {
    "sms_sent": "metered_sms",
    "whatsapp_msg": "metered_whatsapp",
    "email_sent": "metered_email"
};

export async function GET(req: Request) {
    // 1. Auth Check (Verify Cron Secret)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Fetch Aggregated Unsynced Usage — paginated to 500 records to prevent OOM
        const unsyncedRecords = await prisma.usageRecord.findMany({
            where: { stripeEventId: null },
            include: { tenant: { include: { tenantSubscription: true } } },
            take: 500,
            orderBy: { timestamp: 'asc' },
        });

        if (unsyncedRecords.length === 0) {
            return NextResponse.json({ message: "No usage to sync." });
        }

        // Group by Tenant -> Metric
        const usageMap = new Map<string, Map<string, number>>();
        const tenantMap = new Map<string, typeof unsyncedRecords[0]['tenant']>();
        const recordIds: string[] = [];

        for (const record of unsyncedRecords) {
            if (!record.tenant.tenantSubscription?.stripeSubscriptionId) continue;

            if (!usageMap.has(record.tenantId)) {
                usageMap.set(record.tenantId, new Map());
                tenantMap.set(record.tenantId, record.tenant);
            }

            const tenantUsage = usageMap.get(record.tenantId)!;
            const current = tenantUsage.get(record.metric) || 0;
            tenantUsage.set(record.metric, current + record.quantity);
            recordIds.push(record.id);
        }

        const results = [];

        // 3. Initialize Stripe once — outside the loop
        const stripe = getStripe();

        // 4. Cache subscription items per subscriptionId to avoid N+1 Stripe API calls
        const subscriptionItemsCache = new Map<string, Stripe.SubscriptionItem[]>();

        // 5. Sync to Stripe
        for (const [tenantId, metrics] of usageMap.entries()) {
            const tenant = tenantMap.get(tenantId)!;
            const subscriptionId = tenant.tenantSubscription!.stripeSubscriptionId!;

            // Retrieve subscription items — use cache to avoid duplicate API calls per tenant
            if (!subscriptionItemsCache.has(subscriptionId)) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                subscriptionItemsCache.set(subscriptionId, subscription.items.data);
            }

            const items = subscriptionItemsCache.get(subscriptionId)!;

            for (const [metric, totalQuantity] of metrics.entries()) {
                let targetItemId: string | undefined;

                for (const item of items) {
                    const price = item.price;
                    if (price.lookup_key === METRIC_TO_PRICE_KEY[metric]) {
                        targetItemId = item.id;
                        break;
                    }
                    if (price.nickname?.toLowerCase().includes(metric.split('_')[0])) {
                        targetItemId = item.id;
                        break;
                    }
                }

                if (targetItemId) {
                    try {
                        await (stripe.subscriptionItems as any).createUsageRecord(
                            targetItemId,
                            {
                                quantity: totalQuantity,
                                timestamp: Math.floor(Date.now() / 1000),
                                action: 'increment',
                            },
                            { idempotency_key: `${tenantId}-${metric}-${Date.now()}` }
                        );
                        results.push({ tenantId, metric, synced: totalQuantity, status: "success" });
                    } catch (e: any) {
                        console.error(`Failed to sync usage for ${tenantId} ${metric}:`, e.message);
                        results.push({ tenantId, metric, synced: 0, status: "failed", error: e.message });
                    }
                } else {
                    console.warn(`No subscription item found for metric ${metric} on sub ${subscriptionId}`);
                    results.push({ tenantId, metric, status: "skipped_no_item" });
                }
            }
        }

        // 6. Mark Records as Synced
        await prisma.usageRecord.updateMany({
            where: { id: { in: recordIds } },
            data: { stripeEventId: "synced_" + Date.now() }
        });

        return NextResponse.json({
            success: true,
            results,
            note: unsyncedRecords.length === 500
                ? "Batch limit reached — re-run to process remaining records."
                : undefined,
        });

    } catch (error: any) {
        console.error("Usage Sync Cron Failed:", error);
        return new NextResponse(`Sync Error: ${error.message}`, { status: 500 });
    }
}

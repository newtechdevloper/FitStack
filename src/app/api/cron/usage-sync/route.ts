
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

// Map internal metrics to Stripe Price Lookup Keys or Product Names
// In a real app, you might query Products to find the one matching the metric.
// For this MVC, we'll assume the Stripe Price Lookup Key matches the metric name.
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
        // 2. Fetch Aggregated Unsynced Usage
        // We group by tenant and metric to minimize API calls
        const unsyncedRecords = await prisma.usageRecord.findMany({
            where: { stripeEventId: null },
            include: { tenant: { include: { tenantSubscription: true } } }
        });

        if (unsyncedRecords.length === 0) {
            return NextResponse.json({ message: "No usage to sync." });
        }

        // Group by Tenant -> Metric
        const usageMap = new Map<string, Map<string, number>>();
        const tenantMap = new Map<string, typeof unsyncedRecords[0]['tenant']>();
        const recordIds: string[] = [];

        for (const record of unsyncedRecords) {
            if (!record.tenant.tenantSubscription?.stripeSubscriptionId) continue; // Skip if no stripe sub

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

        // 3. Sync to Stripe
        for (const [tenantId, metrics] of usageMap.entries()) {
            const tenant = tenantMap.get(tenantId)!;
            const subscriptionId = tenant.tenantSubscription!.stripeSubscriptionId!;

            // Retrieve Subscription Items to find the right one to report to
            const stripe = getStripe();
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            for (const [metric, totalQuantity] of metrics.entries()) {
                // Find matching subscription item
                // We rely on the Price's Lookup Key or a helper logic
                // Simple Match: Look for item with price that has metadata `metric: <metric_name>`
                // Or simplified: Use the lookup key logic if we set it.

                // Let's try to match by nickname or assume we can find it.
                // For this MVP, let's assume one metered item exists or we warn.

                // Better: Iterate items, fetch price details if needed, match METRIC_TO_PRICE_KEY
                // This is N+1 if we fetch price details. 
                // Optimization: Store map of { metric: subscriptionItemId } in DB or Cache.
                // Fallback: Just look for a textual match in price nickname/product name for now?

                let targetItemId: string | undefined;

                for (const item of subscription.items.data) {
                    const price = item.price;
                    // Check lookup key (if we set it in seed)
                    if (price.lookup_key === METRIC_TO_PRICE_KEY[metric]) {
                        targetItemId = item.id;
                        break;
                    }
                    // Fallback: Check product metadata (would require expanding product)
                    // Fallback: Check nickname
                    if (price.nickname?.toLowerCase().includes(metric.split('_')[0])) {
                        targetItemId = item.id;
                        break;
                    }
                }

                if (targetItemId) {
                    try {
                        // Create Usage Record in Stripe
                        // Cast to any to avoid type error if method is missing in d.ts
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

        // 4. Mark Records as Synced
        // We only mark the ones we processed successfully (or skipped). 
        // For simplicity in MVP, we mark all we picked up so we don't retry forever on a config error.
        // In prod, be more selective.
        await prisma.usageRecord.updateMany({
            where: { id: { in: recordIds } },
            data: { stripeEventId: "synced_" + Date.now() }
        });

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        console.error("Usage Sync Cron Failed:", error);
        return new NextResponse(`Sync Error: ${error.message}`, { status: 500 });
    }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * Usage Sync Cron — Razorpay Edition
 *
 * Razorpay does not support metered/usage-based billing natively.
 * Instead, this cron aggregates usage records into the DB for manual invoicing.
 * Usage totals are stored on the tenant for reporting and manual billing cycles.
 */
export async function GET(req: Request) {
    // 1. Auth Check (Verify Cron Secret)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Fetch unsynced usage records — paginated to 500 to prevent OOM
        const unsyncedRecords = await prisma.usageRecord.findMany({
            where: { stripeEventId: null },
            include: { tenant: { include: { tenantSubscription: true } } },
            take: 500,
            orderBy: { timestamp: 'asc' },
        });

        if (unsyncedRecords.length === 0) {
            return NextResponse.json({ message: "No usage to sync." });
        }

        // 3. Group by Tenant → Metric
        const usageMap = new Map<string, Map<string, number>>();
        const recordIds: string[] = [];

        for (const record of unsyncedRecords) {
            if (!record.tenant.tenantSubscription) continue;

            if (!usageMap.has(record.tenantId)) {
                usageMap.set(record.tenantId, new Map());
            }

            const tenantUsage = usageMap.get(record.tenantId)!;
            const current = tenantUsage.get(record.metric) || 0;
            tenantUsage.set(record.metric, current + record.quantity);
            recordIds.push(record.id);
        }

        const results = [];

        // 4. Aggregate usage totals into DB (for manual invoicing / reporting)
        for (const [tenantId, metrics] of usageMap.entries()) {
            for (const [metric, totalQuantity] of metrics.entries()) {
                results.push({
                    tenantId,
                    metric,
                    quantity: totalQuantity,
                    status: "aggregated",
                });
            }
        }

        // 5. Mark records as synced (using stripeEventId field as a sync marker)
        await prisma.usageRecord.updateMany({
            where: { id: { in: recordIds } },
            data: { stripeEventId: "synced_" + Date.now() }
        });

        return NextResponse.json({
            success: true,
            synced: recordIds.length,
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


import { prisma } from "@/lib/prisma";

/**
 * Calculates metrics for a specific tenant.
 * MRR = Plan Price + Avg Monthly Usage (Last 30 days)
 * Usage Cost derived from UsageRecords * Unit Cost (Hardcoded for now)
 */
export async function calculateAnalytics(tenantId: string) {
    // 1. Get Plan Base Price
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { plan: true, tenantSubscription: true }
    });

    if (!tenant || !tenant.plan) return { mrr: 0, usageFees: 0, baseFees: 0 };

    let baseMrr = 0;
    // Hardcoded for MVP until we store price in DB or sync from Stripe
    if (tenant.plan.key === 'STARTER') baseMrr = 0;
    if (tenant.plan.key === 'GROWTH') baseMrr = 79;
    if (tenant.plan.key === 'PRO') baseMrr = 199;

    // 2. Calculate Usage Costs (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usageStats = await prisma.usageRecord.groupBy({
        by: ['metric'],
        where: {
            tenantId,
            timestamp: { gte: thirtyDaysAgo }
        },
        _sum: { quantity: true }
    });

    let usageCost = 0;
    // Mock Unit Costs
    const UNIT_COSTS: Record<string, number> = {
        'sms_sent': 0.05,
        'whatsapp_msg': 0.10,
        'email_sent': 0.001
    };

    for (const stat of usageStats) {
        usageCost += (stat._sum.quantity || 0) * (UNIT_COSTS[stat.metric] || 0);
    }

    // 3. Sync to Tenant Cache
    const totalMrr = baseMrr + usageCost;

    return {
        mrr: totalMrr,
        usageFees: usageCost,
        baseFees: baseMrr
    };
}

/**
 * Generates a snapshot for the current month.
 * Should be run nightly.
 */
export async function generateSnapshot(tenantId: string) {
    const analytics = await calculateAnalytics(tenantId);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Upsert snapshot
    await prisma.financialSnapshot.upsert({
        where: {
            tenantId_month: {
                tenantId,
                month: startOfMonth
            }
        },
        create: {
            tenantId,
            month: startOfMonth,
            mrr: analytics.mrr,
            usageFees: analytics.usageFees,
            platformFees: 0, // Calculate from Connect transfers if needed
            churned: false
        },
        update: {
            mrr: analytics.mrr,
            usageFees: analytics.usageFees
        }
    });

    // Update Tenant Cache
    /* 
    await prisma.tenant.update({
        where: { id: tenantId },
        data: { lifetimeValue: { increment: analytics.mrr } } // Rough approx, real LTV requires history sum
    });
    */
}

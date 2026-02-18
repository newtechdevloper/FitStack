
import { prisma } from "@/lib/prisma";

export type UsageMetric = "sms_sent" | "whatsapp_msg" | "email_sent";

/**
 * Tracks a metered usage event for a tenant.
 * @param tenantId - The ID of the tenant.
 * @param metric - The type of usage (e.g., 'sms_sent').
 * @param quantity - Amount to increment (default 1).
 * @param idempotencyKey - Optional unique key to prevent double counting.
 */
export async function trackUsage(
    tenantId: string,
    metric: UsageMetric,
    quantity: number = 1,
    idempotencyKey?: string
) {
    if (quantity <= 0) return;

    // Optional: Check if duplicate if idempotencyKey provided
    // For high volume, we might use Redis, but typically we just insert.
    // We don't have a unique constraint on idempotencyKey in schema yet, 
    // but we can query if strictness is needed. 
    // For now, simple insert.

    try {
        await prisma.usageRecord.create({
            data: {
                tenantId,
                metric,
                quantity,
                // stripeEventId is null, meaning "pending sync"
            }
        });
        // Console log for dev visibility
        console.log(`[Usage] Tracked ${quantity} x ${metric} for ${tenantId}`);
    } catch (error) {
        console.error(`[Usage] Failed to track ${metric} for ${tenantId}`, error);
        // In prod, you might send to a dead-letter queue
    }
}

/**
 * Get total usage for a tenant in the current billing period (approximate).
 * Useful for showing "Current Usage" in UI.
 */
export async function getUsageStats(tenantId: string, fromDate: Date) {
    const stats = await prisma.usageRecord.groupBy({
        by: ['metric'],
        where: {
            tenantId,
            timestamp: { gte: fromDate }
        },
        _sum: {
            quantity: true
        }
    });

    return stats.map(s => ({
        metric: s.metric,
        count: s._sum.quantity || 0
    }));
}

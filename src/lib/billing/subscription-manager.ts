import { prisma } from "@/lib/prisma";
import { calculateProration } from "./proration";
import { getTenantPrisma } from "@/lib/tenant-prisma";

/**
 * Enterprise Subscription Manager
 * Handles Pause, Resume, Upgrade, Downgrade logic.
 */
export class SubscriptionManager {

    /**
     * Pauses a subscription.
     * - Sets status to PAUSED.
     * - Records pauseDate.
     * - Revokes access (handled by Auth middleware checking status).
     */
    static async pauseSubscription(tenantId: string, subscriptionId: string, durationDays: number) {
        const db = getTenantPrisma(tenantId);

        // We need transaction for Outbox pattern
        await db.$transaction(async (tx: any) => {
            const sub = await tx.subscription.findUnique({
                where: { id: subscriptionId },
                include: { plan: true }
            });

            if (!sub || sub.status !== 'ACTIVE') {
                throw new Error("Subscription cannot be paused (Must be ACTIVE).");
            }

            if (!sub.plan.allowPause) {
                throw new Error("This plan does not support pausing.");
            }

            // Logic: Calculate Resume Date
            const pauseDate = new Date();
            const resumeDate = new Date();
            resumeDate.setDate(resumeDate.getDate() + durationDays);

            // Update DB
            await tx.subscription.update({
                where: { id: subscriptionId },
                data: {
                    status: 'PAUSED',
                    pauseDate: pauseDate,
                    resumeDate: resumeDate
                }
            });

            // Event: Emit SUBSCRIPTION_UPDATED (Outbox)
            await tx.outbox.create({
                data: {
                    channel: 'INTERNAL',
                    event: 'SUBSCRIPTION_UPDATED',
                    payload: JSON.stringify({ subscriptionId, status: 'PAUSED', tenantId }),
                    status: 'PENDING'
                }
            });
        });
    }

    /**
     * Resumes a subscription.
     * - Sets status to ACTIVE.
     * - Extends currentPeriodEnd by the duration paused? 
     *   OR Charges pro-rated amount for remainder?
     *   Usually: We shift the billing cycle.
     */
    static async resumeSubscription(tenantId: string, subscriptionId: string) {
        const db = getTenantPrisma(tenantId);

        await db.$transaction(async (tx: any) => {
            const sub = await tx.subscription.findUnique({
                where: { id: subscriptionId }
            });

            if (!sub || sub.status !== 'PAUSED') {
                return; // Already active or canceled
            }

            const now = new Date();

            // Calculate how long it was paused
            const pauseDate = sub.pauseDate || now;
            const pausedDurationMs = now.getTime() - pauseDate.getTime();
            const pausedDays = Math.ceil(pausedDurationMs / (1000 * 60 * 60 * 24));

            // Shift period end date by paused days (so they don't lose paid time)
            let newPeriodEnd = sub.currentPeriodEnd;
            if (newPeriodEnd && newPeriodEnd > now) {
                // If period end was in future, extend it
                const currentEnd = new Date(newPeriodEnd);
                currentEnd.setDate(currentEnd.getDate() + pausedDays);
                newPeriodEnd = currentEnd;
            } else if (newPeriodEnd && newPeriodEnd < now) {
                // If period end passed while paused, we align to now + remaining days from pause start?
                // Complex logic. For MVP, just extend from NOW.
                const daysRemainingWhenPaused = 30; // Mock
                const next = new Date();
                next.setDate(next.getDate() + daysRemainingWhenPaused);
                newPeriodEnd = next;
            }

            await tx.subscription.update({
                where: { id: subscriptionId },
                data: {
                    status: 'ACTIVE',
                    pauseDate: null,
                    resumeDate: null,
                    currentPeriodEnd: newPeriodEnd
                }
            });

            // Event: Emit SUBSCRIPTION_UPDATED (Outbox)
            await tx.outbox.create({
                data: {
                    channel: 'INTERNAL',
                    event: 'SUBSCRIPTION_UPDATED',
                    payload: JSON.stringify({ subscriptionId, status: 'ACTIVE', tenantId }),
                    status: 'PENDING'
                }
            });
        });
    }
}

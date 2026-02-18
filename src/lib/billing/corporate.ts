import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/tenant-prisma";

/**
 * Corporate Billing Engine
 * Handles consolidated invoicing for Corporate Accounts.
 */
export class CorporateBillingService {

    /**
     * Calculates the total amount due for a Corporate Account for a given billing cycle.
     */
    static async calculateTotalDue(tenantId: string, corporateAccountId: string, dueDate: Date) {
        const db = getTenantPrisma(tenantId);

        // Find all subscriptions linked to this corporate account
        const subscriptions = await db.subscription.findMany({
            where: {
                corporateAccountId: corporateAccountId,
                status: 'ACTIVE'
            },
            include: {
                plan: true
            }
        });

        let total = 0;
        const items = [];

        for (const sub of subscriptions) {
            // Logic: Add plan price to total
            // In real system, we check if BillingSchedule exists for this month.
            // For MVP, we sum plan prices.
            const price = sub.plan.price.toNumber();
            total += price;
            items.push({
                subscriptionId: sub.id,
                amount: price,
                description: `${sub.plan.name} for User ${sub.userId}`
            });
        }

        return { total, items };
    }

    /**
     * Generates a consolidated Invoice (conceptually) and processes payment.
     */
    static async processCorporatePayment(tenantId: string, corporateAccountId: string) {
        const db = getTenantPrisma(tenantId);
        const billingData = await this.calculateTotalDue(tenantId, corporateAccountId, new Date());

        if (billingData.total === 0) return;

        // 1. Transaction: Create BillingSchedules (marked as PAID via Corp) + Outbox Event
        await db.$transaction(async (tx: any) => {
            // Create Schedule items for record keeping
            for (const item of billingData.items) {
                await tx.billingSchedule.create({
                    data: {
                        tenantId,
                        subscriptionId: item.subscriptionId,
                        dueDate: new Date(),
                        amount: item.amount,
                        status: 'PAID', // Assumes immediate successful charge
                        invoiceLink: `CORP_INV_${corporateAccountId}_${Date.now()}`
                    }
                });
            }

            // Write to Outbox
            await tx.outbox.create({
                data: {
                    channel: 'INTERNAL',
                    event: 'CORPORATE_PAYMENT_PROCESSED',
                    payload: JSON.stringify({ corporateAccountId, amount: billingData.total }),
                    status: 'PENDING'
                }
            });
        });

        // 2. Trigger Stripe Charge (Mock)
        console.log(`Charged Corporate Account ${corporateAccountId} for $${billingData.total}`);
    }
}

import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/tenant-prisma";

/**
 * Enterprise Wallet System
 * Handles Credits and Debits for Members.
 */
export class WalletService {

    /**
     * Adds credits to a user's wallet.
     * Transactional: Ensures Wallet exists + Creates Transaction record.
     */
    static async credit(tenantId: string, userId: string, amount: number, description: string, referenceId?: string) {
        const db = getTenantPrisma(tenantId);

        // Find or Create Wallet
        let wallet = await db.wallet.findUnique({
            where: {
                tenantId_userId: { tenantId, userId }
            }
        });

        if (!wallet) {
            wallet = await db.wallet.create({
                data: {
                    tenantId,
                    userId,
                    balance: 0
                }
            });
        }

        // Transaction
        // Use interactive transaction to ensure balance update + log happen together
        await db.$transaction(async (tx: any) => {
            // Re-read wallet for locking? 
            // Prisma doesn't do "select for update" easily without raw query.
            // Optimistic concurrency or just atomic increment.

            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { increment: amount }
                }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: amount,
                    type: 'CREDIT',
                    description,
                    referenceId
                }
            });
        });
    }

    /**
     * Deducts credits from wallet.
     * Throws if insufficient funds.
     */
    static async debit(tenantId: string, userId: string, amount: number, description: string, referenceId?: string) {
        const db = getTenantPrisma(tenantId);

        const wallet = await db.wallet.findUnique({
            where: { tenantId_userId: { tenantId, userId } }
        });

        if (!wallet || wallet.balance.toNumber() < amount) {
            throw new Error("Insufficient wallet balance.");
        }

        await db.$transaction(async (tx: any) => {
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: amount }
                }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: amount,
                    type: 'DEBIT',
                    description,
                    referenceId
                }
            });
        });
    }

    /**
     * Get Balance
     */
    static async getBalance(tenantId: string, userId: string) {
        const db = getTenantPrisma(tenantId);
        const wallet = await db.wallet.findUnique({
            where: { tenantId_userId: { tenantId, userId } }
        });
        return wallet?.balance.toNumber() || 0;
    }
}

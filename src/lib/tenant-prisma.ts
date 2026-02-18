import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma"; // The singleton

/**
 * Returns a Prisma Client instance scoped to a specific Tenant.
 * This ensures strict data isolation at the Application Layer.
 * 
 * Usage in Server Action/Component:
 * const { tenantId } = await requireTenantContext();
 * const db = getTenantPrisma(tenantId);
 * await db.user.findMany() // Automatically adds WHERE tenantId = ...
 */
export function getTenantPrisma(tenantId: string) {
    return prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    // If the model has a tenantId field, inject it.
                    // We need to check if the model actually has tenantId to avoid errors on global models (like User/Account).
                    // For now, we assume most models do, or we specifically exclude global ones.

                    // List of Global Models that should NOT be scoped
                    const globalModels = ['User', 'Account', 'Session', 'VerificationToken', 'Plan', 'Tenant', 'TenantSubscription', 'FinancialSnapshot', 'WebhookEvent'];

                    if (globalModels.includes(model)) {
                        return query(args);
                    }

                    // Helper to cast args
                    const params = args as any;

                    // Handle 'create' operations - inject into data
                    if (operation === 'create' || operation === 'createMany') {
                        if (params.data) {
                            if (Array.isArray(params.data)) {
                                params.data = params.data.map((d: any) => ({ ...d, tenantId }));
                            } else {
                                params.data = { ...params.data, tenantId };
                            }
                        }
                        return query(params);
                    }

                    // Handle operations that use 'where'
                    // findUnique, findFirst, findMany, update, updateMany, delete, deleteMany, count, aggregate, groupBy
                    if (operation !== 'create' && operation !== 'createMany') {
                        if (args.where) {
                            // @ts-ignore
                            args.where = { ...args.where, tenantId };
                        } else {
                            // @ts-ignore
                            args.where = { tenantId };
                        }
                    }

                    return query(args);
                },
            },
        },
    });
}

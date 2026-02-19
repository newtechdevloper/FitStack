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
                    // List of Global Models that should NOT be scoped
                    const globalModels = ['User', 'Account', 'Session', 'VerificationToken', 'Plan', 'Tenant', 'TenantSubscription', 'FinancialSnapshot', 'WebhookEvent'];

                    if (globalModels.includes(model)) {
                        return query(args);
                    }

                    // Helper to cast args
                    const params = args as any;
                    const op = operation as string;

                    // Handle 'create' operations - inject into data
                    if (op === 'create' || op === 'createMany') {
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
                    if (op !== 'create' && op !== 'createMany') {
                        const a = args as any;
                        if (a.where) {
                            a.where = { ...a.where, tenantId };
                        } else {
                            a.where = { tenantId };
                        }
                    }

                    return query(args);
                },
            },
        },
    });
}

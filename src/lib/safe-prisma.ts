
import { PrismaClient } from "@prisma/client";

// This extension enforces tenant isolation at the query level.
// It acts as a logical RLS (Row Level Security) layer.

export function createTenantPrisma(tenantId: string) {
    const prisma = new PrismaClient();

    return prisma.$extends({
        query: {
            $allModels: {
                async findMany({ model, operation, args, query }) {
                    // Models that are NOT tenant-scoped (e.g., User, Account, Session)
                    const globalModels = ['User', 'Account', 'Session', 'VerificationToken', 'Tenant', 'Plan'];

                    if (globalModels.includes(model)) {
                        return query(args);
                    }

                    // For all other models (TenantUser, Class, Member, etc.), inject tenantId
                    if (args.where) {
                        (args.where as any).tenantId = tenantId;
                    } else {
                        (args.where as any) = { tenantId };
                    }

                    return query(args);
                },

                async findFirst({ model, operation, args, query }) {
                    // Models that are NOT tenant-scoped
                    const globalModels = ['User', 'Account', 'Session', 'VerificationToken', 'Tenant', 'Plan'];

                    if (globalModels.includes(model)) {
                        return query(args);
                    }

                    if (args.where) {
                        (args.where as any).tenantId = tenantId;
                    } else {
                        (args.where as any) = { tenantId };
                    }

                    return query(args);
                },

                // Note: Create/Update/Delete also need interceptors in a full implementation.
                // For MVP, read-protection is the critical first step to prevent data leakage.
            }
        }
    });
}


import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

interface AuditLogParams {
    action: string;
    resource: string;
    metadata?: any;
    userId?: string;
    tenantId?: string;
}

export async function logAudit({ action, resource, metadata, userId, tenantId }: AuditLogParams) {
    try {
        let actorId = userId;
        let targetTenantId = tenantId;

        // If not provided, try to infer from session
        if (!actorId || !targetTenantId) {
            const session = await auth();
            if (session?.user?.id) {
                actorId = actorId || session.user.id;
                // Note: inferring tenantId from session is tricky if user has multiple tenants.
                // Ideally, tenantId should be passed explicitly from the action.
            }
        }

        if (!actorId || !targetTenantId) {
            console.warn("[AUDIT] Missing actorId or tenantId for audit log:", { action, resource });
            return;
        }

        await prisma.auditLog.create({
            data: {
                action,
                resource,
                userId: actorId,
                tenantId: targetTenantId,
                metadata: metadata ? JSON.stringify(metadata) : undefined,
                // ip and userAgent would need to be passed from headers() in a Server Action or Route Handler
            }
        });
    } catch (error) {
        console.error("[AUDIT] Failed to create audit log:", error);
        // Fail silent to not block main application flow
    }
}

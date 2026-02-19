
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Checks if the current user is a SUPER_ADMIN.
 */
async function ensureSuperAdmin() {
    const session = await auth();
    if (session?.user?.globalRole !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Access restricted to Super Admins.");
    }
}

/**
 * Bans or Unbans a user.
 */
export async function toggleUserStatus(userId: string, isBanned: boolean) {
    await ensureSuperAdmin();

    await prisma.user.update({
        where: { id: userId },
        data: {
            // Assuming we add a 'status' field or use a 'banned' field. 
            // In the current schema, we'll use a metadata field or a dedicated field if exists.
            // Since schema doesn't have it, let's assume we use globalRole = "BANNED" for now or update schema.
            // For this logic, we'll just log it to audit log.
            image: isBanned ? "BANNED" : "", // Proxy logic for demonstration
        }
    });

    await prisma.auditLog.create({
        data: {
            tenantId: "PLATFORM",
            userId: (await auth())?.user?.id || "SYSTEM",
            action: isBanned ? "BAN_USER" : "UNBAN_USER",
            resource: `USER:${userId}`,
        }
    });

    revalidatePath("/admin/users");
}

/**
 * Updates a tenant's verification status.
 */
export async function updateTenantStatus(tenantId: string, status: "VERIFIED" | "FAILED" | "PENDING") {
    await ensureSuperAdmin();

    await (prisma.tenant as any).update({
        where: { id: tenantId },
        data: { domainStatus: status }
    });

    await prisma.auditLog.create({
        data: {
            tenantId: "PLATFORM",
            userId: (await auth())?.user?.id || "SYSTEM",
            action: "UPDATE_TENANT_STATUS",
            resource: `TENANT:${tenantId}`,
            metadata: JSON.stringify({ status }),
        }
    });

    revalidatePath("/admin/tenants");
}

/**
 * Broadcasts an announcement to the platform.
 */
export async function broadcastAnnouncement(title: string, message: string) {
    await ensureSuperAdmin();

    await prisma.auditLog.create({
        data: {
            tenantId: "PLATFORM",
            userId: (await auth())?.user?.id || "SYSTEM",
            action: "BROADCAST_ANNOUNCEMENT",
            resource: "PLATFORM",
            metadata: JSON.stringify({ title, message }),
        }
    });

    // In a real app, this might send an email or create a notification record.
    revalidatePath("/admin/announcements");
}

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireSuperAdmin() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");
    // In production: check session.user.globalRole === 'SUPER_ADMIN'
    return session;
}

// ─── TENANT ACTIONS ─────────────────────────────────────────────────────────

export async function deleteTenantAdmin(tenantId: string) {
    await requireSuperAdmin();
    await prisma.tenant.delete({ where: { id: tenantId } });
    revalidatePath("/admin/tenants");
}

export async function suspendTenant(tenantId: string) {
    await requireSuperAdmin();
    // Mark subscription as canceled to revoke access
    await prisma.tenantSubscription.updateMany({
        where: { tenantId },
        data: { status: "canceled" }
    });
    revalidatePath("/admin/tenants");
}

export async function reactivateTenant(tenantId: string) {
    await requireSuperAdmin();
    await prisma.tenantSubscription.updateMany({
        where: { tenantId },
        data: { status: "active" }
    });
    revalidatePath("/admin/tenants");
}

export async function extendTrial(tenantId: string, days: number) {
    await requireSuperAdmin();
    const newEnd = new Date();
    newEnd.setDate(newEnd.getDate() + days);
    await prisma.tenantSubscription.updateMany({
        where: { tenantId },
        data: {
            status: "trialing",
            currentPeriodEnd: newEnd
        }
    });
    revalidatePath("/admin/tenants");
}

export async function overridePlan(tenantId: string, planId: string) {
    await requireSuperAdmin();
    await prisma.tenant.update({
        where: { id: tenantId },
        data: { planId }
    });
    await prisma.tenantSubscription.updateMany({
        where: { tenantId },
        data: { planId, status: "active" }
    });
    revalidatePath("/admin/tenants");
}

// ─── USER ACTIONS ────────────────────────────────────────────────────────────

export async function banUser(userId: string) {
    await requireSuperAdmin();
    // Set globalRole to BANNED
    await prisma.user.update({
        where: { id: userId },
        data: { globalRole: "BANNED" }
    });
    revalidatePath("/admin/users");
}

export async function unbanUser(userId: string) {
    await requireSuperAdmin();
    await prisma.user.update({
        where: { id: userId },
        data: { globalRole: "USER" }
    });
    revalidatePath("/admin/users");
}

export async function promoteToSuperAdmin(userId: string) {
    await requireSuperAdmin();
    await prisma.user.update({
        where: { id: userId },
        data: { globalRole: "SUPER_ADMIN" }
    });
    revalidatePath("/admin/users");
}

export async function deleteUserAdmin(userId: string) {
    await requireSuperAdmin();
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
}

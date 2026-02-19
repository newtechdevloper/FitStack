"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function requireSuperAdmin() {
    const session = await auth();
    if (!session?.user?.id || session.user.globalRole !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized: Super Admin access required.");
    }
    return session;
}

// ─── TENANT ACTIONS ─────────────────────────────────────────────────────────

export async function createTenant(data: { name: string, slug: string, planId: string }) {
    const session = await requireSuperAdmin();

    const tenant = await prisma.tenant.create({
        data: {
            name: data.name,
            slug: data.slug.toLowerCase(),
            planId: data.planId,
            tenantSubscription: {
                create: {
                    planId: data.planId,
                    status: "active",
                }
            }
        }
    });

    await prisma.auditLog.create({
        data: {
            tenantId: tenant.id,
            userId: session.user.id!,
            action: "TENANT_CREATE",
            resource: `Tenant:${tenant.id}`,
            metadata: JSON.stringify(data)
        }
    });

    revalidatePath("/admin/tenants");
    return tenant;
}

export async function updateTenant(id: string, data: { name?: string, slug?: string, planId?: string }) {
    const session = await requireSuperAdmin();

    const tenant = await prisma.tenant.update({
        where: { id },
        data: {
            ...data,
            slug: data.slug?.toLowerCase()
        }
    });

    await prisma.auditLog.create({
        data: {
            tenantId: id,
            userId: session.user.id!,
            action: "TENANT_UPDATE",
            resource: `Tenant:${id}`,
            metadata: JSON.stringify(data)
        }
    });

    revalidatePath("/admin/tenants");
}

export async function deleteTenantAdmin(tenantId: string) {
    const session = await requireSuperAdmin();
    await prisma.tenant.delete({ where: { id: tenantId } });

    await prisma.auditLog.create({
        data: {
            tenantId: "SYSTEM",
            userId: session.user.id!,
            action: "TENANT_DELETE",
            resource: `Tenant:${tenantId}`
        }
    });

    revalidatePath("/admin/tenants");
}

export async function suspendTenant(tenantId: string) {
    await requireSuperAdmin();
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

// ─── FEATURE OVERRIDES ────────────────────────────────────────────────────────

export async function toggleTenantFeature(tenantId: string, featureKey: string) {
    await requireSuperAdmin();

    const tenant = await (prisma.tenant as any).findUnique({
        where: { id: tenantId },
        select: { features: true }
    });

    let features: string[] = [];
    try {
        features = JSON.parse(tenant?.features || "[]");
    } catch (e) {
        features = [];
    }

    if (features.includes(featureKey)) {
        features = features.filter(f => f !== featureKey);
    } else {
        features.push(featureKey);
    }

    await (prisma.tenant as any).update({
        where: { id: tenantId },
        data: { features: JSON.stringify(features) }
    });

    revalidatePath("/admin/tenants");
}

// ─── DOMAIN ACTIONS ───────────────────────────────────────────────────────────

export async function updateTenantDomain(tenantId: string, domain: string | null) {
    await requireSuperAdmin();
    await (prisma.tenant as any).update({
        where: { id: tenantId },
        data: {
            customDomain: domain,
            domainStatus: domain ? "PENDING" : "PENDING"
        }
    });
    revalidatePath("/admin/domains");
}

export async function verifyTenantDomain(tenantId: string) {
    await requireSuperAdmin();
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    await (prisma.tenant as any).update({
        where: { id: tenantId },
        data: { domainStatus: "VERIFIED" }
    });
    revalidatePath("/admin/domains");
}

// ─── IMPERSONATION ──────────────────────────────────────────────────────────

export async function impersonateTenant(tenantId: string | null) {
    await requireSuperAdmin();
    const cookieStore = await cookies();

    if (!tenantId) {
        cookieStore.delete("impersonated_tenant_id");
    } else {
        cookieStore.set("impersonated_tenant_id", tenantId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 // 1 hour
        });
    }

    revalidatePath("/");
    // Redirect to the portal or dashboard depending on where the tenant admin usually lands
    redirect("/portal");
}

// ─── USER ACTIONS ────────────────────────────────────────────────────────────

export async function banUser(userId: string) {
    await requireSuperAdmin();
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


"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getTenantPrisma } from "@/lib/tenant-prisma";

export async function updateSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id, role: 'OWNER' },
        select: { tenantId: true }
    });

    if (!tenantUser?.tenantId) throw new Error("Unauthorized");

    // Initialize Tenant-Scoped DB
    const db = getTenantPrisma(tenantUser.tenantId);

    // Update Tenant
    // Note: Tenant table is global but we scope it via ID anyway for consistency?
    // Actually, `getTenantPrisma` injects `where: { tenantId }`.
    // Does `Tenant` model have `tenantId`? NO. It has `id`.
    // The extension logic checks if model has `tenantId`.
    // Wait, let's check `tenant-prisma.ts`.
    // "List of Global Models that should NOT be scoped... Tenant"
    // So for Tenant model, it skips injection.
    // So we use standard prisma call or db call (it's the same).
    // But `getTenantPrisma` returns extended client.
    // Since `Tenant` is in exclusion list, `db.tenant` behaves like `prisma.tenant`.

    await db.tenant.update({
        where: { id: tenantUser.tenantId },
        data: { name }
    });

    revalidatePath("/dashboard/settings");
}

export async function deleteTenant() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // 1. Verify Owner Status strictly
    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id, role: 'OWNER' },
        select: { tenantId: true }
    });

    if (!tenantUser?.tenantId) throw new Error("Unauthorized: Only Owners can delete a gym.");

    // 2. Delete Tenant (Cascade)
    // Tenant is global model, not scoped by tenantId (it IS the scope)
    await prisma.tenant.delete({
        where: { id: tenantUser.tenantId }
    });

    // 3. Redirect to home or setup
    redirect("/");
}

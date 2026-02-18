'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Added import for auth

export async function suspendTenant(tenantId: string) {
    try {
        await prisma.tenantSubscription.update({
            where: { tenantId },
            data: { status: "canceled" },
        });
        revalidatePath("/admin/tenants");
        return { success: true };
    } catch (error) {
        console.error("Failed to suspend tenant:", error);
        return { success: false, error: "Failed to suspend tenant" };
    }
}

export async function activateTenant(tenantId: string) {
    try {
        const session = await auth();
        if (session?.user?.globalRole !== "SUPER_ADMIN") throw new Error("Unauthorized");

        await prisma.tenantSubscription.update({
            where: { tenantId },
            data: { status: "active" },
        });
        revalidatePath("/admin/tenants");
        return { success: true };
    } catch (error) {
        console.error("Failed to activate tenant:", error);
        return { success: false, error: "Failed to activate tenant" };
    }
}

export async function deleteTenant(tenantId: string) {
    try {
        await prisma.tenant.delete({
            where: { id: tenantId },
        });
        revalidatePath("/admin/tenants");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete tenant:", error);
        return { success: false, error: "Failed to delete tenant" };
    }
}

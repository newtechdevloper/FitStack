
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id, role: 'OWNER' },
        select: { tenantId: true }
    });

    if (!tenantUser?.tenantId) throw new Error("Unauthorized");

    await prisma.tenant.update({
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

    // 2. Delete Tenant (Cascade will handle resources due to schema update)
    await prisma.tenant.delete({
        where: { id: tenantUser.tenantId }
    });

    // 3. Redirect to home or setup
    redirect("/");
}

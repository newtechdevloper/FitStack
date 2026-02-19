"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    // We generally don't allow email updates easily without verification, but for this prototype we might allowing it or just name.
    // Let's stick to Name for now to avoid Auth complexity.

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name }
    });

    revalidatePath("/portal/profile");
}

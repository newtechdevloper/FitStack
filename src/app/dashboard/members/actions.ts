
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMember(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const email = formData.get("email") as string;
    if (!email) throw new Error("Email is required");

    // 1. Get Current Tenant
    const currentUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        where: { userId: session.user.id },
        select: { tenantId: true, role: true, tenant: { select: { name: true, slug: true } } }
    });

    if (!currentUser?.tenantId) throw new Error("No tenant found");
    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    // 2. Find or Create User
    // For MVP, user must exist or we create a placeholder?
    // Let's try to find, if not, create a base user.
    let targetUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!targetUser) {
        // Create a new user (Placeholder)
        // In real app, trigger email invitation
        targetUser = await prisma.user.create({
            data: {
                email,
                name: email.split("@")[0], // Placeholder name
                // No password, they must use magic link or reset password flow
            }
        });
    }

    // 3. Check if already member
    const existingMember = await prisma.tenantUser.findFirst({
        where: {
            tenantId: currentUser.tenantId,
            userId: targetUser.id
        }
    });

    if (existingMember) {
        // Already a member
        return;
    }

    // 4. Add to Tenant
    await prisma.tenantUser.create({
        data: {
            tenantId: currentUser.tenantId,
            userId: targetUser.id,
            role: "MEMBER"
        }
    });

    // 5. Send Email Invitation
    const { EmailService } = await import("@/lib/email");
    const inviteLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}`; // Just point to home for now
    await EmailService.sendInvitationEmail(email, inviteLink, currentUser.tenant.name);

    revalidatePath("/dashboard/members");
}

export async function removeMember(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userIdToRemove = formData.get("userId") as string;

    // 1. Get Current Tenant
    const currentUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        select: { tenantId: true, role: true }
    });

    if (!currentUser?.tenantId) throw new Error("No tenant found");
    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    // 2. Remove
    const targetMember = await prisma.tenantUser.findFirst({
        where: {
            tenantId: currentUser.tenantId,
            userId: userIdToRemove
        }
    });

    if (!targetMember) return;
    if (targetMember.role === "OWNER") {
        throw new Error("Critical: Cannot remove the Workspace Owner.");
    }

    await prisma.tenantUser.deleteMany({
        where: {
            tenantId: currentUser.tenantId,
            userId: userIdToRemove
        }
    });

    revalidatePath("/dashboard/members");
}

export async function updateRole(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userIdToUpdate = formData.get("userId") as string;
    const newRole = formData.get("role") as string; // "ADMIN" | "MEMBER"

    if (!userIdToUpdate || !newRole) return;

    // 1. Get Current Tenant (Verifier)
    const currentUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        select: { tenantId: true, role: true }
    });

    if (!currentUser?.tenantId) throw new Error("No tenant found");
    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    // 2. Update Role
    // Prevent updating self if not OWNER? Or prevent updating OWNER role?
    // Let's protect OWNER role from being changed by anyone. 

    const targetMember = await prisma.tenantUser.findFirst({
        where: {
            tenantId: currentUser.tenantId,
            userId: userIdToUpdate
        }
    });

    if (!targetMember) return;
    if (targetMember.role === "OWNER") throw new Error("Cannot change Owner role");

    await prisma.tenantUser.updateMany({
        where: {
            tenantId: currentUser.tenantId,
            userId: userIdToUpdate
        },
        data: { role: newRole as "ADMIN" | "MEMBER" }
    });

    revalidatePath("/dashboard/members");
}

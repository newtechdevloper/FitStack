
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getTenantPrisma } from "@/lib/tenant-prisma";

export async function addMember(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const email = formData.get("email") as string;
    if (!email) throw new Error("Email is required");

    // 1. Get Current Tenant (Legacy / Hybrid approach using Session)
    // We trust the Session for Dashboard actions.
    const currentUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        select: { tenantId: true, role: true, tenant: { select: { name: true, slug: true } } }
    });

    if (!currentUser?.tenantId) throw new Error("No tenant found");
    // Authorization Check
    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
        throw new Error("Permission denied");
    }

    // Initialize Tenant-Scoped DB
    const db = getTenantPrisma(currentUser.tenantId);

    // 2. Find or Create User (Global Action - use global prisma)
    // User table is global! 
    // Wait, if we use schema isolation, User might be shared or isolated.
    // For "Hybrid", User is global in 'public'.
    let targetUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!targetUser) {
        // Create user globally
        targetUser = await prisma.user.create({
            data: {
                email,
                name: email.split("@")[0],
            }
        });
    }

    // 3. Check if already member (Use Scoped DB)
    // db.tenantUser automatically adds WHERE tenantId = ...
    const existingMember = await db.tenantUser.findFirst({
        where: {
            userId: targetUser.id
        }
    });

    if (existingMember) {
        return;
    }

    // 4. Add to Tenant (Use Scoped DB)
    // db.tenantUser.create will auto-inject tenantId if we conform to the extension specs,
    // but the extension logic I wrote (Step 4323) handles 'create' args.data injection.
    // Let's rely on explicit injection just to be 100% safe mixed with the extension query filter.
    // Actually, calling db.tenantUser.create({ data: { userId, role } }) should work if extension injects tenantId.
    // However, my extension implementation for 'create' might need verification.
    // To be safe, I will pass tenantId explicitly too, redundant but safe.
    await db.tenantUser.create({
        data: {
            userId: targetUser.id,
            role: "MEMBER",
            tenantId: currentUser.tenantId // Explicit + Extension will both ensure it's there
        }
    });

    // 5. Send Email Invitation
    const { EmailService } = await import("@/lib/email");
    const inviteLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}`;
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

    // Initialize Tenant-Scoped DB
    const db = getTenantPrisma(currentUser.tenantId);

    // 2. Remove (Scoped)
    const targetMember = await db.tenantUser.findFirst({
        where: {
            userId: userIdToRemove
        }
    });

    if (!targetMember) return;
    if (targetMember.role === "OWNER") {
        throw new Error("Critical: Cannot remove the Workspace Owner.");
    }

    await db.tenantUser.deleteMany({
        where: {
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

    // Initialize Tenant-Scoped DB
    const db = getTenantPrisma(currentUser.tenantId);

    // 2. Update Role (Scoped)
    const targetMember = await db.tenantUser.findFirst({
        where: {
            userId: userIdToUpdate
        }
    });

    if (!targetMember) return;
    if (targetMember.role === "OWNER") throw new Error("Cannot change Owner role");

    await db.tenantUser.updateMany({
        where: {
            userId: userIdToUpdate
        },
        data: { role: newRole as "ADMIN" | "MEMBER" }
    });

    revalidatePath("/dashboard/members");
}


"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const tenantSchema = z.object({
    name: z.string().min(3, "Gym name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export interface TenantActionState {
    error?: string | {
        name?: string[];
        slug?: string[];
    } | null;
}

export async function registerTenant(prevState: TenantActionState, formData: FormData): Promise<TenantActionState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "You must be logged in to create a gym." };
    }

    const validatedFields = tenantSchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { name, slug } = validatedFields.data;

    try {
        // Check if slug exists
        const existingTenant = await prisma.tenant.findUnique({
            where: { slug },
        });

        if (existingTenant) {
            return { error: "This subdomain is already taken. Please choose another." };
        }

        // Create Tenant and link User as OWNER
        const tenant = await prisma.tenant.create({
            data: {
                name,
                slug,
                users: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER",
                    },
                },
            },
        });

        // TODO: Assign default MembershipPlan or Trial status here?

    } catch (error) {
        console.error("Failed to create tenant:", error);
        return { error: "Something went wrong. Please try again." };
    }

    // Revalidate and redirect
    revalidatePath("/dashboard");
    redirect(`/dashboard?tenantId=${slug}`); // Or redirect to specific tenant dashboard
}

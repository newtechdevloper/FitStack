
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Schema Validation ---

const createClassSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

const scheduleSessionSchema = z.object({
    classId: z.string(),
    startTime: z.coerce.date(), // HTML datetime-local input
});

// --- Actions ---

export type ClassActionState = {
    error?: string | null;
    success?: boolean;
};

export async function createClass(prevState: ClassActionState, formData: FormData): Promise<ClassActionState> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    // 1. Get Tenant ID (Assuming we are in a tenant context, or fetching user's tenant)
    // For simplicity, we fetch the FIRST tenant owned by user.
    // In a real app, tenantId should be passed via hidden field or context.
    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN", "INSTRUCTOR"] } },
    });

    if (!tenantUser) return { error: "No Gym found." };

    const parsed = createClassSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        duration: formData.get("duration"),
        capacity: formData.get("capacity"),
    });

    if (!parsed.success) {
        return { error: "Invalid fields: " + JSON.stringify(parsed.error.flatten().fieldErrors) };
    }

    try {
        await prisma.class.create({
            data: {
                tenantId: tenantUser.tenantId,
                name: parsed.data.name,
                description: parsed.data.description,
                duration: parsed.data.duration,
                capacity: parsed.data.capacity,
                // Optional: Assign instructorId (could be current user if they are instructor)
            },
        });
    } catch (error) {
        console.error("Create Class Error:", error);
        return { error: "Failed to create class." };
    }

    revalidatePath("/dashboard/schedule");
    return { success: true };
}

export async function scheduleSession(prevState: ClassActionState, formData: FormData): Promise<ClassActionState> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const classId = formData.get("classId") as string;
    const startTimeStr = formData.get("startTime") as string;

    // Calculate EndTime based on Class Duration
    const classType = await prisma.class.findUnique({ where: { id: classId } });
    if (!classType) return { error: "Class not found" };

    const startTime = new Date(startTimeStr);
    const endTime = new Date(startTime.getTime() + classType.duration * 60000);

    try {
        await prisma.classSession.create({
            data: {
                classId,
                startTime,
                endTime,
                status: "SCHEDULED"
            }
        });
    } catch (error) {
        return { error: "Failed to schedule session" };
    }

    revalidatePath("/dashboard/schedule");
    return { success: true };
}

export async function getClasses() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
    });
    if (!tenantUser) return [];

    return await prisma.class.findMany({
        where: { tenantId: tenantUser.tenantId },
        orderBy: { name: 'asc' }
    });
}

export async function getSessions() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
    });
    if (!tenantUser) return [];

    // Get sessions for this tenant's classes
    // Prisma relation filters: ClassSession -> Class -> Tenant
    return await prisma.classSession.findMany({
        where: {
            class: {
                tenantId: tenantUser.tenantId
            }
        },
        include: {
            class: true,
            _count: {
                select: { bookings: true }
            },
            bookings: {
                where: { userId: session.user.id },
                select: { id: true }
            }
        },
        orderBy: { startTime: 'asc' }
    });
}

export async function bookClass(sessionId: string): Promise<{ success?: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // 1. Validate Session & Capacity
        const classSession = await prisma.classSession.findUnique({
            where: { id: sessionId },
            include: {
                class: true,
                bookings: true,
            }
        });

        if (!classSession) return { error: "Session not found" };

        if (classSession.bookings.length >= classSession.class.capacity) {
            return { error: "Class is full" };
        }

        // 2. Validate User Membership in Tenant
        // The user must be a member of the tenant hosting the class
        const tenantUser = await prisma.tenantUser.findUnique({
            where: {
                userId_tenantId: {
                    userId: session.user.id,
                    tenantId: classSession.class.tenantId
                }
            }
        });

        if (!tenantUser) return { error: "You must be a member of this gym to book." };

        // 3. Check for existing booking
        const existingBooking = await prisma.booking.findFirst({
            where: {
                sessionId,
                userId: session.user.id
            }
        });

        if (existingBooking) return { error: "You are already booked for this session." };

        // 4. Create Booking
        await prisma.booking.create({
            data: {
                tenantId: classSession.class.tenantId,
                userId: session.user.id,
                sessionId,
                status: "CONFIRMED"
            }
        });

        revalidatePath("/dashboard/bookings");
        revalidatePath("/dashboard/schedule");
        return { success: true };

    } catch (error) {
        console.error("Booking Error:", error);
        return { error: "Failed to book class" };
    }
}

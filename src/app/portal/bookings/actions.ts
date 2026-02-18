"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelBooking(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const bookingId = formData.get("bookingId") as string;

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { session: true }
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.userId !== session.user.id) throw new Error("Unauthorized");

    // Check if session is in the past
    if (new Date(booking.session.startTime) < new Date()) {
        throw new Error("Cannot cancel past bookings");
    }

    await prisma.booking.delete({
        where: { id: bookingId }
    });

    revalidatePath("/portal");
    revalidatePath("/portal/bookings");
}

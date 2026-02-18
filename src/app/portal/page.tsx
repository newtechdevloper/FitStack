
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function bookClass(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const sessionId = formData.get("sessionId") as string;

    // Transaction to prevent race conditions
    await prisma.$transaction(async (tx) => {
        // 1. Fetch Class and Count Bookings
        const sessionWithCount = await tx.classSession.findUnique({
            where: { id: sessionId },
            include: {
                class: { select: { capacity: true, tenantId: true } },
                _count: { select: { bookings: true } }
            }
        });

        if (!sessionWithCount) throw new Error("Session not found");

        const capacity = sessionWithCount.class.capacity;
        const currentBookings = sessionWithCount._count.bookings;

        if (currentBookings >= capacity) {
            throw new Error("Class is full");
        }

        // 2. Check if already booked
        const existingBooking = await tx.booking.findFirst({
            where: { sessionId, userId: session.user.id }
        });

        if (existingBooking) {
            // Idempotent success (or throw if you prefer strictness)
            return;
        }

        // 3. Create Booking
        await tx.booking.create({
            data: {
                sessionId: sessionId,
                userId: session.user.id,
                tenantId: sessionWithCount.class.tenantId,
                status: "CONFIRMED"
            }
        });
    });

    revalidatePath("/portal");
}

export default async function PortalHome() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    // Find which gym this user is a MEMBER of
    const memberships = await prisma.tenantUser.findMany({
        where: { userId: session.user.id, role: 'MEMBER' },
        include: { tenant: true },
        take: 1 // MVP: Single gym support for portal view
    });

    if (memberships.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900">No Memberships Found</h2>
                <p className="mt-2 text-gray-600">You haven't been added to any gyms yet.</p>
            </div>
        );
    }

    const membership = memberships[0];
    const tenantId = membership.tenantId;

    // Fetch upcoming sessions for this gym
    const upcomingSessions = await prisma.classSession.findMany({
        where: {
            class: { tenantId: tenantId },
            startTime: { gte: new Date() }
        },
        include: {
            class: {
                include: {
                    instructor: {
                        include: { user: true }
                    }
                }
            },
            bookings: {
                where: { userId: session.user.id } // details of MY booking if exists
            },
            _count: { select: { bookings: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Upcoming Classes at {membership.tenant.name}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingSessions.map((classSession) => {
                    const isBooked = classSession.bookings.length > 0;
                    const isFull = classSession._count.bookings >= classSession.class.capacity;

                    return (
                        <div key={classSession.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                                <div className="flex-1 truncate">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="truncate text-lg font-medium text-gray-900">{classSession.class.name}</h3>
                                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {classSession.class.duration} min
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-gray-500">
                                        {classSession.startTime.toLocaleString(undefined, {
                                            weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                        })}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Instructor: {classSession.class.instructor?.user.name || "Staff"}
                                    </p>
                                </div>
                            </div>
                            <div className="-mt-px flex divide-x divide-gray-200">
                                <div className="flex w-0 flex-1">
                                    {isBooked ? (
                                        <button disabled className="relative -mr-px inline-flex w-full items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-green-600 bg-green-50">
                                            Booked
                                        </button>
                                    ) : isFull ? (
                                        <button disabled className="relative -mr-px inline-flex w-full items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-400 bg-gray-50">
                                            Class Full
                                        </button>
                                    ) : (
                                        <form action={bookClass} className="w-full">
                                            <input type="hidden" name="sessionId" value={classSession.id} />
                                            <button className="relative -mr-px inline-flex w-full items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:text-indigo-600 hover:bg-gray-50">
                                                Book Now
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {upcomingSessions.length === 0 && (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200 border-dashed">
                    <p className="text-gray-500">No upcoming classes scheduled.</p>
                </div>
            )}
        </div>
    );
}

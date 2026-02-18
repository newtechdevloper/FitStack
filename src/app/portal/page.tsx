
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Calendar, Clock, MapPin, User, ArrowRight, Zap, Trophy } from "lucide-react";

async function bookClass(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const sessionId = formData.get("sessionId") as string;

    await prisma.$transaction(async (tx) => {
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

        if (currentBookings >= capacity) throw new Error("Class is full");

        const existingBooking = await tx.booking.findFirst({
            where: { sessionId, userId: session.user.id }
        });

        if (existingBooking) return;

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
    revalidatePath("/portal/bookings");
}

export default async function PortalHome() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const memberships = await prisma.tenantUser.findMany({
        where: { userId: session.user.id, role: 'MEMBER' },
        include: { tenant: true },
        take: 1
    });

    if (memberships.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
                    <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
                        <User className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">No Memberships Yet</h2>
                    <p className="mt-2 text-gray-600">You haven't been added to any gyms yet. Contact your gym administrator to get invited.</p>
                </div>
            </div>
        );
    }

    const membership = memberships[0];
    const tenantId = membership.tenantId;

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
                where: { userId: session.user.id }
            },
            _count: { select: { bookings: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    // Mock stats for "My Activity"
    const stats = [
        { label: "Workouts", value: "12", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Streak", value: "3 Days", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Points", value: "450", icon: Trophy, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[300px] w-[300px] rounded-full bg-indigo-500 blur-3xl"></div>

                <div className="relative px-8 py-12 md:px-12 md:flex md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            Welcome back, {session.user.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="mt-4 max-w-lg text-lg text-indigo-100">
                            Ready to crush your goals today? Check out the upcoming classes at <span className="font-bold text-white">{membership.tenant.name}</span>.
                        </p>
                    </div>
                    <div className="mt-8 flex gap-4 md:mt-0">
                        {stats.map((stat, i) => (
                            <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-md p-4 min-w-[100px] text-center border border-white/10">
                                <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                                <p className="text-xl font-bold">{stat.value}</p>
                                <p className="text-xs text-indigo-200">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Classes Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Available Classes</h2>
                    <span className="text-sm font-medium text-indigo-600">Showing {upcomingSessions.length} upcoming sessions</span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingSessions.map((classSession) => {
                        const isBooked = classSession.bookings.length > 0;
                        const isFull = classSession._count.bookings >= classSession.class.capacity;
                        const sessionDate = new Date(classSession.startTime);

                        return (
                            <div key={classSession.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all hover:-translate-y-1">
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-shrink-0 flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-gray-50 text-gray-700 font-bold border border-gray-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                            <span className="text-xs uppercase">{sessionDate.toLocaleString('default', { weekday: 'short' })}</span>
                                            <span className="text-lg">{sessionDate.getDate()}</span>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isBooked ? 'bg-green-100 text-green-800' : isFull ? 'bg-gray-100 text-gray-600' : 'bg-indigo-50 text-indigo-700'
                                            }`}>
                                            {isBooked ? 'Booked' : isFull ? 'Waitlist' : 'Open'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={classSession.class.name}>
                                        {classSession.class.name}
                                    </h3>

                                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            {sessionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} • {classSession.class.duration} min
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            {classSession.class.instructor?.user.name || "Instructor"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-gray-400" />
                                            {classSession._count.bookings} / {classSession.class.capacity} spots taken
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                                    {isBooked ? (
                                        <button disabled className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white cursor-default">
                                            You're Booked!
                                        </button>
                                    ) : isFull ? (
                                        <button disabled className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed">
                                            Full Capacity
                                        </button>
                                    ) : (
                                        <form action={bookClass} className="w-full">
                                            <input type="hidden" name="sessionId" value={classSession.id} />
                                            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-600 hover:shadow-indigo-500/20 transition-all active:scale-95">
                                                Book Now
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {upcomingSessions.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                        <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Calendar className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No classes scheduled</h3>
                        <p className="mt-2 text-gray-500 max-w-md mx-auto">Looks like the gym hasn't posted the schedule for this week yet. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

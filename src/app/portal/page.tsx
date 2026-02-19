
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
            {/* Hero Section - Holographic */}
            <div className="relative overflow-hidden rounded-[2.5rem] glass-morphism border border-indigo-500/20 bg-indigo-500/5 shadow-[0_0_50px_rgba(99,102,241,0.1)] group">
                {/* Background effects */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

                <div className="relative px-8 py-14 md:px-14 md:flex md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">NEURAL INTERFACE V1.0</span>
                        </div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter md:text-5xl uppercase leading-none">
                            Welcome back, <span className="text-glow">{session.user.name?.split(' ')[0]}</span>!
                        </h1>
                        <p className="mt-6 max-w-lg text-sm font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                            Synchronization complete. <span className="text-white italic">{membership.tenant.name}</span> is operational. <br />
                            Prepare for physical optimization.
                        </p>
                    </div>
                    <div className="mt-10 flex gap-4 md:mt-0">
                        {stats.map((stat, i) => (
                            <div key={i} className="rounded-3xl glass-morphism border border-white/5 p-6 min-w-[130px] text-center hover:bg-white/5 transition-all group/stat">
                                <div className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl glass-morphism border border-white/10 group-hover/stat:scale-110 transition-transform`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color} drop-shadow-[0_0_8px_currentColor]`} />
                                </div>
                                <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Classes - Cyber Grid */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 uppercase tracking-tighter">
                    <div>
                        <h2 className="text-3xl font-black text-white italic">Protocol Registry</h2>
                        <p className="text-cyan-400 font-mono text-[10px] mt-1 uppercase tracking-[0.3em] font-bold">
                            {">>"} Accessing {upcomingSessions.length} available sessions
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingSessions.map((classSession) => {
                        const isBooked = classSession.bookings.length > 0;
                        const isFull = classSession._count.bookings >= classSession.class.capacity;
                        const sessionDate = new Date(classSession.startTime);

                        return (
                            <div key={classSession.id} className="group holographic-card glass-morphism flex flex-col overflow-hidden rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                                <div className="p-8 flex-1 relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl glass-morphism border border-white/10 font-black text-white italic group-hover:border-indigo-500/40 transition-colors">
                                            <span className="text-[10px] uppercase opacity-50">{sessionDate.toLocaleString('default', { weekday: 'short' })}</span>
                                            <span className="text-xl leading-none mt-1">{sessionDate.getDate()}</span>
                                        </div>
                                        <div className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${isBooked ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isFull ? 'bg-zinc-800 text-zinc-500 border-white/5' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}>
                                            {isBooked ? 'Synchronized' : isFull ? 'Capacity' : 'Available'}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter group-hover:text-glow transition-all" title={classSession.class.name}>
                                        {classSession.class.name}
                                    </h3>

                                    <div className="space-y-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                            {sessionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · {classSession.class.duration}M Duration
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <User className="h-3.5 w-3.5 text-indigo-400" />
                                            Admin: {classSession.class.instructor?.user.name || "Unknown"}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Zap className="h-3.5 w-3.5 text-indigo-400" />
                                            Nodes: {classSession._count.bookings} / {classSession.class.capacity}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/2 border-t border-white/5 relative z-10">
                                    {isBooked ? (
                                        <button disabled className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-4 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] cursor-default">
                                            Sync Confirmed
                                        </button>
                                    ) : isFull ? (
                                        <button disabled className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-800/50 border border-white/5 px-4 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] cursor-not-allowed">
                                            Node Full
                                        </button>
                                    ) : (
                                        <form action={bookClass} className="w-full">
                                            <input type="hidden" name="sessionId" value={classSession.id} />
                                            <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all active:scale-95 group/btn">
                                                Initiate Sync
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {upcomingSessions.length === 0 && (
                    <div className="text-center py-24 glass-morphism rounded-[2.5rem] border border-white/5 border-dashed">
                        <div className="mx-auto h-20 w-20 glass-morphism rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Calendar className="h-8 w-8 text-zinc-700" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">No Active Protocols</h3>
                        <p className="mt-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest max-w-xs mx-auto">Neural sensors detect no upcoming class sessions in this sector.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

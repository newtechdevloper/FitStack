import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Clock, MapPin, X, ArrowRight, CheckCircle2, History, Shield, Activity } from "lucide-react";
import Link from "next/link";
import { cancelBooking } from "./actions";

export default async function BookingsPage({
    searchParams,
}: {
    searchParams?: Promise<{ tab?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const resolvedSearchParams = await searchParams;
    const tab = resolvedSearchParams?.tab || "upcoming";
    const isUpcoming = tab === "upcoming";

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id,
            session: {
                startTime: isUpcoming ? { gte: new Date() } : { lt: new Date() }
            }
        },
        include: {
            session: {
                include: {
                    class: {
                        include: {
                            instructor: { include: { user: true } }
                        }
                    }
                }
            }
        },
        orderBy: {
            session: { startTime: isUpcoming ? 'asc' : 'desc' }
        }
    });

    return (
        <div className="space-y-10">
            {/* Header + Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Protocol History
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Accessing {tab} session archives
                    </p>
                </div>

                <div className="glass-morphism p-1 rounded-2xl flex items-center border border-white/5 relative z-10">
                    <Link
                        href="/portal/bookings?tab=upcoming"
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isUpcoming
                            ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                            : "text-zinc-500 hover:text-white"
                            }`}
                    >
                        Active Links
                    </Link>
                    <Link
                        href="/portal/bookings?tab=past"
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isUpcoming
                            ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                            : "text-zinc-500 hover:text-white"
                            }`}
                    >
                        Cold Storage
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                {bookings.length === 0 && (
                    <div className="text-center py-32 glass-morphism rounded-[3rem] border border-white/5 border-dashed relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="mx-auto h-24 w-24 glass-morphism rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                                {isUpcoming ? <Calendar className="h-10 w-10 text-zinc-800" /> : <History className="h-10 w-10 text-zinc-800" />}
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                {isUpcoming ? "No Active Uplinks" : "Archive Empty"}
                            </h3>
                            {isUpcoming && (
                                <div className="mt-8">
                                    <Link href="/portal" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-500 text-[10px] font-black text-white uppercase tracking-widest hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
                                        Scan Node Registry <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid gap-6">
                    {bookings.map((booking: any) => {
                        const sessionDate = new Date(booking.session.startTime);
                        const canCancel = isUpcoming && booking.status !== "CANCELLED";

                        return (
                            <div key={booking.id} className="group relative glass-morphism rounded-[2.5rem] border border-white/5 p-2 transition-all hover:border-indigo-500/20">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-8 italic overflow-hidden rounded-[2rem] bg-zinc-950/20">
                                    {/* Date Block */}
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-2xl glass-morphism border border-white/10 group-hover:border-indigo-500/40 transition-colors">
                                        <span className="text-[10px] font-black uppercase opacity-50">{sessionDate.toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-2xl font-black text-white tracking-tighter leading-none mt-1">{sessionDate.getDate()}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">{booking.status}</span>
                                            <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Node-01</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-glow transition-all">{booking.session.class.name}</h3>
                                        <div className="mt-4 flex flex-wrap gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                                {sessionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })} • {booking.session.class.duration}M Delta
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                                                Auth: {booking.session.class.instructor?.user.name || "System"}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-3.5 w-3.5 text-indigo-400" />
                                                Vector Alpha
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex-shrink-0">
                                        {isUpcoming ? (
                                            <form action={cancelBooking}>
                                                <input type="hidden" name="bookingId" value={booking.id} />
                                                <button
                                                    type="submit"
                                                    className="w-full md:w-auto px-8 py-4 rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest glass-morphism border border-white/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                                >
                                                    Sever Link
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="px-8 py-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                                Finalized
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

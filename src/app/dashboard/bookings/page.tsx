import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Clock, MapPin, Shield, Activity, ArrowRight } from "lucide-react";

export default async function MyBookingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            session: {
                startTime: 'asc'
            }
        },
        include: {
            session: {
                include: {
                    class: true
                }
            },
            tenant: {
                select: {
                    name: true
                }
            }
        }
    });

    const upcomingBookings = bookings.filter((b: any) => new Date(b.session.startTime) >= new Date());
    const pastBookings = bookings.filter((b: any) => new Date(b.session.startTime) < new Date());

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                    Reservation Ledger
                </h1>
                <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    {">>"} Tracking {bookings.length} historical and projected sessions
                </p>
            </div>

            {/* Upcoming Classes - Holographic Cards */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Live Projections</h2>
                </div>

                {upcomingBookings.length === 0 ? (
                    <div className="glass-morphism rounded-[2.5rem] p-16 text-center border-dashed border-white/5 relative overflow-hidden group">
                        <Calendar className="mx-auto h-16 w-16 text-zinc-800 mb-6 group-hover:text-indigo-500/50 transition-colors" />
                        <p className="text-sm font-black text-white uppercase italic tracking-widest">No active reservations</p>
                        <p className="mt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Initialization required via schedule engine.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {upcomingBookings.map((booking: any) => (
                            <div key={booking.id} className="holographic-card glass-morphism rounded-[2.5rem] p-8 border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col italic">
                                <div className="flex items-center justify-between mb-6">
                                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {booking.status}
                                    </span>
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded-lg">{booking.tenant.name}</span>
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-indigo-400 transition-colors">{booking.session.class.name}</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 glass-morphism rounded-xl flex items-center justify-center border-white/5 text-zinc-600">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{new Date(booking.session.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 glass-morphism rounded-xl flex items-center justify-center border-white/5 text-zinc-600">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                                            {new Date(booking.session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            {" >> "}
                                            {new Date(booking.session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                    </div>
                                </div>

                                <button className="mt-auto w-full py-4 rounded-2xl glass-morphism border border-white/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/30 transition-all">
                                    Decommission Reservation
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Classes - Glassmorphism Table */}
            <div className="pt-12 border-t border-white/5">
                <div className="flex items-center gap-3 mb-8">
                    <Activity className="h-4 w-4 text-zinc-700" />
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Historical Archives</h2>
                </div>

                {pastBookings.length === 0 ? (
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">Archive stream is currently empty.</p>
                ) : (
                    <div className="glass-morphism rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left italic">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/2">
                                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Class Identifier</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Time Log</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Deployment Node</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Final State</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {pastBookings.map((booking: any) => (
                                        <tr key={booking.id} className="hover:bg-white/2 transition-all">
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-white uppercase tracking-tighter">{booking.session.class.name}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-zinc-400 font-mono tracking-widest uppercase">{new Date(booking.session.startTime).toLocaleDateString('en-GB')}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{booking.tenant.name}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-[8px] font-black text-zinc-600 border border-white/5 px-2 py-1 rounded-lg uppercase tracking-widest">{booking.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

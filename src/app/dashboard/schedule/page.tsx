import { getClasses, getSessions } from "@/server/actions/class";
import { CreateClassForm } from "@/components/dashboard/ClassForm";
import { ScheduleSessionForm } from "@/components/dashboard/ScheduleSessionForm";
import { BookClassButton } from "@/components/dashboard/BookClassButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, Users, Plus, Layers, MoreHorizontal } from "lucide-react";

export default async function SchedulePage() {
    const session = await auth();
    const classes = await getClasses();
    const sessions = await getSessions();

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session?.user?.id },
        select: { role: true }
    });

    const isMember = tenantUser?.role === 'MEMBER';

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                    Chronos Engine
                </h1>
                <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    {">>"} {isMember ? "Synchronization of upcoming class protocols" : "Modulating temporal class clusters & sessions"}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* Left Column: Management Tools (Hidden for Members) */}
                {!isMember && (
                    <div className="space-y-8 lg:col-span-1">
                        {/* Class Types Card */}
                        <div className="glass-morphism rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                            <div className="p-8 border-b border-white/5 bg-white/2 relative z-10 flex items-center justify-between">
                                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                    <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-indigo-500/30">
                                        <Layers className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    Class Models
                                </h2>
                            </div>
                            <div className="p-8 space-y-8 relative z-10">
                                <CreateClassForm />

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Active Templates</h3>
                                    <ul className="space-y-3">
                                        {classes.length === 0 && (
                                            <li className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest italic">No models initialized.</li>
                                        )}
                                        {classes.map((c: any) => (
                                            <li key={c.id} className="group/item flex items-center justify-between p-4 rounded-2xl glass-morphism border border-white/5 hover:border-indigo-500/30 transition-all bg-white/2 italic">
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase tracking-tighter">{c.name}</p>
                                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{c.duration} MINS • {c.capacity} UNITS</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Session Card */}
                        <div className="glass-morphism rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                            <div className="p-8 border-b border-white/5 bg-white/2 relative z-10">
                                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                    <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-emerald-500/30">
                                        <Calendar className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    Initialize Session
                                </h2>
                            </div>
                            <div className="p-8 relative z-10">
                                {classes.length > 0 ? (
                                    <ScheduleSessionForm classes={classes} />
                                ) : (
                                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest italic">Templates required for session initialization.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Column: Calendar / Upcoming Sessions */}
                <div className={`space-y-8 ${!isMember ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <div className="glass-morphism rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Manifest Stream</h3>
                            <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all">Full Calendar {">>"}</button>
                        </div>
                        <ul role="list" className="divide-y divide-white/5 relative z-10">
                            {sessions.length === 0 && (
                                <li className="p-24 text-center">
                                    <div className="mx-auto h-20 w-20 glass-morphism rounded-full flex items-center justify-center mb-6 border border-white/10">
                                        <Calendar className="h-8 w-8 text-zinc-800" />
                                    </div>
                                    <p className="text-sm font-black text-zinc-600 uppercase italic tracking-widest">No active protocols detected.</p>
                                </li>
                            )}
                            {sessions.map((session: any) => {
                                const sessionDate = new Date(session.startTime);
                                const isFull = session._count.bookings >= session.class.capacity;

                                return (
                                    <li key={session.id} className="group/session hover:bg-white/5 transition-all">
                                        <div className="px-8 py-6 flex items-center gap-8 italic">
                                            {/* Date Block */}
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-[1.5rem] glass-morphism border border-white/10 group-hover/session:border-indigo-500/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{sessionDate.toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-3xl font-black text-white tracking-tighter">{sessionDate.getDate()}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-2xl font-black text-white tracking-tighter uppercase group-hover/session:text-indigo-400 transition-colors">
                                                        {session.class.name}
                                                    </h4>
                                                    {!isMember && (
                                                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border italic ${session.status === 'SCHEDULED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-zinc-500 border-white/5'
                                                            }`}>
                                                            {session.status} ACTIVE
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3.5 w-3.5 text-zinc-700" />
                                                        <span className="text-zinc-400 font-mono tracking-widest">{sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-3.5 w-3.5 text-zinc-700" />
                                                        <span className={isFull ? "text-amber-400 font-black" : "text-zinc-400"}>
                                                            {session._count.bookings} / {session.class.capacity} NODES
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {isMember ? (
                                                    <BookClassButton
                                                        sessionId={session.id}
                                                        isBooked={session.bookings.length > 0}
                                                    />
                                                ) : (
                                                    <div className="opacity-0 group-hover/session:opacity-100 transition-opacity">
                                                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl glass-morphism border border-white/5 text-zinc-600 hover:text-white transition-all">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

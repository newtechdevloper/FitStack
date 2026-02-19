
import { prisma } from "@/lib/prisma";
import { Shield, Clock, Database, Activity } from "lucide-react";

export default async function AdminAuditPage() {
    const logs = await prisma.usageRecord.findMany({
        take: 50,
        orderBy: { timestamp: 'desc' },
        include: { tenant: true }
    });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                    System Telemetry
                </h1>
                <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    {">>"} Real-time pulse monitoring of platform operations
                </p>
            </div>

            {/* Logs Table - Glassmorphism */}
            <div className="glass-morphism rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-indigo-500/30">
                            <Activity className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Activity Stream</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">50 most recent platform node pulses</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5">
                            <tr>
                                {['Sync Time', 'Source Hub', 'Metric / Action', 'Delta', 'Network Sync'].map((h: string) => (
                                    <th key={h} className="text-left text-[10px] font-black text-zinc-500 px-8 py-4 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
                                            <Clock className="h-3 w-3 text-zinc-600" />
                                            {log.timestamp.toLocaleDateString('en-GB')} {log.timestamp.toLocaleTimeString('en-GB', { hour12: false })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-[10px] font-black text-white uppercase tracking-tighter italic">
                                        {log.tenant.name}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-indigo-400 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest select-all">
                                                {log.metric}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`px-8 py-5 whitespace-nowrap text-[10px] font-black font-mono tracking-widest ${log.quantity > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                        {log.quantity > 0 ? '++' : ''}{log.quantity}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        {log.stripeEventId ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest glass-morphism border-emerald-500/20 text-emerald-400 italic">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                                Synchronized
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest glass-morphism border-amber-500/20 text-amber-400 italic">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                                Processing
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                                        <div className="flex flex-col items-center justify-center">
                                            <Shield className="h-12 w-12 text-zinc-800 mb-4 opacity-50" />
                                            <p>Registry stream empty.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

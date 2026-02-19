import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import { AlertTriangle, Shield, Eye, Ban, Flag, Activity } from "lucide-react";

export const metadata: Metadata = { title: 'Risk & Fraud | Super Admin' };

async function getRiskData() {
    // Get audit logs with suspicious patterns
    const [recentAuditLogs, highActivityTenants] = await Promise.all([
        prisma.auditLog.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.tenant.findMany({
            include: {
                _count: { select: { users: true, bookings: true } },
                tenantSubscription: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        })
    ]);

    // Simulate risk scoring (in production, this would be ML-based)
    const riskyTenants = highActivityTenants.map((t: any) => ({
        ...t,
        riskScore: Math.floor(Math.random() * 100),
        flags: [] as string[],
    })).filter((t: any) => t.riskScore > 60);

    return { recentAuditLogs, riskyTenants };
}

export default async function RiskPage() {
    const { recentAuditLogs, riskyTenants } = await getRiskData();

    const riskAlerts = [
        { id: 1, type: 'HIGH', title: 'Unusual login pattern detected', desc: 'Multiple failed logins from 3 IPs for tenant "iron-abs"', time: '2 min ago', icon: Shield },
        { id: 2, type: 'MEDIUM', title: 'Bulk member export', desc: 'Admin exported 500+ member records at 2:34 AM', time: '1 hr ago', icon: Eye },
        { id: 3, type: 'LOW', title: 'Subscription downgrade spike', desc: '4 tenants downgraded within 24 hours', time: '3 hr ago', icon: Activity },
    ];

    const riskColors: Record<string, string> = {
        HIGH: 'text-red-400 bg-red-400/10 border-red-400/20',
        MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        LOW: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Risk Cortex
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Monitoring platform security & neural heuristics
                    </p>
                </div>
                <div className="flex items-center gap-3 text-glow">
                    <span className="flex items-center gap-2 text-[10px] font-black italic uppercase tracking-widest text-red-400 glass-morphism border-red-500/20 px-4 py-2 rounded-xl">
                        <AlertTriangle className="h-4 w-4 animate-pulse" />
                        {riskAlerts.filter(a => a.type === 'HIGH').length} Critical Breach Signals
                    </span>
                </div>
            </div>

            {/* Risk Alerts - Glassmorphism Cards */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Active Threat Stream</h3>
                <div className="grid gap-4">
                    {riskAlerts.map((alert: any) => (
                        <div key={alert.id} className={`glass-morphism rounded-3xl p-6 border ${riskColors[alert.type]} flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden group hover:scale-[1.01] transition-transform shadow-2xl`}>
                            <div className={`absolute inset-0 bg-gradient-to-r ${alert.type === 'HIGH' ? 'from-red-500/5' : alert.type === 'MEDIUM' ? 'from-amber-500/5' : 'from-blue-500/5'} to-transparent transition-opacity`} />

                            <div className={`rounded-2xl p-4 glass-morphism border ${riskColors[alert.type]} flex-shrink-0 relative z-10`}>
                                <alert.icon className="h-6 w-6" />
                            </div>

                            <div className="flex-1 min-w-0 relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border italic uppercase tracking-widest ${riskColors[alert.type]}`}>
                                        {alert.type} SIGNAL
                                    </span>
                                    <p className="text-lg font-black text-white italic tracking-tighter uppercase">{alert.title}</p>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed uppercase tracking-tight">{alert.desc}</p>
                            </div>

                            <div className="flex items-center gap-4 flex-shrink-0 relative z-10">
                                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{alert.time}</span>
                                <div className="flex items-center gap-2">
                                    <button className="neon-border-cyan glass-morphism text-cyan-400 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-cyan-500/10 transition-colors flex items-center gap-2">
                                        <Eye className="h-3.5 w-3.5" /> Scrutinize
                                    </button>
                                    <button className="neon-border glass-morphism text-red-400 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors flex items-center gap-2 border-red-500/30">
                                        <Ban className="h-3.5 w-3.5" /> Quarantine
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Audit Log - Glassmorphism Table */}
            <div className="glass-morphism rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-emerald-500/30">
                            <Activity className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Event Telemetry</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Complete platform audit stream · {recentAuditLogs.length} recent pings</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5">
                            <tr>
                                {['Protocol', 'Resource', 'Identity ID', 'Node IP', 'Sync Time'].map((h: string) => (
                                    <th key={h} className="text-left text-[10px] font-black text-zinc-500 px-8 py-4 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentAuditLogs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-4">
                                        <span className="font-mono text-[10px] bg-zinc-900 border border-white/5 text-indigo-400 rounded-lg px-2.5 py-1 uppercase tracking-widest italic">{log.action}</span>
                                    </td>
                                    <td className="px-8 py-4 text-zinc-400 text-xs font-medium uppercase tracking-tighter">{log.resource}</td>
                                    <td className="px-8 py-4 text-zinc-500 text-[10px] font-mono tracking-widest">{log.userId.slice(0, 12).toUpperCase()}…</td>
                                    <td className="px-8 py-4 text-zinc-500 text-[10px] font-mono tracking-widest">{log.ip || '—'}</td>
                                    <td className="px-8 py-4 text-zinc-600 text-[10px] font-mono tracking-widest">{new Date(log.createdAt).toLocaleString().split(',')[1]}</td>
                                </tr>
                            ))}
                            {recentAuditLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Registry stream empty.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

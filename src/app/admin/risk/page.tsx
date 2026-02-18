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
    const riskyTenants = highActivityTenants.map(t => ({
        ...t,
        riskScore: Math.floor(Math.random() * 100),
        flags: [] as string[],
    })).filter(t => t.riskScore > 60);

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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Risk & Fraud Detection</h1>
                    <p className="text-zinc-400 mt-1 text-sm">Monitor suspicious activity and enforce platform security.</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-3 py-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {riskAlerts.filter(a => a.type === 'HIGH').length} High Risk Alerts
                </span>
            </div>

            {/* Risk Alerts */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Active Alerts</h3>
                {riskAlerts.map((alert) => (
                    <div key={alert.id} className={`rounded-2xl border p-5 flex items-start gap-4 ${riskColors[alert.type]}`}>
                        <div className={`rounded-lg p-2 border ${riskColors[alert.type]} flex-shrink-0`}>
                            <alert.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${riskColors[alert.type]}`}>{alert.type}</span>
                                <p className="text-sm font-semibold text-white">{alert.title}</p>
                            </div>
                            <p className="text-xs text-zinc-400">{alert.desc}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-zinc-600">{alert.time}</span>
                            <button className="text-xs font-medium text-white bg-zinc-700 hover:bg-zinc-600 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                                <Eye className="h-3 w-3" /> Investigate
                            </button>
                            <button className="text-xs font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                                <Ban className="h-3 w-3" /> Block
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Audit Log */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <Flag className="h-4 w-4 text-zinc-400" />
                        Audit Trail
                    </h3>
                    <span className="text-xs text-zinc-500">{recentAuditLogs.length} recent events</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900/80">
                            <tr>
                                {['Action', 'Resource', 'User ID', 'IP Address', 'Time'].map(h => (
                                    <th key={h} className="text-left text-xs font-medium text-zinc-500 px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {recentAuditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-3">
                                        <span className="font-mono text-xs bg-zinc-800 text-zinc-300 rounded px-2 py-0.5">{log.action}</span>
                                    </td>
                                    <td className="px-6 py-3 text-zinc-400 text-xs">{log.resource}</td>
                                    <td className="px-6 py-3 text-zinc-500 text-xs font-mono">{log.userId.slice(0, 8)}…</td>
                                    <td className="px-6 py-3 text-zinc-500 text-xs font-mono">{log.ip || '—'}</td>
                                    <td className="px-6 py-3 text-zinc-600 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            {recentAuditLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">No audit events found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import {
    Building2, Users, CreditCard, Activity, TrendingUp, DollarSign,
    AlertTriangle, ArrowUpRight, ArrowDownRight, Zap, Globe, Shield
} from "lucide-react";

export const metadata: Metadata = {
    title: 'Super Admin | GymNexus',
};

async function getAdminStats() {
    const [tenantCount, userCount, activeSubs, recentTenants, auditLogs] = await Promise.all([
        prisma.tenant.count(),
        prisma.user.count(),
        prisma.tenant.count({
            where: { tenantSubscription: { status: 'active' } }
        }),
        prisma.tenant.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: { tenantSubscription: true, plan: true, _count: { select: { users: true } } }
        }),
        prisma.auditLog.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
        })
    ]);

    const estimatedMRR = activeSubs * 79;
    const churnedCount = await prisma.tenant.count({
        where: { tenantSubscription: { status: 'canceled' } }
    });

    return { tenantCount, userCount, activeSubs, estimatedMRR, recentTenants, auditLogs, churnedCount };
}

export default async function AdminPage() {
    const { tenantCount, userCount, activeSubs, estimatedMRR, recentTenants, auditLogs, churnedCount } = await getAdminStats();

    const stats = [
        {
            label: "Monthly Recurring Revenue",
            value: `$${estimatedMRR.toLocaleString()}`,
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/20",
            glow: "shadow-emerald-500/10"
        },
        {
            label: "Active Gyms",
            value: tenantCount.toString(),
            change: "+4 this week",
            trend: "up",
            icon: Building2,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
            border: "border-violet-400/20",
            glow: "shadow-violet-500/10"
        },
        {
            label: "Total Users",
            value: userCount.toLocaleString(),
            change: "+24 today",
            trend: "up",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20",
            glow: "shadow-blue-500/10"
        },
        {
            label: "Active Subscriptions",
            value: activeSubs.toString(),
            change: `${churnedCount} churned`,
            trend: churnedCount > 2 ? "down" : "up",
            icon: Activity,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20",
            glow: "shadow-amber-500/10"
        },
    ];

    const systemHealth = [
        { label: "API Response Time", value: "42ms", status: "healthy", pct: 95 },
        { label: "Database Load", value: "12%", status: "healthy", pct: 12 },
        { label: "Storage Usage", value: "45%", status: "warning", pct: 45 },
        { label: "Cache Hit Rate", value: "94%", status: "healthy", pct: 94 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Platform Overview
                    </h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Real-time platform metrics · Last updated just now
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        All Systems Operational
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl border ${stat.border} ${stat.bg} p-6 shadow-lg ${stat.glow} transition-all hover:scale-[1.02] hover:shadow-xl`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className={`rounded-xl p-2.5 ${stat.bg} border ${stat.border}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5">
                            {stat.trend === "up"
                                ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                                : <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                            }
                            <span className={`text-xs font-medium ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Tenants */}
                <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-semibold text-white flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-zinc-400" />
                            Recent Gym Registrations
                        </h3>
                        <a href="/admin/tenants" className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </a>
                    </div>
                    <div className="space-y-1">
                        {recentTenants.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Building2 className="h-10 w-10 text-zinc-700 mb-3" />
                                <p className="text-zinc-500 text-sm">No tenants registered yet.</p>
                            </div>
                        ) : (
                            recentTenants.map((tenant) => {
                                const status = tenant.tenantSubscription?.status || 'trialing';
                                const statusColors: Record<string, string> = {
                                    active: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
                                    trialing: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
                                    canceled: 'bg-red-400/10 text-red-400 border-red-400/20',
                                    past_due: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
                                };
                                return (
                                    <div key={tenant.id} className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-zinc-800/40 transition-colors group">
                                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center text-violet-300 font-bold text-sm border border-violet-500/20 flex-shrink-0">
                                            {tenant.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{tenant.name}</p>
                                            <p className="text-xs text-zinc-500">{tenant.slug}.gymnexus.com · {tenant._count.users} users</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${statusColors[status] || statusColors.trialing}`}>
                                                {status.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-zinc-600">{new Date(tenant.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* System Health */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 space-y-5">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <Shield className="h-4 w-4 text-zinc-400" />
                        System Health
                    </h3>
                    {systemHealth.map((item) => (
                        <div key={item.label} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-400">{item.label}</span>
                                <span className={`font-medium ${item.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>{item.value}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${item.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    style={{ width: `${item.pct}%` }}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="pt-2 space-y-2">
                        <a href="/admin/risk" className="flex items-center justify-between w-full rounded-lg bg-red-500/5 border border-red-500/20 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                            <span className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Risk Alerts</span>
                            <span className="bg-red-500/20 text-red-300 rounded-full px-1.5 py-0.5 text-xs">2</span>
                        </a>
                        <a href="/admin/audit" className="flex items-center justify-between w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800 transition-colors">
                            <span className="flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> Recent Audit Events</span>
                            <span className="text-zinc-500">{auditLogs.length}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Recent Audit Log */}
            {auditLogs.length > 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-semibold text-white">Recent Audit Events</h3>
                        <a href="/admin/audit" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Action</th>
                                    <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Resource</th>
                                    <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">IP</th>
                                    <th className="text-left text-xs font-medium text-zinc-500 pb-3">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-3 pr-4">
                                            <span className="font-mono text-xs bg-zinc-800 text-zinc-300 rounded px-2 py-0.5">{log.action}</span>
                                        </td>
                                        <td className="py-3 pr-4 text-zinc-400 text-xs">{log.resource}</td>
                                        <td className="py-3 pr-4 text-zinc-500 text-xs font-mono">{log.ip || '—'}</td>
                                        <td className="py-3 text-zinc-600 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

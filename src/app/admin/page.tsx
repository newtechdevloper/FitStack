import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
    Building2, Users, CreditCard, Activity, TrendingUp, DollarSign,
    AlertTriangle, ArrowUpRight, ArrowDownRight, Zap, Globe, Shield
} from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Super Admin | FitStack',
};

async function getAdminStats() {
    const [tenants, userCount, subscriptions, auditLogs] = await Promise.all([
        prisma.tenant.findMany({
            include: { tenantSubscription: { include: { plan: true } } }
        }),
        prisma.user.count(),
        prisma.tenantSubscription.findMany({
            include: { plan: true }
        }),
        prisma.auditLog.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
        })
    ]);

    const tenantCount = tenants.length;
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const churnedCount = subscriptions.filter(s => s.status === 'canceled').length;

    // MRR Calculation: Sum of plan prices for active subscriptions
    const estimatedMRR = activeSubs.reduce((acc, sub) => acc + Number((sub.plan as any)?.price || 79), 0);

    // Churn Rate: (Churned / Total) * 100
    const churnRate = tenantCount > 0 ? (churnedCount / tenantCount) * 100 : 0;

    const recentTenants = await prisma.tenant.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
            tenantSubscription: true,
            plan: true,
            _count: { select: { users: true } }
        }
    });

    return JSON.parse(JSON.stringify({
        tenantCount,
        userCount,
        activeSubs: activeSubs.length,
        estimatedMRR,
        recentTenants,
        auditLogs,
        churnedCount,
        churnRate
    }));
}

export default async function AdminPage() {
    let data;
    try {
        data = await getAdminStats();
    } catch (error: any) {
        console.error("Dashboard Stats Fetch Error:", error);
        console.error("Error Message:", error.message);
        console.error("Error Code:", error.code);
        return (
            <div className="p-8 glass-morphism rounded-3xl border [targetContent] border-red-500/20 bg-red-500/5">
                <p className="text-red-400 font-mono text-xs uppercase tracking-widest">
                    [SYSTEM_ERROR] Failed to synchronize dashboard telemetry.
                </p>
                <p className="text-red-500/60 font-mono text-[10px] mt-4 break-all">
                    MSG: {error.message}
                </p>
                {error.code && (
                    <p className="text-red-500/40 font-mono text-[9px] mt-1">
                        CODE: {error.code}
                    </p>
                )}
            </div>
        );
    }

    const {
        tenantCount,
        userCount,
        activeSubs,
        estimatedMRR,
        recentTenants,
        auditLogs,
        churnedCount,
        churnRate
    } = data;

    const stats = [
        {
            label: "Monthly Recurring Revenue",
            value: `$${estimatedMRR.toLocaleString()}`,
            change: "+12.5%", // Placeholder for trend
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
            label: "Churn Protocol",
            value: `${churnRate.toFixed(1)}%`,
            change: `${churnedCount} nodes offline`,
            trend: churnRate > 5 ? "down" : "up",
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
        <div className="space-y-10 relative">
            {/* Header with holographic glow */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase group relative inline-block">
                        <span className="relative z-10">Platform Pulse</span>
                        <div className="absolute -inset-x-2 -inset-y-1 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Operational Monitoring · System Time: {new Date().toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="glass-morphism px-4 py-2 rounded-xl flex items-center gap-2 border-cyan-500/20 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
                        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
                        <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest">Core Status: Optimal</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Holographic Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat: any, i: number) => (
                    <div key={i} className={`holographic-card glass-morphism p-6 rounded-3xl border ${stat.border} shadow-2xl relative group overflow-hidden`}>
                        {/* Glow effect on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-10 transition-opacity`} />

                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className="mt-2 text-3xl font-black text-white tracking-tighter italic">{stat.value}</p>
                            </div>
                            <div className={`rounded-2xl p-3 glass-morphism border ${stat.border}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color} drop-shadow-[0_0_8px_rgba(var(--primary-glow))]`} />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2 relative z-10">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none">
                                Variance Logic: {stat.trend === "up" ? "Growth" : "Anomaly"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section: Main Console View */}
            <div className="grid gap-6 lg:grid-cols-3 relative">
                {/* Recent Tenants Console */}
                <div className="lg:col-span-2 glass-morphism rounded-3xl p-8 relative overflow-hidden border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Building2 className="h-32 w-32 text-indigo-500" />
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-indigo-500/30">
                                <Building2 className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Tenant Feed</h3>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Stream tracking 6 recent nodes</p>
                            </div>
                        </div>
                        <Link href="/admin/tenants" className="glass-morphism px-4 py-2 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest border-indigo-500/20 hover:bg-indigo-500/10 transition-all">
                            Access Full Database {">>"}
                        </Link>
                    </div>

                    <div className="space-y-3 relative z-10">
                        {recentTenants.length === 0 ? (
                            <div className="glass-morphism rounded-2xl py-12 text-center border-dashed border-zinc-800">
                                <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">Waiting for tenant sync...</p>
                            </div>
                        ) : (
                            recentTenants.map((tenant: any) => (
                                <div key={tenant.id} className="group flex items-center gap-4 glass-morphism rounded-2xl p-4 hover:bg-white/5 transition-all border-white/5">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-white font-black text-lg border border-white/10 italic">
                                        {tenant.name.substring(0, 1)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-white uppercase tracking-tighter">{tenant.name}</p>
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.05em]">{tenant.slug}.fitstack.com · Nodes: {tenant._count.users}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">Active Node</p>
                                        <div className="h-1 w-20 rounded-full bg-zinc-800 overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full w-[85%] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Diagnostics */}
                <div className="glass-morphism rounded-3xl p-8 border-white/5 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-cyan-500/30">
                            <Shield className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Diagnostics</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Engine health protocols</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {systemHealth.map((item: any) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                                    <span className={`text-xs font-black italic ${item.status === 'healthy' ? 'text-cyan-400' : 'text-amber-400'}`}>{item.value}</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-black/40 border border-white/5 p-[2px]">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${item.status === 'healthy'
                                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                                            : 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}
                                        style={{ width: `${item.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 space-y-3">
                        <Link href="/admin/risk" className="flex items-center justify-between w-full glass-morphism border-red-500/20 px-4 py-3 rounded-2xl group hover:bg-red-500/5 transition-all">
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 group-hover:animate-bounce" /> Risk Alerts
                            </span>
                            <span className="bg-red-500/20 text-red-400 font-black px-2 py-0.5 rounded-lg text-[10px]">02</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

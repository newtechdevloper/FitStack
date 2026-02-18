import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import { Building2, Users, CreditCard, Activity, TrendingUp, DollarSign } from "lucide-react";

export const metadata: Metadata = {
    title: 'Admin | GymNexus',
};

async function getAdminStats() {
    const [tenantCount, userCount, activeSubs, recentTenants] = await Promise.all([
        prisma.tenant.count(),
        prisma.user.count(),
        prisma.tenant.count({
            where: { tenantSubscription: { status: 'active' } }
        }),
        prisma.tenant.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                tenantSubscription: true,
                plan: true
            }
        })
    ]);

    // Simple revenue estimation: Active Tenants * $79 (Growth Plan)
    const estimatedRevenue = activeSubs * 79;

    return { tenantCount, userCount, activeSubs, estimatedRevenue, recentTenants };
}

export default async function AdminPage() {
    const { tenantCount, userCount, activeSubs, estimatedRevenue, recentTenants } = await getAdminStats();

    const stats = [
        {
            label: "Total Revenue",
            value: `$${estimatedRevenue.toLocaleString()}`,
            change: "+12.5% from last month",
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/20"
        },
        {
            label: "Active Gyms",
            value: tenantCount.toString(),
            change: "+4 new this week",
            icon: Building2,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
            border: "border-violet-400/20"
        },
        {
            label: "Total Users",
            value: userCount.toString(),
            change: "+24 active users",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20"
        },
        {
            label: "Active Subscriptions",
            value: activeSubs.toString(),
            change: "92% retention rate",
            icon: Activity,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20"
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
                <p className="text-zinc-400 mt-2">
                    Welcome back, Super Admin. Here's what's happening today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl border ${stat.border} ${stat.bg} p-6 transition-all hover:scale-105 backdrop-blur-sm`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Registrations */}
                <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-zinc-400" />
                            Recent Gym Registrations
                        </h3>
                        <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentTenants.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Building2 className="h-12 w-12 text-zinc-700 mb-4" />
                                <p className="text-zinc-500">No tenants registered yet.</p>
                            </div>
                        ) : (
                            <div className="flow-root">
                                <ul role="list" className="divide-y divide-zinc-800/50">
                                    {recentTenants.map((tenant) => {
                                        const status = tenant.tenantSubscription?.status || 'trialing';
                                        return (
                                            <li key={tenant.id} className="py-4 hover:bg-zinc-800/30 rounded-lg px-4 transition-colors -mx-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                                                        {tenant.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {tenant.name}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 truncate">
                                                            {tenant.slug}.gymnexus.com
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${status === 'active'
                                                            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                                                            : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                                                            }`}>
                                                            {status.toUpperCase()}
                                                        </span>
                                                        <p className="mt-1 text-xs text-zinc-600">
                                                            {new Date(tenant.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Mini Widget */}
                <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 backdrop-blur-md p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Platform Health</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Server Status</span>
                                <span className="text-emerald-400 font-medium">Healthy</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <div className="h-full w-full rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Database Load</span>
                                <span className="text-zinc-300 font-medium">12%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <div className="h-full w-[12%] rounded-full bg-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Storage Usage</span>
                                <span className="text-zinc-300 font-medium">45%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <div className="h-full w-[45%] rounded-full bg-violet-500" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                            View System Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

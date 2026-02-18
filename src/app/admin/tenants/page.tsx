import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Filter, Download } from "lucide-react";
import { TenantActions } from "./tenant-actions";

export default async function AdminTenantsPage() {
    const tenants = await prisma.tenant.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            tenantSubscription: true,
            plan: true,
            _count: {
                select: { users: true }
            }
        }
    });

    return (
        <div className="space-y-8">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Tenants Management
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        Manage all registered gyms and their subscription status.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                        <Plus className="h-4 w-4" />
                        Create Gym
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search gyms by name or slug..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <Filter className="h-4 w-4" />
                        Status
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <Filter className="h-4 w-4" />
                        Plan
                    </button>
                </div>
            </div>

            {/* Tenants Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-950/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gym Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Users</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {tenants.map((tenant) => {
                                const status = tenant.tenantSubscription?.status || 'trialing';
                                return (
                                    <tr key={tenant.id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                                                    {tenant.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                                                        {tenant.name}
                                                    </div>
                                                    <div className="text-xs text-zinc-500">
                                                        {tenant.slug}.gymnexus.com
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize">
                                                {tenant.plan?.key || 'None'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status === 'active'
                                                ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                                                : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                                                {status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                            {tenant._count.users} members
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <TenantActions tenantId={tenant.id} isSuspended={status === 'canceled'} />
                                        </td>
                                    </tr>
                                )
                            })}
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                                <Search className="h-6 w-6 text-zinc-700" />
                                            </div>
                                            <p>No tenants found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Visual Only) */}
                <div className="bg-zinc-950/50 px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
                    <div className="text-xs text-zinc-500">
                        Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{tenants.length}</span> of <span className="font-medium text-white">{tenants.length}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 rounded-lg border border-zinc-800 text-xs font-medium text-zinc-500 disabled:opacity-50">Previous</button>
                        <button disabled className="px-3 py-1 rounded-lg border border-zinc-800 text-xs font-medium text-zinc-500 disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

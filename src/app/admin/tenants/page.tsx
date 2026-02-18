import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import {
    Building2, Users, CreditCard, ExternalLink, Shield, Trash2,
    PauseCircle, PlayCircle, Clock, ArrowUpRight, Search, Filter,
    MoreVertical, Crown, AlertTriangle, CheckCircle, XCircle
} from "lucide-react";
import { deleteTenantAdmin, suspendTenant, reactivateTenant, extendTrial } from "../actions";

export const metadata: Metadata = { title: 'Tenants | Super Admin' };

async function getTenants() {
    return prisma.tenant.findMany({
        include: {
            plan: true,
            tenantSubscription: true,
            _count: { select: { users: true, classes: true, bookings: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function TenantsPage() {
    const tenants = await getTenants();
    const plans = await prisma.plan.findMany();

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        active: { label: 'Active', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle },
        trialing: { label: 'Trialing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock },
        canceled: { label: 'Suspended', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
        past_due: { label: 'Past Due', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: AlertTriangle },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tenant Management</h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Full control over all {tenants.length} registered gyms.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
                        {tenants.filter(t => t.tenantSubscription?.status === 'active').length} Active
                    </span>
                    <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                        {tenants.filter(t => t.tenantSubscription?.status === 'canceled').length} Suspended
                    </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total Gyms", value: tenants.length, color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
                    { label: "Total Members", value: tenants.reduce((a, t) => a + t._count.users, 0).toLocaleString(), color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
                    { label: "Total Classes", value: tenants.reduce((a, t) => a + t._count.classes, 0).toLocaleString(), color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
                    { label: "Total Bookings", value: tenants.reduce((a, t) => a + t._count.bookings, 0).toLocaleString(), color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
                ].map((s, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${s.bg}`}>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</p>
                        <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Tenant Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-zinc-400" />
                        All Gyms
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Showing all</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900/80">
                            <tr>
                                {['Gym', 'Plan', 'Members', 'Status', 'Created', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-medium text-zinc-500 px-6 py-3 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {tenants.map((tenant) => {
                                const status = tenant.tenantSubscription?.status || 'trialing';
                                const cfg = statusConfig[status] || statusConfig.trialing;
                                const isSuspended = status === 'canceled';

                                return (
                                    <tr key={tenant.id} className={`hover:bg-zinc-800/30 transition-colors group ${isSuspended ? 'opacity-60' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center text-violet-300 font-bold text-sm border border-violet-500/20 flex-shrink-0">
                                                    {tenant.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">{tenant.name}</p>
                                                    <a
                                                        href={`https://${tenant.slug}.gymnexus.com`}
                                                        target="_blank"
                                                        className="text-xs text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-1"
                                                    >
                                                        {tenant.slug}.gymnexus.com
                                                        <ExternalLink className="h-2.5 w-2.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {tenant.plan?.key === 'PRO' && <Crown className="h-3.5 w-3.5 text-amber-400" />}
                                                <span className="text-zinc-300 text-sm">{tenant.plan?.name || 'No Plan'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Users className="h-3.5 w-3.5" />
                                                <span className="text-sm">{tenant._count.users}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${cfg.color}`}>
                                                <cfg.icon className="h-3 w-3" />
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 text-xs">
                                            {new Date(tenant.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Impersonate */}
                                                <a
                                                    href={`/admin/impersonate?tenantId=${tenant.id}`}
                                                    className="rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1"
                                                    title="Impersonate"
                                                >
                                                    <Shield className="h-3 w-3" />
                                                    Login As
                                                </a>

                                                {/* Suspend / Reactivate */}
                                                {isSuspended ? (
                                                    <form action={reactivateTenant.bind(null, tenant.id)}>
                                                        <button type="submit" className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1">
                                                            <PlayCircle className="h-3 w-3" /> Reactivate
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <form action={suspendTenant.bind(null, tenant.id)}>
                                                        <button type="submit" className="rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1">
                                                            <PauseCircle className="h-3 w-3" /> Suspend
                                                        </button>
                                                    </form>
                                                )}

                                                {/* Extend Trial */}
                                                <form action={extendTrial.bind(null, tenant.id, 30)}>
                                                    <button type="submit" className="rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> +30d
                                                    </button>
                                                </form>

                                                {/* Delete */}
                                                <form action={deleteTenantAdmin.bind(null, tenant.id)}>
                                                    <button
                                                        type="submit"
                                                        className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1"
                                                        onClick={(e) => { if (!confirm(`Delete ${tenant.name}? This is irreversible.`)) e.preventDefault(); }}
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <Building2 className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                                        <p className="text-zinc-500 text-sm">No gyms registered yet.</p>
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

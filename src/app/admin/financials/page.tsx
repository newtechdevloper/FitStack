import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = { title: 'Financials | Super Admin' };

async function getFinancialData() {
    const [tenants, subscriptions] = await Promise.all([
        prisma.tenant.findMany({
            include: {
                plan: true,
                tenantSubscription: true,
                _count: { select: { users: true } }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.tenantSubscription.findMany({
            include: { plan: true, tenant: true }
        })
    ]);

    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const pastDue = subscriptions.filter(s => s.status === 'past_due');
    const canceled = subscriptions.filter(s => s.status === 'canceled');
    const mrr = activeSubs.length * 79;

    return { tenants, subscriptions, activeSubs, pastDue, canceled, mrr };
}

export default async function FinancialsPage() {
    const { tenants, subscriptions, activeSubs, pastDue, canceled, mrr } = await getFinancialData();

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        active: { label: 'Active', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle },
        past_due: { label: 'Past Due', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: AlertCircle },
        canceled: { label: 'Canceled', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20', icon: TrendingDown },
        trialing: { label: 'Trialing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock },
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Financial Control</h1>
                <p className="text-zinc-400 mt-1 text-sm">Platform revenue, billing status, and subscription management.</p>
            </div>

            {/* KPI Row */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "MRR", value: `$${mrr.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
                    { label: "Active Subs", value: activeSubs.length, icon: CheckCircle, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
                    { label: "Past Due", value: pastDue.length, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
                    { label: "Churned", value: canceled.length, icon: TrendingDown, color: "text-zinc-400", bg: "bg-zinc-400/10 border-zinc-400/20" },
                ].map((kpi, i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${kpi.bg}`}>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </div>
                        <p className={`mt-2 text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Subscription Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-zinc-400" />
                        All Subscriptions
                    </h3>
                    <span className="text-xs text-zinc-500">{subscriptions.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900/80">
                            <tr>
                                {['Gym', 'Plan', 'Status', 'Period End', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-medium text-zinc-500 px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {subscriptions.map((sub) => {
                                const cfg = statusConfig[sub.status] || statusConfig.trialing;
                                return (
                                    <tr key={sub.id} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white text-sm">{sub.tenant.name}</p>
                                            <p className="text-xs text-zinc-500">{sub.tenant.slug}.FitStack.com</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm">{sub.plan.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${cfg.color}`}>
                                                <cfg.icon className="h-3 w-3" />
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-xs">
                                            {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">Override</button>
                                                <span className="text-zinc-700">·</span>
                                                <button className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">Cancel</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {subscriptions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">No subscriptions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

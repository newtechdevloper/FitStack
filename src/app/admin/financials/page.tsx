import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, AlertCircle, CheckCircle, Clock, Activity } from "lucide-react";
import { FinancialTableClient } from "./financial-table-client";

export const metadata: Metadata = { title: 'Financials | Super Admin' };

async function getFinancialData() {
    const [tenants, subscriptions, plans] = await Promise.all([
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
        }),
        prisma.plan.findMany()
    ]);

    const activeSubs = subscriptions.filter((s: any) => s.status === 'active');
    const pastDue = subscriptions.filter((s: any) => s.status === 'past_due');
    const canceled = subscriptions.filter((s: any) => s.status === 'canceled');
    const mrr = activeSubs.length * 79; // Logic for average MRR

    return { tenants, subscriptions, activeSubs, pastDue, canceled, mrr, plans };
}

export default async function FinancialsPage() {
    let data;
    try {
        const rawData = await getFinancialData();
        data = JSON.parse(JSON.stringify(rawData));
    } catch (error) {
        console.error("Financial Data Fetch Error:", error);
        return <div>Error loading financial registry.</div>;
    }
    const { tenants, subscriptions, activeSubs, pastDue, canceled, mrr, plans } = data;

    const statusConfig: Record<string, { label: string; color: string }> = {
        active: { label: 'Active', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
        past_due: { label: 'Past Due', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
        canceled: { label: 'Canceled', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
        trialing: { label: 'Trialing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Financial Core
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Monitoring platform revenue & subscription nodes
                    </p>
                </div>
            </div>

            {/* KPI Row - Holographic cards */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Yield Stream (MRR)", value: `$${mrr.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", border: "border-emerald-500/20" },
                    { label: "Active Nodes", value: activeSubs.length, icon: CheckCircle, color: "text-blue-400", border: "border-blue-500/20" },
                    { label: "Neural Drift (Due)", value: pastDue.length, icon: AlertCircle, color: "text-amber-400", border: "border-amber-500/20" },
                    { label: "Decommissioned", value: canceled.length, icon: TrendingDown, color: "text-zinc-500", border: "border-zinc-500/20" },
                ].map((kpi: any, i: number) => (
                    <div key={i} className={`holographic-card glass-morphism p-6 rounded-3xl border ${kpi.border} group`}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">{kpi.label}</p>
                            <kpi.icon className={`h-4 w-4 ${kpi.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <p className={`text-3xl font-black text-white italic tracking-tighter`}>{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Subscription Registry */}
            <FinancialTableClient
                subscriptions={subscriptions}
                plans={plans}
                statusConfig={statusConfig}
            />
        </div>
    );
}

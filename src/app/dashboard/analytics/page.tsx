import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateSnapshot } from "@/lib/analytics";
import { TrendingUp, DollarSign, Activity, CreditCard, ArrowUpRight } from "lucide-react";

async function getAnalyticsData(tenantId: string) {
    await generateSnapshot(tenantId);
    const snapshots = await prisma.financialSnapshot.findMany({
        where: { tenantId },
        orderBy: { month: 'asc' },
        take: 6
    });
    return snapshots;
}

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        select: { tenantId: true }
    });

    if (!tenantUser?.tenantId) redirect("/onboarding");

    const snapshots = await getAnalyticsData(tenantUser.tenantId);
    const currentMonth = snapshots[snapshots.length - 1];

    const kpis = [
        { label: "Predictive MRR", value: `$${currentMonth?.mrr.toString() || "0"}`, icon: DollarSign, color: "text-cyan-400" },
        { label: "Usage Payload", value: `$${currentMonth?.usageFees.toString() || "0"}`, icon: Activity, color: "text-indigo-400" },
        { label: "Platform Tax", value: `$${currentMonth?.platformFees.toString() || "0"}`, icon: CreditCard, color: "text-purple-400" },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                    Neural Analytics
                </h1>
                <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    {">>"} Decrypting financial streams and node growth metrics
                </p>
            </div>

            {/* KPI Grid - Holographic Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {kpis.map((kpi, i) => (
                    <div key={i} className="holographic-card glass-morphism rounded-[2.5rem] p-8 border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-white/5">
                                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-zinc-800 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <dt className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 relative z-10">{kpi.label}</dt>
                        <dd className="text-3xl font-black text-white tracking-tighter italic uppercase relative z-10">{kpi.value}</dd>

                        {/* Decorative Background Element */}
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/10 transition-all" />
                    </div>
                ))}
            </div>

            {/* History Feed - Glassmorphism Table */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-zinc-700" />
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Temporal Revenue Stream</h2>
                </div>

                <div className="glass-morphism rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left italic">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/2">
                                    <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Time Index</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Core MRR</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Bursted Usage</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Aggregate Yield</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 relative z-10 text-zinc-400">
                                {snapshots.map((snap: any) => (
                                    <tr key={snap.id} className="hover:bg-white/5 transition-all group/row">
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-white uppercase tracking-tighter">{snap.month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-bold font-mono tracking-widest">${snap.mrr.toString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400">${snap.usageFees.toString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-[10px] font-black text-cyan-400 font-mono tracking-widest group-hover/row:text-white transition-colors">
                                                ${(Number(snap.mrr) + Number(snap.usageFees)).toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

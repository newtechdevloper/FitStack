"use client";

import { useState } from "react";
import {
    CreditCard, CheckCircle, Clock, X,
    Zap, Calendar, DollarSign, TrendingUp, Filter, TriangleAlert, TrendingDown, Shield, UserSearch, AlertCircle
} from "lucide-react";
import { overridePlan, extendTrial, suspendTenant, reactivateTenant } from "../actions";

interface FinancialTableClientProps {
    subscriptions: any[];
    plans: any[];
    statusConfig: any;
}

export function FinancialTableClient({ subscriptions, plans, statusConfig }: FinancialTableClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSub, setSelectedSub] = useState<any | null>(null);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const filteredSubscriptions = subscriptions.filter(s =>
        s.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'past_due': return AlertCircle;
            case 'canceled': return TrendingDown;
            case 'trialing': return Clock;
            default: return Clock;
        }
    };

    const handleExtend = async (days: number) => {
        if (!selectedSub) return;
        setIsLoading(true);
        await extendTrial(selectedSub.tenantId, days);
        setIsLoading(false);
        setIsOverrideModalOpen(false);
    };

    const handleOverridePlan = async (planId: string) => {
        if (!selectedSub) return;
        setIsLoading(true);
        await overridePlan(selectedSub.tenantId, planId);
        setIsLoading(false);
        setIsOverrideModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <input
                    type="text"
                    placeholder="Filter billing records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 glass-morphism border-white/5 bg-white/5 text-white text-[10px] px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-zinc-600 font-bold uppercase tracking-widest"
                />
            </div>

            {/* Table */}
            <div className="glass-morphism rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5">
                            <tr>
                                {['Hub Identity', 'Tier', 'Status', 'Sync Date', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-[10px] font-black text-zinc-500 px-8 py-4 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredSubscriptions.map((sub) => {
                                const cfg = statusConfig[sub.status] || statusConfig.trialing;
                                const StatusIcon = getStatusIcon(sub.status);
                                return (
                                    <tr key={sub.id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <p className="font-black text-white text-sm uppercase tracking-tighter leading-none mb-1">{sub.tenant.name}</p>
                                                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none">Node: {sub.tenant.slug}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{sub.plan.name}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black italic uppercase tracking-widest border border-white/10 ${cfg.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
                                                {cfg.label}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                                            {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSub(sub);
                                                        setIsOverrideModalOpen(true);
                                                    }}
                                                    className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors"
                                                >
                                                    Override
                                                </button>
                                                {sub.status === 'canceled' ? (
                                                    <button
                                                        onClick={() => reactivateTenant(sub.tenantId)}
                                                        className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
                                                    >
                                                        Restore
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Cancel active subscription for ${sub.tenant.name}?`)) {
                                                                suspendTenant(sub.tenantId);
                                                            }
                                                        }}
                                                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                                                    >
                                                        Abort
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Override Modal */}
            {isOverrideModalOpen && selectedSub && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="glass-morphism rounded-3xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <DollarSign className="h-5 w-5 text-emerald-400" />
                                Billing Intervention: {selectedSub.tenant.name}
                            </h3>
                            <button onClick={() => setIsOverrideModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Tier Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Enforce Tier Protocol</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {plans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => handleOverridePlan(plan.id)}
                                            disabled={isLoading || selectedSub.planId === plan.id}
                                            className={`p-4 rounded-xl border transition-all text-left ${selectedSub.planId === plan.id
                                                ? "border-emerald-500/50 bg-emerald-500/10 opacity-50 cursor-default"
                                                : "border-white/5 bg-white/5 hover:border-white/20"
                                                }`}
                                        >
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{plan.name}</p>
                                            <p className="text-[8px] text-zinc-500 font-bold uppercase">Switch Protocol</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Extension Logic */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Extend Signal (Trial/Billing)</label>
                                <div className="flex gap-2">
                                    {[7, 14, 30, 90].map((days) => (
                                        <button
                                            key={days}
                                            onClick={() => handleExtend(days)}
                                            disabled={isLoading}
                                            className="flex-1 glass-morphism border-white/5 bg-white/5 py-3 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:border-indigo-500/30 transition-all border outline-none"
                                        >
                                            +{days}D
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-white/2 border-t border-white/5 flex justify-end">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mr-auto flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                Manual Registry Modification
                            </p>
                            <button
                                onClick={() => setIsOverrideModalOpen(false)}
                                className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Close Console
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

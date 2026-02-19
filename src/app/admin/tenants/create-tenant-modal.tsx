"use client";

import { useState } from "react";
import { Plus, X, Building2, Globe, CheckCircle, Zap } from "lucide-react";
import { createTenant } from "../actions";

export function CreateTenantModal({ plans }: { plans: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [planId, setPlanId] = useState(plans[0]?.id || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await createTenant({ name, slug, planId });
            setIsOpen(false);
            setName("");
            setSlug("");
        } catch (err: any) {
            setError(err.message || "Failed to create hub");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="neon-border-cyan glass-morphism text-cyan-400 font-black text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-2xl hover:bg-cyan-500/10 transition-all flex items-center gap-3 shadow-2xl"
            >
                <Plus className="h-4 w-4" />
                Initialize Hub
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-morphism rounded-3xl border border-white/10 w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-indigo-400" />
                        New Hub Protocol
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-tight">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Network Identity</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Iron Forge Gym"
                            className="w-full glass-morphism border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-700 font-bold uppercase tracking-tight"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Node Domain (Slug)</label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                placeholder="iron-forge"
                                className="w-full glass-morphism border-white/10 text-white text-sm pl-4 pr-32 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-700 font-mono tracking-widest lowercase"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600 uppercase tracking-widest pointer-events-none">
                                .fitstack.com
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Operation Tier</label>
                        <div className="grid grid-cols-2 gap-3">
                            {plans.map((plan) => (
                                <button
                                    key={plan.id}
                                    type="button"
                                    onClick={() => setPlanId(plan.id)}
                                    className={`p-4 rounded-xl border transition-all text-left group ${planId === plan.id
                                            ? "border-indigo-500/50 bg-indigo-500/10"
                                            : "border-white/5 bg-white/5 hover:border-white/20"
                                        }`}
                                >
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${planId === plan.id ? "text-indigo-400" : "text-zinc-500"
                                        }`}>
                                        {plan.name}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 font-medium leading-tight">
                                        {plan.key === 'PRO' ? 'Enterprise Limits' : 'Standard Node'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                            <Zap className="h-3 w-3" />
                            Direct Provisioning
                        </div>
                        <button
                            disabled={isLoading}
                            className="neon-border-cyan glass-morphism text-cyan-400 font-black text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl hover:bg-cyan-500/10 disabled:opacity-50 transition-all flex items-center gap-3 shadow-2xl"
                        >
                            {isLoading ? (
                                "Initializing..."
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Launch Hub
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

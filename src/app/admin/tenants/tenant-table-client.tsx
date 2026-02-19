"use client";

import { useState } from "react";
import {
    Search, Filter, Shield, PauseCircle, PlayCircle, Trash2,
    MoreVertical, Crown, CheckCircle, XCircle, Clock, Zap, ExternalLink, TriangleAlert
} from "lucide-react";
import { deleteTenantAdmin, suspendTenant, reactivateTenant, toggleTenantFeature, impersonateTenant } from "../actions";

interface TenantTableClientProps {
    initialTenants: any[];
    statusConfig: any;
    plans: any[];
}

export function TenantTableClient({ initialTenants, statusConfig, plans }: TenantTableClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

    const filteredTenants = initialTenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'trialing': return Clock;
            case 'canceled': return XCircle;
            case 'past_due': return TriangleAlert;
            default: return Clock;
        }
    };

    const handleFeatureToggle = async (tenantId: string, feature: string) => {
        await toggleTenantFeature(tenantId, feature);
        // The page will revalidate, but we can also optimistically update local state if needed
    };

    return (
        <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search hubs by name or slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass-morphism border-white/5 bg-white/5 text-white text-xs pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 font-bold uppercase tracking-tight"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="glass-morphism border-white/5 p-3 rounded-2xl text-zinc-400 hover:text-white transition-colors">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-morphism rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5">
                            <tr>
                                {['Hub Name', 'Tier', 'Network Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-[10px] font-black text-zinc-500 px-8 py-4 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTenants.map((tenant) => {
                                const status = tenant.tenantSubscription?.status || 'trialing';
                                const cfg = statusConfig[status] || statusConfig.trialing;
                                const isSuspended = status === 'canceled';
                                const activeFeatures = JSON.parse(tenant.features || "[]");

                                return (
                                    <tr key={tenant.id} className={`hover:bg-white/5 transition-all group ${isSuspended ? 'opacity-40' : ''}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center text-white font-black text-sm border border-white/10 italic">
                                                    {tenant.name.substring(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-sm uppercase tracking-tighter leading-none mb-1">{tenant.name}</p>
                                                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{tenant.slug}.fitstack.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {tenant.plan?.key === 'PRO' && <Crown className="h-3.5 w-3.5 text-amber-400 animate-pulse" />}
                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{tenant.plan?.name || 'No Tier'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black italic uppercase tracking-widest border border-white/10 ${cfg.color}`}>
                                                <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                {/* Impersonate */}
                                                <button
                                                    onClick={() => impersonateTenant(tenant.id)}
                                                    className="neon-border-cyan glass-morphism text-cyan-400 hover:bg-cyan-500/10 transition-colors p-2 rounded-xl"
                                                    title="Impersonate Hub"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                </button>

                                                {/* Features */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedTenant(tenant);
                                                        setIsFeatureModalOpen(true);
                                                    }}
                                                    className="neon-border glass-morphism text-indigo-400 hover:bg-indigo-500/10 transition-colors p-2 rounded-xl"
                                                    title="Manage Features"
                                                >
                                                    <Zap className="h-4 w-4" />
                                                </button>

                                                {/* Suspend / Reactivate */}
                                                {isSuspended ? (
                                                    <button
                                                        onClick={() => reactivateTenant(tenant.id)}
                                                        className="neon-border glass-morphism text-emerald-400 hover:bg-emerald-500/10 transition-colors p-2 rounded-xl"
                                                        title="Reactivate Network"
                                                    >
                                                        <PlayCircle className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => suspendTenant(tenant.id)}
                                                        className="neon-border glass-morphism text-amber-400 hover:bg-amber-500/10 transition-colors p-2 rounded-xl"
                                                        title="Suspend Hub"
                                                    >
                                                        <PauseCircle className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                <button
                                                    onClick={async () => {
                                                        if (confirm(`Purge hub ${tenant.name}? This is permanent.`)) {
                                                            await deleteTenantAdmin(tenant.id);
                                                        }
                                                    }}
                                                    className="neon-border glass-morphism text-red-500 hover:bg-red-500/10 transition-colors p-2 rounded-xl"
                                                    title="Purge Hub"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredTenants.length === 0 && (
                        <div className="p-20 text-center">
                            <Search className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic text-glow">No matching network nodes found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Feature Management Modal */}
            {isFeatureModalOpen && selectedTenant && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-morphism rounded-3xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <Zap className="h-5 w-5 text-indigo-400" />
                                Feature Overrides: {selectedTenant.name}
                            </h3>
                            <button onClick={() => setIsFeatureModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            {["corporate_billing", "waitlist_auto_promote", "custom_domains", "ai_recommendations", "schema_isolation"].map((feature: string) => {
                                const currentFeatures = JSON.parse(selectedTenant.features || "[]");
                                const isEnabled = Array.isArray(currentFeatures) && currentFeatures.includes(feature);
                                return (
                                    <div key={feature} className="flex items-center justify-between p-4 rounded-2xl glass-morphism border border-white/5 hover:bg-white/5 transition-all">
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest italic">{feature.replace(/_/g, " ")}</p>
                                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight">Manual Node Override</p>
                                        </div>
                                        <button
                                            onClick={() => handleFeatureToggle(selectedTenant.id, feature)}
                                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all border border-white/10 ${isEnabled ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-zinc-900'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xl transition-all duration-300 ${isEnabled ? 'translate-x-7 scale-110' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-8 py-6 bg-white/2 border-t border-white/5 flex justify-end">
                            <button
                                onClick={() => setIsFeatureModalOpen(false)}
                                className="neon-border-cyan glass-morphism text-cyan-400 font-black text-xs uppercase tracking-[0.2em] px-8 py-3 rounded-xl hover:bg-cyan-500/10 transition-all font-mono"
                            >
                                Close Manifest
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

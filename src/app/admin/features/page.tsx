"use client";

import { useState } from "react";
import { Zap, Building2, Globe, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const defaultFlags = [
    { id: "corporate_billing", name: "Corporate Billing", description: "Allow corporate accounts to manage consolidated invoices.", enabled: true, scope: "GLOBAL", category: "Billing" },
    { id: "waitlist_auto_promote", name: "Waitlist Auto-Promote", description: "Automatically promote waitlisted users when spots open.", enabled: true, scope: "GLOBAL", category: "Booking" },
    { id: "schema_isolation", name: "Schema Isolation", description: "Use per-tenant Postgres schemas instead of row-level isolation.", enabled: false, scope: "GLOBAL", category: "Infrastructure" },
    { id: "ai_recommendations", name: "AI Class Recommendations", description: "Use ML to recommend classes to members based on history.", enabled: false, scope: "GLOBAL", category: "AI" },
    { id: "custom_domains", name: "Custom Domains", description: "Allow gyms to use their own domain (e.g. gym.com).", enabled: true, scope: "PRO_ONLY", category: "Platform" },
    { id: "whatsapp_notifications", name: "WhatsApp Notifications", description: "Send booking and billing alerts via WhatsApp.", enabled: false, scope: "GLOBAL", category: "Communication" },
    { id: "advanced_analytics", name: "Advanced Analytics", description: "Show revenue forecasting and churn prediction dashboards.", enabled: true, scope: "PRO_ONLY", category: "Analytics" },
    { id: "maintenance_mode", name: "Maintenance Mode", description: "Show maintenance page to all non-admin users.", enabled: false, scope: "GLOBAL", category: "Platform" },
];

const categoryColors: Record<string, string> = {
    Billing: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Booking: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Infrastructure: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    AI: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Platform: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
    Communication: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    Analytics: "text-pink-400 bg-pink-400/10 border-pink-400/20",
};

export default function FeatureFlagsPage() {
    const [flags, setFlags] = useState(defaultFlags);
    const [saved, setSaved] = useState<string | null>(null);

    const toggle = (id: string) => {
        setFlags((prev: any[]) => prev.map((f: any) => f.id === id ? { ...f, enabled: !f.enabled } : f));
        setSaved(id);
        setTimeout(() => setSaved(null), 1500);
    };

    const categories = [...new Set(flags.map((f: any) => f.category))];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Feature Matrix
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Dynamic platform capability modulation
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="glass-morphism px-4 py-2 rounded-xl border-emerald-500/20">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            {flags.filter((f: any) => f.enabled).length} Active Modules
                        </span>
                    </div>
                </div>
            </div>

            {/* Warning Banner - Futuristic style */}
            <div className="glass-morphism rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-4 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 animate-pulse relative z-10" />
                <div className="relative z-10">
                    <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest leading-none mb-1">High-Privilege Area</p>
                    <p className="text-[10px] text-amber-400/70 font-medium uppercase tracking-tight">Toggle modulates global logic streams. Execute with absolute certainty.</p>
                </div>
            </div>

            {/* Flags by Category - Glassmorphism */}
            <div className="grid gap-8">
                {categories.map((category: any) => (
                    <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-8 w-8 glass-morphism rounded-lg flex items-center justify-center border-white/5">
                                <Zap className="h-4 w-4 text-zinc-400" />
                            </div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{category} Ecosystem</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="glass-morphism rounded-3xl border border-white/5 shadow-2xl overflow-hidden divide-y divide-white/5">
                            {flags.filter((f: any) => f.category === category).map((flag: any) => (
                                <div key={flag.id} className="px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                                    <div className="flex-1 min-w-0 pr-8">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="text-sm font-black text-white uppercase tracking-tighter italic">{flag.name}</p>
                                            {flag.scope === 'PRO_ONLY' && (
                                                <span className="text-[8px] font-black text-amber-400 glass-morphism border-amber-500/20 rounded-lg px-2 py-0.5 uppercase tracking-widest">Tier-Locked</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight leading-relaxed">{flag.description}</p>
                                    </div>
                                    <div className="flex items-center gap-6 flex-shrink-0">
                                        {saved === flag.id && (
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 animate-out fade-out duration-1000">
                                                <CheckCircle className="h-3 w-3" /> Sync OK
                                            </span>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggle(flag.id)}
                                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all focus:outline-none border border-white/10 ${flag.enabled ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-zinc-900'}`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xl transition-all duration-300 ${flag.enabled ? 'translate-x-7 scale-110' : 'translate-x-1'}`}
                                                />
                                            </button>
                                            <span className={`text-[10px] font-black w-16 text-right uppercase tracking-[0.2em] ${flag.enabled ? 'text-indigo-400' : 'text-zinc-700'}`}>
                                                {flag.enabled ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

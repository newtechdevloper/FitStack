"use client";

import { useState } from "react";
import { Zap, Toggle, Building2, Globe, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
        setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
        setSaved(id);
        setTimeout(() => setSaved(null), 1500);
    };

    const categories = [...new Set(flags.map(f => f.category))];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Feature Flags</h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Toggle platform features globally or per plan. Changes take effect immediately.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">
                        {flags.filter(f => f.enabled).length} Enabled
                    </span>
                    <span className="text-xs text-zinc-400 bg-zinc-400/10 border border-zinc-400/20 rounded-lg px-3 py-2">
                        {flags.filter(f => !f.enabled).length} Disabled
                    </span>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-amber-300">Super Admin Only</p>
                    <p className="text-xs text-amber-400/70 mt-0.5">Changes to feature flags affect all users immediately. Use with caution.</p>
                </div>
            </div>

            {/* Flags by Category */}
            {categories.map(category => (
                <div key={category} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-zinc-400" />
                        <h3 className="text-base font-semibold text-white">{category}</h3>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${categoryColors[category]}`}>{category}</span>
                    </div>
                    <div className="divide-y divide-zinc-800/30">
                        {flags.filter(f => f.category === category).map((flag) => (
                            <div key={flag.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors">
                                <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-semibold text-white">{flag.name}</p>
                                        {flag.scope === 'PRO_ONLY' && (
                                            <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5">PRO Only</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500">{flag.description}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {saved === flag.id && (
                                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" /> Saved
                                        </span>
                                    )}
                                    <button
                                        onClick={() => toggle(flag.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${flag.enabled ? 'bg-violet-600' : 'bg-zinc-700'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${flag.enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <span className={`text-xs font-medium w-14 text-right ${flag.enabled ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                        {flag.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

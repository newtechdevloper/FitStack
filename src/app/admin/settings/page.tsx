import { Save, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                    System Core Config
                </h1>
                <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    {">>"} Modulating global platform parameters & defaults
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* General Settings - Glassmorphism */}
                <div className="holographic-card glass-morphism rounded-3xl border border-white/5 p-8 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Save className="h-32 w-32 text-indigo-400" />
                    </div>

                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3 relative z-10">
                        <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-indigo-500/30">
                            <Save className="h-5 w-5 text-indigo-400" />
                        </div>
                        General Protocols
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Node Support Interface</label>
                            <input
                                type="email"
                                defaultValue="support@fitstack.com"
                                className="w-full glass-morphism border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold tracking-tight"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Network Identity</label>
                            <input
                                type="text"
                                defaultValue="FitStack"
                                className="w-full glass-morphism border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="pt-4 relative z-10">
                        <button className="neon-border-cyan glass-morphism text-cyan-400 font-black text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl hover:bg-cyan-500/10 transition-all flex items-center gap-3 shadow-2xl">
                            <Save className="h-4 w-4" />
                            Apply Directives
                        </button>
                    </div>
                </div>

                {/* Danger Zone - Futuristic Alert style */}
                <div className="glass-morphism rounded-3xl border border-red-500/20 p-8 space-y-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />

                    <h3 className="text-xl font-black text-red-400 italic uppercase tracking-tighter flex items-center gap-3 relative z-10">
                        <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-red-500/30">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        Critical Interventions
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all group">
                            <div>
                                <div className="text-white font-black uppercase tracking-tighter italic">Platform Blackout</div>
                                <div className="text-[10px] text-red-400/60 font-medium uppercase tracking-[0.05em] mt-1">Restrict all node access to Super Admin only.</div>
                            </div>
                            <button className="relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none border border-red-500/20 bg-zinc-900">
                                <span className="inline-block h-5 w-5 transform rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

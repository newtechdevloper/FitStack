"use client";

import { useState } from "react";
import { Megaphone, Send, Globe, Building2, Users, Bell, CheckCircle } from "lucide-react";

export default function AnnouncementsPage() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState("ALL");
    const [type, setType] = useState("INFO");
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        // In production: POST /api/admin/announcements
        console.log({ title, message, audience, type });
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setTitle("");
        setMessage("");
    };

    const pastAnnouncements = [
        { id: 1, title: "Scheduled Maintenance", message: "Platform will be down Feb 20 2-4 AM UTC.", audience: "ALL", type: "WARNING", sentAt: "Feb 18, 2026", reach: 1240 },
        { id: 2, title: "New Feature: Corporate Billing", message: "Corporate accounts can now manage consolidated invoices.", audience: "OWNERS", type: "INFO", sentAt: "Feb 15, 2026", reach: 89 },
        { id: 3, title: "Pricing Update", message: "Starter plan price increases to $35/mo from March 1.", audience: "ALL", type: "IMPORTANT", sentAt: "Feb 10, 2026", reach: 1240 },
    ];

    const typeColors: Record<string, string> = {
        INFO: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        WARNING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        IMPORTANT: "text-red-400 bg-red-400/10 border-red-400/20",
        SUCCESS: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                    Broadcast Command
                </h1>
                <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    {">>"} Initiating platform-wide communication protocols
                </p>
            </div>

            {/* Compose - Holographic Module */}
            <div className="holographic-card glass-morphism rounded-3xl p-8 border-indigo-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Megaphone className="h-40 w-40 text-indigo-400" />
                </div>

                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3 mb-8 relative z-10">
                    <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-indigo-500/30">
                        <Megaphone className="h-5 w-5 text-indigo-400" />
                    </div>
                    Draft Message
                </h3>

                <div className="grid gap-6 md:grid-cols-2 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Audience Targeting</label>
                        <select
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            className="w-full glass-morphism border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                        >
                            <option value="ALL">🌍 Global Broadcast</option>
                            <option value="OWNERS">🏢 Node Administrators</option>
                            <option value="MEMBERS">👥 Human Identities</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Priority Level</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full glass-morphism border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                        >
                            <option value="INFO">ℹ️ Information</option>
                            <option value="WARNING">⚠️ Warning Alert</option>
                            <option value="IMPORTANT">🚨 Critical Signal</option>
                            <option value="SUCCESS">✅ Operation Success</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 relative z-10 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Subject Header</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter transmission header..."
                            className="w-full glass-morphism border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 font-bold uppercase tracking-tight"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Payload Content</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Compose transmission payload..."
                            className="w-full glass-morphism border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 resize-none font-medium"
                        />
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
                        Multi-Channel Broadcast Protocol Active
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!title || !message}
                        className={`flex items-center gap-3 rounded-2xl px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-2xl ${sent
                            ? "bg-emerald-500 text-white shadow-emerald-500/20"
                            : "neon-border-cyan glass-morphism text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            }`}
                    >
                        {sent ? (
                            <><CheckCircle className="h-4 w-4" /> Broadcast Initiated</>
                        ) : (
                            <><Send className="h-4 w-4" /> Start Broadcast</>
                        )}
                    </button>
                </div>
            </div>

            {/* Past Announcements - History List */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Transmission Logs</h3>
                <div className="grid gap-3">
                    {pastAnnouncements.map((ann: any) => (
                        <div key={ann.id} className="glass-morphism rounded-2xl p-6 border-white/5 hover:bg-white/5 transition-all group relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg border italic uppercase tracking-widest ${typeColors[ann.type]}`}>{ann.type}</span>
                                        <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/5 px-2 py-0.5 rounded-lg glass-morphism">
                                            {ann.audience === 'ALL' ? <Globe className="h-2.5 w-2.5" /> : ann.audience === 'OWNERS' ? <Building2 className="h-2.5 w-2.5" /> : <Users className="h-2.5 w-2.5" />}
                                            {ann.audience} TARGET
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">{ann.title}</h4>
                                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-medium">{ann.message}</p>
                                </div>
                                <div className="text-right flex-shrink-0 flex items-center gap-6">
                                    <div>
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Impact Reach</p>
                                        <p className="text-xs font-black text-cyan-400 font-mono tracking-widest">{ann.reach.toLocaleString()}</p>
                                    </div>
                                    <div className="border-l border-white/5 pl-6">
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Log Date</p>
                                        <p className="text-xs font-black text-white font-mono">{ann.sentAt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

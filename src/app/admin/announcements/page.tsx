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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Global Announcements</h1>
                <p className="text-zinc-400 mt-1 text-sm">Broadcast messages to all gyms, owners, or members.</p>
            </div>

            {/* Compose */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 space-y-5">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-violet-400" />
                    Compose Announcement
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Audience</label>
                        <select
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        >
                            <option value="ALL">🌍 All Users</option>
                            <option value="OWNERS">🏢 Gym Owners Only</option>
                            <option value="MEMBERS">👥 Members Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        >
                            <option value="INFO">ℹ️ Info</option>
                            <option value="WARNING">⚠️ Warning</option>
                            <option value="IMPORTANT">🚨 Important</option>
                            <option value="SUCCESS">✅ Success</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Announcement title..."
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 placeholder:text-zinc-600"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder="Write your announcement..."
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 placeholder:text-zinc-600 resize-none"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Bell className="h-3.5 w-3.5" />
                        Will send via in-app notification + email
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!title || !message}
                        className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${sent
                                ? "bg-emerald-600 text-white"
                                : "bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            }`}
                    >
                        {sent ? (
                            <><CheckCircle className="h-4 w-4" /> Sent!</>
                        ) : (
                            <><Send className="h-4 w-4" /> Send Announcement</>
                        )}
                    </button>
                </div>
            </div>

            {/* Past Announcements */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800">
                    <h3 className="text-base font-semibold text-white">Announcement History</h3>
                </div>
                <div className="divide-y divide-zinc-800/50">
                    {pastAnnouncements.map((ann) => (
                        <div key={ann.id} className="px-6 py-4 hover:bg-zinc-800/20 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeColors[ann.type]}`}>{ann.type}</span>
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                            {ann.audience === 'ALL' ? <Globe className="h-3 w-3" /> : ann.audience === 'OWNERS' ? <Building2 className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                                            {ann.audience}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-white">{ann.title}</p>
                                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{ann.message}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-zinc-500">{ann.sentAt}</p>
                                    <p className="text-xs text-zinc-600 mt-0.5">{ann.reach.toLocaleString()} reached</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

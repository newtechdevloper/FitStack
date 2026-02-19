"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Building2, Users, CreditCard, Shield,
    Megaphone, BarChart3, Settings, AlertTriangle, FileText,
    Zap, Globe, Lock
} from "lucide-react";

const navSections = [
    {
        title: "Overview",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { name: "Analytics", href: "/admin/financials", icon: BarChart3 },
        ]
    },
    {
        title: "Management",
        items: [
            { name: "Tenants", href: "/admin/tenants", icon: Building2 },
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Financials", href: "/admin/financials", icon: CreditCard },
        ]
    },
    {
        title: "Security",
        items: [
            { name: "Risk & Fraud", href: "/admin/risk", icon: AlertTriangle },
            { name: "Audit Logs", href: "/admin/audit", icon: FileText },
            { name: "Access Control", href: "/admin/settings", icon: Lock },
        ]
    },
    {
        title: "Platform",
        items: [
            { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
            { name: "Feature Flags", href: "/admin/features", icon: Zap },
            { name: "Domains", href: "/admin/domains", icon: Globe },
        ]
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col glass-morphism border-r border-white/5 relative overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            {/* Logo Section */}
            <div className="flex h-20 items-center gap-3 px-6 border-b border-white/5 relative bg-white/2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse-slow">
                    <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-black text-white tracking-widest uppercase italic">FitStack</p>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">Super Console</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar relative z-10">
                {navSections.map((section) => (
                    <div key={section.title} className="space-y-3">
                        <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] opacity-80">
                            {section.title}
                        </p>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 border ${isActive
                                            ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                            : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/5"
                                            }`}
                                    >
                                        <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" : "text-zinc-500"}`}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className="tracking-tight">{item.name}</span>
                                        {isActive && (
                                            <>
                                                <div className="absolute left-0 w-1 h-1/2 bg-indigo-400 rounded-full blur-[2px]" />
                                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Footer - Glassy profile card */}
            <div className="p-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-3 rounded-2xl bg-white/3 p-3 border border-white/5 backdrop-blur-md hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="relative">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-[2px]">
                            <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden uppercase">
                                AD
                            </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate leading-none">Super Admin</p>
                        <p className="text-[10px] text-zinc-500 truncate mt-1">Status: Operational</p>
                    </div>
                    <Settings className="h-3.5 w-3.5 text-zinc-600 group-hover:rotate-90 group-hover:text-indigo-400 transition-all" />
                </div>
            </div>
        </div>
    );
}

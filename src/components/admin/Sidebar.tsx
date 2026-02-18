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
            { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
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
        <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800/50">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-6 border-b border-zinc-800/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                    <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">GymNexus</p>
                    <p className="text-xs text-violet-400 font-medium">Super Admin</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {navSections.map((section) => (
                    <div key={section.title}>
                        <p className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            {section.title}
                        </p>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${isActive
                                                ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                                                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                                            }`}
                                    >
                                        <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                        {item.name}
                                        {isActive && (
                                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800/50">
                <div className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-2.5 border border-zinc-800">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                        SA
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">Super Admin</p>
                        <p className="text-xs text-zinc-500 truncate">admin@gymnexus.com</p>
                    </div>
                    <Settings className="h-3.5 w-3.5 text-zinc-600 hover:text-zinc-400 cursor-pointer" />
                </div>
            </div>
        </div>
    );
}

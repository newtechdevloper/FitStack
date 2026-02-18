
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart,
    Users,
    Building2,
    ShieldAlert,
    LogOut,
    Settings
} from "lucide-react";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

const navigation = [
    { name: "Admin Overview", href: "/admin", icon: BarChart },
    { name: "Tenants (Gyms)", href: "/admin/tenants", icon: Building2 },
    { name: "Platform Users", href: "/admin/users", icon: Users },
    { name: "Audit Logs", href: "/admin/audit", icon: ShieldAlert },
    { name: "Platform Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full min-h-screen w-64 flex-col bg-zinc-900 text-white border-r border-zinc-800">
            <div className="flex h-16 items-center px-6 border-b border-zinc-800 bg-zinc-950">
                <Link href="/top" className="flex items-center gap-2">
                    <ShieldAlert className="h-6 w-6 text-red-500" />
                    <span className="text-lg font-bold tracking-tight">Nexus Admin</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 bg-zinc-950">
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-red-900/20 text-red-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-zinc-800 p-4 bg-zinc-950">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

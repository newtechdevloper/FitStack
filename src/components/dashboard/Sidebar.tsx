
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    Settings,
    LogOut,
    Building2,
    BarChart3
} from "lucide-react";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full min-h-screen w-64 flex-col bg-gray-900 text-white">
            <div className="flex h-16 items-center px-6 border-b border-gray-800">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-indigo-500" />
                    <span className="text-lg font-bold tracking-tight">GymNexus</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3">
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
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-800 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

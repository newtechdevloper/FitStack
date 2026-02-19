
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Calendar,
    Settings,
    LogOut,
    Building2,
    Ticket,
    Home
} from "lucide-react";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

const navigation = [
    { name: "Home", href: "/portal", icon: Home },
    { name: "My Bookings", href: "/portal/bookings", icon: Ticket },
    { name: "Profile", href: "/portal/profile", icon: Settings },
];

export function MemberSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col glass-morphism border-r border-white/5 relative overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            {/* Logo Section */}
            <div className="flex h-20 items-center gap-3 px-6 border-b border-white/5 relative bg-white/2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse-slow">
                    <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-black text-white tracking-widest uppercase italic leading-none">FitStack</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-1">Member Portal</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar relative z-10">
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 border",
                                    isActive
                                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                        : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/5"
                                )}
                            >
                                <div className={clsx(
                                    "transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" : "text-zinc-500"
                                )}>
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
                </nav>
            </div>

            <div className="p-4 border-t border-white/5 mt-auto">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-400 border border-transparent hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10 transition-all group"
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="tracking-tight uppercase text-[10px] font-black italic">Terminate Session</span>
                </button>
            </div>
        </div>
    );
}

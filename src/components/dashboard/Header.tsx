
"use client";

import { Bell, User } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between border-b border-white/5 glass-morphism px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] font-mono">
                    Node Connected: Primary
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">PRO ACCOUNT</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

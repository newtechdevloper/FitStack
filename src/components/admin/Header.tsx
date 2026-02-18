
"use client";

import { Bell, Shield } from "lucide-react";

export function AdminHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 shadow-sm">
            <div className="text-xl font-semibold text-zinc-100">
                Platform Administration
            </div>

            <div className="flex items-center gap-4">
                <button className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-red-900/40 flex items-center justify-center text-red-500 border border-red-900/50">
                    <Shield className="h-5 w-5" />
                </div>
            </div>
        </header>
    );
}

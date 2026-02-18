
"use client";

import { Bell, User } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
            <div className="text-xl font-semibold text-gray-800">
                Dashboard
            </div>

            <div className="flex items-center gap-4">
                <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                    <User className="h-5 w-5" />
                </div>
            </div>
        </header>
    );
}

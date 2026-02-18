"use client";

import { useActionState, useState } from "react";
import { addMember } from "@/app/dashboard/members/actions";
import { UserPlus, Loader2, X, Send } from "lucide-react";

export function InviteMemberForm() {
    const [isOpen, setIsOpen] = useState(false);

    // We need to wrap the server action to handle errors/state if not already compatible
    // But for now, let's just assume standard form action or use a transition.
    // using simplistic approach for "design" focus.

    return (
        <div className="relative">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                >
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                </button>
            )}

            {isOpen && (
                <div className="absolute right-0 top-0 z-10 w-full min-w-[300px] sm:w-[400px] origin-top-right rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Invite New Member</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <form action={addMember} className="flex gap-2">
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Enter email address"
                            className="flex-1 rounded-xl border-gray-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="flex items-center justify-center rounded-xl bg-indigo-600 p-2.5 text-white hover:bg-indigo-500 shadow-sm"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                    <p className="mt-2 text-xs text-gray-500">
                        They will receive an email with a magic link to join your gym.
                    </p>
                </div>
            )}
        </div>
    );
}

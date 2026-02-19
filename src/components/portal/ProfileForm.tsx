"use client";

import { useState } from "react";
import { updateProfile } from "@/app/portal/profile/actions";
import { User, Mail, ShieldCheck, Save, X } from "lucide-react";
import { toast } from "sonner";

export function ProfileForm({ user }: { user: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await updateProfile(formData);
            toast.success("Identity parameters updated.");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="holographic-card glass-morphism rounded-[3rem] border border-white/5 overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
                <h2 className="text-[10px] font-black text-white flex items-center gap-3 uppercase tracking-[0.3em]">
                    <User className="h-4 w-4 text-indigo-400 animate-pulse" />
                    Core Bio-Matrix
                </h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[10px] font-black text-cyan-400 hover:text-white uppercase tracking-widest transition-colors"
                >
                    {isEditing ? "Cancel Modification" : "Modify Parameters"}
                </button>
            </div>
            <div className="p-10 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                    <div className="h-32 w-32 rounded-3xl glass-morphism border-2 border-white/10 p-1 relative overflow-hidden group/avatar shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <div className="h-full w-full rounded-2xl overflow-hidden relative">
                            {user.image ? (
                                <img src={user.image} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-indigo-500 font-black text-4xl italic">
                                    {user.name?.[0] || "?"}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay group-hover/avatar:opacity-0 transition-opacity" />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        {isEditing ? (
                            <form action={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="sr-only">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={user.name}
                                        className="bg-transparent border-b border-white/20 text-3xl font-black text-white italic uppercase tracking-tighter focus:outline-none focus:border-cyan-400 transition-colors w-full md:w-auto"
                                        placeholder="ENTER IDENTITY"
                                    />
                                </div>
                                <div className="flex gap-2 justify-center md:justify-start">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
                                    >
                                        <Save className="h-3 w-3" />
                                        {isPending ? "Savng..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">{user.name}</h3>
                                <p className="text-zinc-500 font-mono text-[10px] mt-1 uppercase tracking-widest">{user.email}</p>
                            </>
                        )}
                        <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">Active Link</span>
                            <span className="px-3 py-1 rounded-lg bg-white/5 text-zinc-500 border border-white/5 text-[8px] font-black uppercase tracking-widest">Verified Human</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 pt-8 border-t border-white/5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Identity Handle</label>
                        <div className="flex items-center gap-4 p-5 rounded-2xl glass-morphism border border-white/5 text-white font-black uppercase italic tracking-tighter bg-white/2">
                            <ShieldCheck className="h-4 w-4 text-indigo-500" />
                            {user.name}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Communication Uplink</label>
                        <div className="flex items-center gap-4 p-5 rounded-2xl glass-morphism border border-white/5 text-white font-black uppercase italic tracking-tighter bg-white/2 overflow-hidden text-ellipsis">
                            <Mail className="h-4 w-4 text-indigo-500" />
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

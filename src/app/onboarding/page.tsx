"use client";

import { useActionState } from "react";
import { registerTenant, type TenantActionState } from "@/server/actions/tenant";
import { useFormStatus } from "react-dom";
import { Building2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="h-16 w-full flex items-center justify-center rounded-2xl bg-indigo-500 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all group overflow-hidden relative disabled:opacity-50"
        >
            <span className="relative z-10 italic">{pending ? "Initializing Node..." : "Establish Gym Link"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
    );
}

const initialState: TenantActionState = {
    error: null,
};

export default function OnboardingPage() {
    const [state, formAction] = useActionState(registerTenant, initialState);

    return (
        <div className="flex min-h-screen mesh-gradient-bg items-center justify-center px-6 py-12 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white opacity-10 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto h-20 w-20 glass-morphism rounded-3xl flex items-center justify-center border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-pulse-slow">
                        <Building2 className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h2 className="mt-8 text-4xl font-black text-white italic uppercase tracking-tighter">
                        Initialization Terminal
                    </h2>
                    <p className="mt-2 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em]">
                        {">>"} Establish high-fidelity gym node registry
                    </p>
                </div>

                <div className="holographic-card glass-morphism rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <form action={formAction} className="space-y-8 relative z-10">
                        <div className="space-y-4">
                            <label htmlFor="name" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1 italic">
                                Node Designation (Gym Name)
                            </label>
                            <div className="relative group/input">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full px-6 py-5 rounded-2xl glass-morphism border border-white/10 bg-white/2 text-white font-black uppercase tracking-tighter focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-800"
                                    placeholder="IRON ABS KINETICS"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label htmlFor="slug" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1 italic">
                                Temporal Subdomain (Slug)
                            </label>
                            <div className="relative group/input flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        name="slug"
                                        id="slug"
                                        className="block w-full px-6 py-5 rounded-2xl glass-morphism border border-white/10 bg-white/2 text-white font-black uppercase tracking-tighter focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-800"
                                        placeholder="iron-abs"
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-white/5 px-4 py-5 rounded-2xl border border-white/5 italic">.FitStack.com</span>
                            </div>
                            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest px-1 italic leading-relaxed">
                                This will be your encrypted core access vector.
                            </p>
                        </div>

                        {state?.error && (
                            <div className="glass-morphism rounded-xl p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                                [ Error ]: {typeof state.error === 'string' ? state.error : "Verification failed."}
                            </div>
                        )}

                        <div className="pt-4">
                            <SubmitButton />
                        </div>
                    </form>
                </div>

                <p className="mt-10 text-center text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] italic opacity-50">
                    System Uplink: v2.4.1 // SECURE SESSION
                </p>
            </div>
        </div>
    );
}


"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Use NextAuth signIn client-side
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials.");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center mesh-gradient-bg px-4 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white opacity-10 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block">
                        <div className="mx-auto h-16 w-16 glass-morphism rounded-2xl flex items-center justify-center border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-110 transition-transform">
                            <Zap className="h-8 w-8 text-indigo-400 fill-indigo-400/20" />
                        </div>
                    </Link>
                    <h1 className="mt-8 text-3xl font-black text-white italic uppercase tracking-tighter">
                        Nexus Authentication
                    </h1>
                    <p className="mt-2 text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                        {">>"} Synchronize identity with command center
                    </p>
                </div>

                <div className="holographic-card glass-morphism rounded-[2.5rem] border border-white/5 p-8 md:p-10 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <form action={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1 italic">
                                    Identity Vector (Email)
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-5 py-4 rounded-2xl glass-morphism border border-white/10 bg-white/2 text-white font-bold tracking-tight focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700 sm:text-sm"
                                    placeholder="agent@fitstack.com"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="password" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1 italic">
                                    Encrypted Key
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-5 py-4 rounded-2xl glass-morphism border border-white/10 bg-white/2 text-white font-bold tracking-tight focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="glass-morphism rounded-xl p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                                [ AUTH_ERROR ]: {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <SubmitButton />
                        </div>
                    </form>
                </div>

                <div className="mt-10 text-center space-y-4">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        New entity detected?{" "}
                        <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            Initiate Protocol
                        </Link>
                    </p>
                    <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em] italic opacity-50">
                        Secure Uplink Verified // RSA-4096 Active
                    </p>
                </div>
            </div>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary-glow)] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
            {pending ? (
                <span className="animate-pulse">Signing in...</span>
            ) : (
                <span className="flex items-center gap-2">Sign in <ArrowRight className="w-4 h-4" /></span>
            )}
        </button>
    )
}

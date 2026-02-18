
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
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-10"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)] rounded-full blur-[120px] opacity-10"></div>
            </div>

            <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-2xl border border-white/10 relative">
                <div className="flex flex-col items-center text-center">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
                            <Zap className="w-6 h-6 text-white fill-current" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm">Sign in to your FitStack command center.</p>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-lg border-0 bg-white/5 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--primary)] sm:text-sm sm:leading-6 transition-all"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-lg border-0 bg-white/5 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[var(--primary)] sm:text-sm sm:leading-6 transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-400">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <SubmitButton />
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-500">Don't have an account? </span>
                    <Link href="/pricing" className="font-medium text-[var(--primary)] hover:text-white transition-colors">
                        Start existing trial
                    </Link>
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

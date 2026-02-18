
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
            {/* Reusing the background effect */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-10"></div>
            </div>

            <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-2xl border border-white/10 text-center">
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
                            <Zap className="w-6 h-6 text-white fill-current" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Start Your Journey</h2>
                </div>

                <p className="text-gray-400 text-lg leading-relaxed">
                    To create a new gym account, please choose a plan from our pricing page.
                </p>

                <div className="pt-4">
                    <Link
                        className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary-glow)] hover:scale-[1.02] transition-all"
                        href="/pricing"
                    >
                        View Pricing Plans <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                <div className="text-center text-sm mt-6">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link href="/login" className="font-medium text-[var(--primary)] hover:text-white transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

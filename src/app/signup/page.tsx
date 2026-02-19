
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function SignupPage() {
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
                        Platform Onboarding
                    </h1>
                    <p className="mt-2 text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                        {">>"} Requesting access to core gym services
                    </p>
                </div>

                <div className="holographic-card glass-morphism rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative text-center group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed mb-10 relative z-10">
                        To initialize a new gym node, please select a configuration plan from our registry.
                    </p>

                    <div className="relative z-10 space-y-6">
                        <Link
                            className="flex w-full items-center justify-center rounded-2xl bg-indigo-500 px-6 py-5 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all active:scale-95 group/btn"
                            href="/pricing"
                        >
                            Access Plan Registry <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>

                        <div className="text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest pt-4 italic">
                            Already authenticated?{" "}
                            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                Access Command Center
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-10 text-center text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em] italic opacity-50 relative z-10">
                    Neural Uplink v.2.0 // HANDSHAKE PENDING
                </p>
            </div>
        </div>
    );
}

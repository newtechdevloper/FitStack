
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ConnectRazorpayButton } from "@/components/dashboard/ConnectRazorpayButton";
import { CheckCircle2, CreditCard, Wallet, AlertCircle, Building2, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import RazorpayCheckoutButton from "@/components/dashboard/RazorpayCheckoutButton";

export default async function BillingPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        include: {
            tenant: {
                include: {
                    plan: true,
                    tenantSubscription: true
                }
            }
        }
    });

    if (!tenantUser) return <div>Gym not found.</div>;

    const tenant = tenantUser.tenant as any;
    const isConnected = !!tenant.razorpayAccountId;
    const resolvedSearchParams = await searchParams;
    const isSuccess = resolvedSearchParams['connect'] === 'success';
    const status = tenant.tenantSubscription?.status || 'trialing';

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Fiscal Engine
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Modulating subscription streams & payout gateways
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl glass-morphism border border-white/5 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Node Link: Active</span>
                    </div>
                </div>
            </div>

            {isSuccess && (
                <div className="glass-morphism rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/5 flex items-start gap-4 animate-float">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight italic">Protocol Synchronized</h3>
                        <p className="mt-1 text-[10px] text-emerald-400/70 font-bold uppercase tracking-widest">Payout gateway successfully linked via Razorpay.</p>
                    </div>
                </div>
            )}

            <div className="grid gap-10 lg:grid-cols-2">
                {/* Platform Subscription Card */}
                <div className="holographic-card glass-morphism rounded-[3rem] border border-white/5 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                            <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-indigo-500/30">
                                <CreditCard className="h-5 w-5 text-indigo-400" />
                            </div>
                            Core Model
                        </h2>
                        <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[8px] font-black uppercase tracking-widest border italic ${status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            {status} Protocol
                        </span>
                    </div>

                    <div className="p-10 relative z-10">
                        <div className="flex items-baseline gap-3 mb-10">
                            <span className="text-6xl font-black text-white italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                {tenant.plan?.key === 'STARTER' ? '₹2,499' :
                                    tenant.plan?.key === 'GROWTH' ? '₹6,499' :
                                        tenant.plan?.key === 'PRO' ? 'Custom' :
                                            '₹0'}
                            </span>
                            <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">/ Cycle</span>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center p-5 rounded-2xl glass-morphism border border-white/5 bg-white/2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Template Ident</span>
                                <span className="text-sm font-black text-white uppercase tracking-tighter italic">{tenant.plan?.name || "Trial Protocol"}</span>
                            </div>
                            <div className="flex justify-between items-center p-5 rounded-2xl glass-morphism border border-white/5 bg-white/2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Next Sync Gate</span>
                                <span className="text-sm font-black text-cyan-400 uppercase tracking-tighter italic font-mono">24 OCT 2026 // 00:00 UTC</span>
                            </div>
                        </div>

                        {!tenant.tenantSubscription ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Initialize Upgrade Flow</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <RazorpayCheckoutButton plan="starter" label="Starter Node (₹2,499)" />
                                    <RazorpayCheckoutButton plan="growth" label="Growth Node (₹6,499)" />
                                </div>
                            </div>
                        ) : (
                            <button className="w-full h-16 flex items-center justify-center rounded-2xl bg-indigo-500 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all group overflow-hidden relative">
                                <span className="relative z-10 italic">Modify Subscription Matrix</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Payout Settings Card */}
                <div className="holographic-card glass-morphism rounded-[3rem] border border-white/5 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                            <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-emerald-500/30">
                                <Wallet className="h-5 w-5 text-emerald-400" />
                            </div>
                            Yield Gateway
                        </h2>
                    </div>

                    <div className="p-10 space-y-8 relative z-10">
                        <div className="flex items-start gap-6 p-6 rounded-3xl glass-morphism border border-white/5 bg-white/2">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Razorpay Connect</h3>
                                <p className="mt-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                                    Synchronize your commercial nexus to automate member yield transfers.
                                </p>
                            </div>
                        </div>

                        {isConnected ? (
                            <div className="rounded-[2rem] glass-morphism border border-white/10 p-8 space-y-6 relative overflow-hidden">
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl italic shadow-2xl">R</div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Link Established</p>
                                        <p className="text-sm font-black text-white uppercase tracking-tighter font-mono mt-1">{tenant.razorpayAccountId}</p>
                                    </div>
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    </div>
                                </div>
                                <div className="pt-2 relative z-10">
                                    <ConnectRazorpayButton isConnected={true} accountRef={tenant.razorpayAccountId ?? undefined} />
                                </div>

                                {/* Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                            </div>
                        ) : (
                            <div className="rounded-[2rem] glass-morphism border border-amber-500/20 p-8 space-y-6 relative overflow-hidden">
                                <div className="flex gap-5 relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                                        <AlertCircle className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tighter italic">Yield Interrupted</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Connect commercial terminal to initiate payouts.</p>
                                    </div>
                                </div>
                                <div className="mt-4 relative z-10">
                                    <ConnectRazorpayButton isConnected={false} />
                                </div>

                                {/* Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

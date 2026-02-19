import Link from 'next/link';
import { Metadata } from 'next';
import { DollarSign, Users, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

export const metadata: Metadata = {
    title: 'Dashboard | FitStack',
};

export default function DashboardPage() {
    return (
        <div className="space-y-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase group relative inline-block">
                        <span className="relative z-10 text-glow">Operation Center</span>
                        <div className="absolute -inset-x-2 -inset-y-1 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Strategic Overview · Pulse Rate: Optimal
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/analytics">
                        <button className="glass-morphism border-white/5 px-6 py-3 rounded-2xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-400" />
                            Log Analysis
                        </button>
                    </Link>
                    <Link href="/dashboard/billing">
                        <button className="neon-border-cyan glass-morphism text-cyan-400 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-500/10 transition-all flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Inject Revenue
                        </button>
                    </Link>
                </div>
            </div>

            {/* Metric Cards - Holographic */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Revenue Stream", value: "$12,450", change: "+12.5%", icon: DollarSign, color: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
                    { label: "Active Units", value: "340", change: "+5.2%", icon: Users, color: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
                    { label: "Mission Volume", value: "1,204", change: "+18.3%", icon: Calendar, color: "text-violet-400", border: "border-violet-500/20", glow: "shadow-violet-500/10" },
                    { label: "Growth Vector", value: "45", change: "-2.1%", icon: TrendingUp, color: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
                ].map((stat, i) => (
                    <div key={i} className={`holographic-card glass-morphism p-6 rounded-3xl border ${stat.border} shadow-2xl relative group overflow-hidden`}>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className="mt-2 text-3xl font-black text-white tracking-tighter italic">{stat.value}</p>
                            </div>
                            <div className={`rounded-2xl p-3 glass-morphism border ${stat.border}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color} drop-shadow-[0_0_8px_rgba(var(--primary-glow))]`} />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 relative z-10">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.change.startsWith('+') ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                {stat.change.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none">
                                Variance Logic
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Revenue Chart - Cyber Style */}
                <div className="lg:col-span-2 glass-morphism rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Financial Pulse</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Revenue projection sync</p>
                        </div>
                        <div className="flex gap-2">
                            {['1M', '3M', '6M', '1Y'].map((period) => (
                                <button key={period} className="px-3 py-1 text-[10px] font-black rounded-lg glass-morphism border-white/5 text-zinc-500 hover:text-white transition-all">
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 relative z-10">
                        {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 65, 85].map((height, i) => (
                            <div key={i} className="group relative w-full bg-white/5 rounded-t-lg hover:bg-indigo-500/10 transition-colors cursor-pointer">
                                <div
                                    className="absolute bottom-0 w-full bg-indigo-500/40 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-400/60 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                    style={{ height: `${height}%` }}
                                />
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 glass-morphism text-white text-[10px] font-black py-1 px-3 rounded-lg border-indigo-500/20 shadow-xl transition-opacity z-20">
                                    ${height * 100}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] font-black text-zinc-600 px-4 uppercase tracking-widest italic">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Schedule Sidebar - Cyber Style */}
                <div className="space-y-8">
                    <div className="glass-morphism rounded-3xl p-8 border-white/5 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Field Ops</h3>
                            <Link href="/dashboard/schedule">
                                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Expand {">>"}</button>
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {/* Session mapping with Links */}
                            {[
                                { name: "Morning Flow", time: "09:00", instructor: "Sarah J.", color: "text-cyan-400 shadow-cyan-500/20 border-cyan-500/20" },
                                { name: "HIIT Intensity", time: "10:30", instructor: "Mike T.", color: "text-fuchsia-400 shadow-fuchsia-500/20 border-fuchsia-500/20" },
                                { name: "Power Lifting", time: "14:00", instructor: "Alex R.", color: "text-indigo-400 shadow-indigo-500/20 border-indigo-500/20" },
                                { name: "Eve Pilates", time: "18:00", instructor: "Jenna W.", color: "text-emerald-400 shadow-emerald-500/20 border-emerald-500/20" },
                            ].map((session, i) => (
                                <Link key={i} href="/dashboard/schedule" className="flex items-center gap-4 p-4 glass-morphism border-white/5 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                                    <div className={`h-12 w-12 rounded-xl glass-morphism border flex items-center justify-center font-black text-xs italic ${session.color}`}>
                                        {session.time}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-white text-xs uppercase tracking-tighter truncate">{session.name}</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">Agent: {session.instructor}</p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/10 text-zinc-600 group-hover:text-indigo-400 transition-all">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Subscription Widget - Cyber Style */}
                    <div className="glass-morphism rounded-3xl p-8 border border-indigo-500/20 bg-indigo-500/5 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/10 blur-[50px] rounded-full group-hover:bg-indigo-500/20 transition-all" />

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-3 rounded-2xl glass-morphism border border-indigo-500/30">
                                <CreditCard className="h-5 w-5 text-indigo-400" />
                            </div>
                            <h3 className="font-black text-white italic uppercase tracking-tighter">System Tier</h3>
                        </div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6 relative z-10">
                            Professional Protocol · Revalidation in 12 cycles
                        </p>
                        <div className="flex items-baseline gap-2 mb-8 relative z-10">
                            <span className="text-4xl font-black text-white italic tracking-tighter">$79</span>
                            <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">/cycle</span>
                        </div>
                        <Link href="/dashboard/billing">
                            <button className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all active:scale-95 relative z-10">
                                Manage Protocol
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

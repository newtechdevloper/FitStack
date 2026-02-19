import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Building2, LogOut, Settings, Zap, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { ProfileForm } from "@/components/portal/ProfileForm";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const memberships = await prisma.tenantUser.findMany({
        where: { userId: session.user.id },
        include: { tenant: true }
    });

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                    Neural Identity
                </h1>
                <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    {">>"} Synchronizing personal bio-matrix and access nodes
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 italic">
                {/* Main Profile Card */}
                <div className="lg:col-span-8 space-y-8">
                    <ProfileForm user={session.user} />

                    {/* Memberships */}
                    <div className="glass-morphism rounded-[3rem] border border-white/5 overflow-hidden">
                        <div className="p-8 border-b border-white/5 bg-white/5 font-black flex items-center gap-4">
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-indigo-400" />
                                Registered Nodes
                            </h2>
                        </div>
                        <div className="divide-y divide-white/5 bg-white/2">
                            {memberships.length === 0 && (
                                <div className="p-16 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                                    No active node associations found.
                                </div>
                            )}
                            {memberships.map((m: any) => (
                                <div key={m.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all group/node relative">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="h-14 w-14 rounded-2xl glass-morphism border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors italic">{m.tenant.name}</h3>
                                            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1 group-hover:text-zinc-400 transition-colors">
                                                ID: {m.tenant.id.slice(0, 8)}... // ACTIVE SESSION
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border shadow-2xl ${m.role === 'OWNER' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/5' :
                                            m.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5' :
                                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5'
                                            }`}>
                                            {m.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Actions Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="holographic-card glass-morphism rounded-[3rem] border border-white/5 overflow-hidden">
                        <div className="p-8 border-b border-white/5 bg-white/5">
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <Settings className="h-4 w-4 text-zinc-500" />
                                System Controls
                            </h2>
                        </div>
                        <div className="p-10 space-y-6">
                            <form action={async () => {
                                "use server"
                                await signOut({ redirectTo: "/" })
                            }}>
                                <button type="submit" className="w-full h-16 flex items-center justify-center gap-3 rounded-2xl bg-zinc-950/50 border border-white/5 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all group/signout">
                                    <LogOut className="h-4 w-4 transition-transform group-hover/signout:-translate-x-1" />
                                    Terminate Session
                                </button>
                            </form>
                            <button className="w-full pt-4 text-[8px] font-black text-zinc-700 uppercase tracking-widest hover:text-red-600 transition-colors">
                                [ Danger Zone: Purge Identity ]
                            </button>
                        </div>
                    </div>

                    {/* Stats/Quick View */}
                    <div className="glass-morphism rounded-[3rem] border border-white/5 p-10 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Operational Pulse</span>
                                <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                            </div>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-2 italic text-right">67% Optimization</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-white/2 border border-white/5 text-center">
                                <p className="text-xl font-black text-white italic tracking-tighter leading-none">08</p>
                                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Months Active</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/2 border border-white/5 text-center">
                                <p className="text-xl font-black text-white italic tracking-tighter leading-none">V2.4</p>
                                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Engine Vers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

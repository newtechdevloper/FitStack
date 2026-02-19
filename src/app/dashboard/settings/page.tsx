
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateSettings } from "./actions";
import { DeleteTenantButton } from "@/components/dashboard/DeleteTenantButton";
import { Building2, Globe, AlertTriangle, Save, Shield, Terminal, Zap } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        include: { tenant: true }
    });

    if (!tenantUser?.tenantId) redirect("/onboarding");
    if (tenantUser.role !== 'OWNER' && tenantUser.role !== 'ADMIN') {
        return (
            <div className="glass-morphism rounded-3xl p-12 border border-red-500/30 bg-red-500/5 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="h-20 w-20 rounded-full glass-morphism border border-red-500/30 flex items-center justify-center animate-pulse">
                        <AlertTriangle className="h-10 w-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Access Denied</h2>
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-relaxed">
                            Only OWNER nodes are authorized to modulate global parameters.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Core Parameters
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Modulating neural identity and access protocols
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl glass-morphism border border-white/5 flex items-center gap-3 bg-white/5">
                        <Shield className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Security: High</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-12 italic">
                {/* Main Settings Column */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="holographic-card glass-morphism rounded-[3rem] border border-white/5 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
                            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <div className="h-10 w-10 glass-morphism rounded-xl flex items-center justify-center border-indigo-500/30">
                                    <Building2 className="h-5 w-5 text-indigo-400" />
                                </div>
                                Identity Matrix
                            </h2>
                        </div>

                        <div className="p-10 relative z-10">
                            <form action={updateSettings} className="space-y-8">
                                <div className="space-y-4">
                                    <label htmlFor="name" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
                                        <Terminal className="h-3 w-3" /> Node Designation
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within/input:text-indigo-400 text-zinc-600">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            defaultValue={tenantUser.tenant.name}
                                            className="block w-full pl-14 pr-6 py-5 rounded-2xl glass-morphism border border-white/10 bg-white/2 text-white font-black uppercase tracking-tighter focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-800"
                                        />
                                    </div>
                                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest px-1 leading-relaxed italic">
                                        This designation is broadcast to all linked member nodes.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <label htmlFor="slug" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
                                        <Globe className="h-3 w-3" /> Temporal Subdomain
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-800">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="text"
                                            name="slug"
                                            id="slug"
                                            disabled
                                            defaultValue={tenantUser.tenant.slug}
                                            className="block w-full pl-14 pr-6 py-5 rounded-2xl glass-morphism border border-white/5 bg-black/20 text-zinc-700 font-black uppercase tracking-tighter cursor-not-allowed opacity-50"
                                        />
                                    </div>
                                    <p className="text-[8px] text-red-500/60 font-bold uppercase tracking-widest px-1 leading-relaxed italic">
                                        [ Immutable Identifier: System Lock Active ]
                                    </p>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="h-16 px-10 rounded-2xl bg-indigo-500 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center gap-3 group relative overflow-hidden"
                                    >
                                        <Save className="h-4 w-4 relative z-10" />
                                        <span className="relative z-10 italic">Apply Changes</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Danger Zone */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-morphism rounded-[3rem] border border-red-500/20 shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />

                        <div className="p-8 border-b border-red-500/20 bg-red-500/5 relative z-10 font-black italic flex items-center gap-3">
                            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                                Sever Connection
                            </h3>
                        </div>
                        <div className="p-8 space-y-8 relative z-10">
                            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-4">
                                <p className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest leading-relaxed">
                                    Initiating this protocol will permanently decommission this node and purge all its associated data streams.
                                </p>
                                <p className="text-[10px] text-white font-black uppercase tracking-widest italic p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
                                    [ Action Irreversible ]
                                </p>
                            </div>
                            <DeleteTenantButton />
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="glass-morphism rounded-[3rem] border border-white/5 p-8 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-2 shadow-2xl">
                            <Zap className="h-6 w-6 text-cyan-400" />
                        </div>
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] italic max-w-[150px]">
                            Last synchronized on neural uplink v2.4.1
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


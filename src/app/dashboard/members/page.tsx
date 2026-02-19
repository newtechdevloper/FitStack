import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Search, Filter, Mail, MoreHorizontal, Shield, User, Clock } from "lucide-react";
import { InviteMemberForm } from "@/components/dashboard/InviteMemberForm";
import { MemberSearch } from "@/components/dashboard/MemberSearch";
import { updateRole, removeMember } from "./actions";

export default async function MembersPage({
    searchParams,
}: {
    searchParams?: Promise<{ search?: string }>;
}) {
    const session = await auth();
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams?.search || "";

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session?.user?.id },
        select: { tenantId: true, role: true }
    });

    if (!tenantUser?.tenantId) return <div>No gym found.</div>;

    const members = await prisma.tenantUser.findMany({
        where: {
            tenantId: tenantUser.tenantId,
            user: {
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } }
                ]
            }
        },
        include: { user: true },
        orderBy: { joinedAt: 'desc' }
    });

    const isAdmin = tenantUser.role === 'OWNER' || tenantUser.role === 'ADMIN';

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Identity Registry
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Managing {members.length} active node participants
                    </p>
                </div>
                {isAdmin && <InviteMemberForm />}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 p-1">
                <div className="relative flex-1 max-w-lg">
                    <MemberSearch />
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass-morphism border border-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">
                    <Filter className="h-4 w-4" />
                    Protocol Filter
                </button>
            </div>

            {/* Members Registry - Futuristic Grid */}
            <div className="grid gap-4">
                {members.length === 0 && (
                    <div className="glass-morphism rounded-[2.5rem] py-24 text-center border-dashed border-white/5">
                        <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.2em]">No identities found matching search query.</p>
                    </div>
                )}
                {members.map((membership: any) => (
                    <div key={membership.id} className="holographic-card glass-morphism rounded-[2.5rem] p-6 border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                            <div className="flex-shrink-0 relative">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-white font-black text-2xl italic shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                    {membership.user.name?.[0]?.toUpperCase() || membership.user.email?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{membership.user.name || "Unnamed Entity"}</h4>
                                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border italic uppercase tracking-widest ${membership.role === 'OWNER' ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' :
                                        membership.role === 'ADMIN' ? 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' :
                                            'text-zinc-500 border-white/5 bg-white/5'
                                        }`}>
                                        {membership.role} NODE
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3 w-3 text-zinc-700" />
                                        <span className="font-mono text-zinc-400">{membership.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-zinc-700" />
                                        SYNCED {new Date(membership.joinedAt).toLocaleDateString('en-GB')}
                                    </div>
                                </div>
                            </div>

                            {/* Actions area with Futuristic buttons */}
                            {isAdmin && membership.role !== 'OWNER' && membership.userId !== session?.user?.id && (
                                <div className="flex items-center gap-3">
                                    <form action={updateRole}>
                                        <input type="hidden" name="userId" value={membership.userId} />
                                        <input type="hidden" name="role" value={membership.role === 'ADMIN' ? 'MEMBER' : 'ADMIN'} />
                                        <button
                                            type="submit"
                                            className="h-11 w-11 flex items-center justify-center rounded-2xl glass-morphism border border-white/5 text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
                                            title={membership.role === 'ADMIN' ? "Configure as Member" : "Configure as Admin"}
                                        >
                                            <Shield className={`h-4 w-4 ${membership.role === 'ADMIN' ? 'fill-indigo-400/20 text-indigo-400' : ''}`} />
                                        </button>
                                    </form>

                                    <form action={removeMember}>
                                        <input type="hidden" name="userId" value={membership.userId} />
                                        <button
                                            type="submit"
                                            className="h-11 w-11 flex items-center justify-center rounded-2xl glass-morphism border border-white/5 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                                            title="Decommission Membership"
                                        >
                                            <User className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Search, Filter, Mail, MoreHorizontal, Shield, User } from "lucide-react";
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
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            }
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    const isAdmin = tenantUser.role === 'OWNER' || tenantUser.role === 'ADMIN';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Members</h1>
                    <p className="mt-2 text-gray-500">Manage your gym members, staff, and invitations.</p>
                </div>
                {/* Only allow admins to invite */}
                {isAdmin && <InviteMemberForm />}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 p-1">
                <div className="relative flex-1 max-w-lg">
                    <MemberSearch />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            {/* Members List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <ul role="list" className="divide-y divide-gray-100">
                    {members.length === 0 && (
                        <li className="px-6 py-12 text-center text-gray-500">
                            No members found matching "{query}".
                        </li>
                    )}
                    {members.map((membership) => (
                        <li key={membership.id} className="hover:bg-gray-50 transition-colors">
                            <div className="flex items-center px-6 py-4">
                                <div className="min-w-0 flex-1 flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                            {membership.user.name?.[0]?.toUpperCase() || membership.user.email?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                {membership.user.name || "Unnamed User"}
                                            </p>
                                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${membership.role === 'OWNER' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                                                    membership.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                        'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                }`}>
                                                {membership.role}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {membership.user.email}
                                            </div>
                                            <span>Joined {new Date(membership.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {isAdmin && membership.role !== 'OWNER' && membership.userId !== session?.user?.id && (
                                    <div className="flex items-center gap-2">
                                        {/* Role Toggle (Simple approach for MVP design) */}
                                        <form action={updateRole}>
                                            <input type="hidden" name="userId" value={membership.userId} />
                                            <input type="hidden" name="role" value={membership.role === 'ADMIN' ? 'MEMBER' : 'ADMIN'} />
                                            <button
                                                type="submit"
                                                className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                title={membership.role === 'ADMIN' ? "Demote to Member" : "Promote to Admin"}
                                            >
                                                <Shield className={`h-4 w-4 ${membership.role === 'ADMIN' ? 'fill-current' : ''}`} />
                                            </button>
                                        </form>

                                        <form action={removeMember}>
                                            <input type="hidden" name="userId" value={membership.userId} />
                                            <button
                                                type="submit"
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Remove Member"
                                            >
                                                <User className="h-4 w-4" /> {/* Should be Trash or UserMinus */}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

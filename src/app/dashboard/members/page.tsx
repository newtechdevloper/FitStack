
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { addMember, removeMember, updateRole } from "./actions";
import { UserPlus, Trash2, Shield, User } from "lucide-react";
import { MemberSearch } from "@/components/dashboard/MemberSearch";

export default async function MembersPage({
    searchParams,
}: {
    searchParams?: { search?: string };
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const query = searchParams?.search || "";

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        select: { tenantId: true, role: true }
    });

    if (!tenantUser?.tenantId) redirect("/onboarding");

    const members = await prisma.tenantUser.findMany({
        where: {
            tenantId: tenantUser.tenantId,
            OR: query ? [
                { user: { name: { contains: query } } }, // SQLite contains is case-insensitive usually? Or check provider.
                { user: { email: { contains: query } } }
            ] : undefined
        },
        include: { user: true },
        orderBy: { joinedAt: 'desc' }
    });

    const isAdmin = tenantUser.role === 'OWNER' || tenantUser.role === 'ADMIN';

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Members</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your gym members and staff.
                    </p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    {isAdmin && (
                        <form action={addMember} className="flex gap-2">
                            <input
                                name="email"
                                type="email"
                                placeholder="member@example.com"
                                required
                                className="hidden md:block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                            <button
                                type="submit"
                                className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <UserPlus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                Invite Member
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <MemberSearch />
                <span className="text-sm text-gray-500 hidden sm:block">
                    {members.length} {members.length === 1 ? 'member' : 'members'} found
                </span>
            </div>

            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {members.length === 0 && (
                        <li className="px-4 py-8 text-center text-gray-500 text-sm">
                            No members found matching "{query}".
                        </li>
                    )}
                    {members.map((membership) => (
                        <li key={membership.id}>
                            <div className="flex items-center px-4 py-4 sm:px-6">
                                <div className="min-w-0 flex-1 flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
                                            <span className="text-lg font-medium leading-none text-white">
                                                {membership.user.name?.[0] || membership.user.email?.[0] || "?"}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                        <div>
                                            <p className="truncate text-sm font-medium text-indigo-600">
                                                {membership.user.name || "Unnamed User"}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500">
                                                <span className="truncate">{membership.user.email}</span>
                                            </p>
                                        </div>
                                        <div className="hidden md:block">
                                            <div>
                                                <p className="text-sm text-gray-900">
                                                    Joined on <time dateTime={membership.joinedAt.toISOString()}>{membership.joinedAt.toLocaleDateString()}</time>
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${membership.role === 'OWNER' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' :
                                                            membership.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                                                'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                        }`}>
                                                        {membership.role}
                                                    </span>

                                                    {/* Role Management Actions */}
                                                    {isAdmin && membership.role !== 'OWNER' && membership.userId !== session.user.id && (
                                                        <div className="flex gap-1 ml-2">
                                                            {membership.role === 'MEMBER' && (
                                                                <form action={updateRole}>
                                                                    <input type="hidden" name="userId" value={membership.userId} />
                                                                    <input type="hidden" name="role" value="ADMIN" />
                                                                    <button type="submit" title="Promote to Admin" className="text-gray-400 hover:text-blue-600">
                                                                        <Shield className="h-4 w-4" />
                                                                    </button>
                                                                </form>
                                                            )}
                                                            {membership.role === 'ADMIN' && (
                                                                <form action={updateRole}>
                                                                    <input type="hidden" name="userId" value={membership.userId} />
                                                                    <input type="hidden" name="role" value="MEMBER" />
                                                                    <button type="submit" title="Demote to Member" className="text-gray-400 hover:text-gray-600">
                                                                        <User className="h-4 w-4" />
                                                                    </button>
                                                                </form>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isAdmin && membership.role !== 'OWNER' && (
                                        <form action={removeMember} onSubmit={(e) => !confirm('Are you sure?') && e.preventDefault()}>
                                            <input type="hidden" name="userId" value={membership.userId} />
                                            <button
                                                type="submit"
                                                className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Remove</span>
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

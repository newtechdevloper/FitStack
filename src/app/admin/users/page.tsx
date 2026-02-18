
import { prisma } from "@/lib/prisma";
import { Search, Mail, Calendar, Building2, Shield } from "lucide-react";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            memberships: {
                include: { tenant: true }
            }
        }
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Global User Matrix
                </h1>
                <p className="text-zinc-400 mt-2">
                    View and manage all users across the platform.
                </p>
            </div>

            {/* Controls */}
            <div className="flex gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-950/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">User Profile</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Memberships</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                                                {user.name ? user.name.substring(0, 1).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                                    {user.name || "N/A"}
                                                </div>
                                                <div className="text-xs text-zinc-500">
                                                    ID: {user.id.substring(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                            <Mail className="h-4 w-4 text-zinc-600" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.memberships.map((m) => (
                                                <span key={m.id} className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-300">
                                                    <Building2 className="h-3 w-3 text-zinc-500" />
                                                    {m.tenant.name}
                                                    <span className={`px-1 rounded text-[10px] ${m.role === 'OWNER' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-700 text-zinc-400'}`}>
                                                        {m.role}
                                                    </span>
                                                </span>
                                            ))}
                                            {user.memberships.length === 0 && <span className="text-zinc-600 text-xs italic">No memberships</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-zinc-600" />
                                            {user.createdAt.toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

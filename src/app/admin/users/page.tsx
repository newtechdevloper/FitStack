
import { prisma } from "@/lib/prisma";

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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">Platform Users</h1>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">User</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Memberships</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {user.name || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-zinc-400">
                                    <div className="flex flex-wrap gap-1">
                                        {user.memberships.map((m) => (
                                            <span key={m.id} className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
                                                {m.tenant.name} ({m.role})
                                            </span>
                                        ))}
                                        {user.memberships.length === 0 && <span className="text-zinc-600">None</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {user.createdAt.toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

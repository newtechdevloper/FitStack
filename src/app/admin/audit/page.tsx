
import { prisma } from "@/lib/prisma";

export default async function AdminAuditPage() {
    const logs = await prisma.usageRecord.findMany({
        take: 50,
        orderBy: { timestamp: 'desc' },
        include: { tenant: true }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">System Audit & Usage Logs</h1>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Timestamp</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Tenant</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action / Metric</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Quantity</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {log.timestamp.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                    {log.tenant.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                                    {log.metric}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                    {log.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {log.stripeEventId ? (
                                        <span className="text-green-500 text-xs">Synced</span>
                                    ) : (
                                        <span className="text-yellow-500 text-xs">Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                    No activity logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


import { prisma } from "@/lib/prisma";
import { Shield, Clock, Database, Activity } from "lucide-react";

export default async function AdminAuditPage() {
    const logs = await prisma.usageRecord.findMany({
        take: 50,
        orderBy: { timestamp: 'desc' },
        include: { tenant: true }
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    System Activity Logs
                </h1>
                <p className="text-zinc-400 mt-2">
                    Real-time monitoring of system usage and critical events.
                </p>
            </div>

            {/* Logs Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-950/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Source Tenant</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Metric / Action</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Delta</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sync Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                            <Clock className="h-4 w-4 text-zinc-600" />
                                            {log.timestamp.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-medium">
                                        {log.tenant.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-zinc-500" />
                                            <span className="font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded text-xs select-all">
                                                {log.metric}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
                                        {log.quantity > 0 ? '+' : ''}{log.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {log.stripeEventId ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                Synced
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Shield className="h-12 w-12 text-zinc-800 mb-4" />
                                            <p>No activity logs found.</p>
                                        </div>
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

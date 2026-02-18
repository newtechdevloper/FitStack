import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | GymNexus',
};

async function getAdminStats() {
    const [tenantCount, userCount, activeSubs, recentTenants] = await Promise.all([
        prisma.tenant.count(),
        prisma.user.count(),
        prisma.tenant.count({
            where: { tenantSubscription: { status: 'active' } }
        }),
        prisma.tenant.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                tenantSubscription: true,
                plan: true
            }
        })
    ]);

    // Simple revenue estimation: Active Tenants * $79 (Growth Plan)
    const estimatedRevenue = activeSubs * 79;

    return { tenantCount, userCount, activeSubs, estimatedRevenue, recentTenants };
}

export default async function AdminPage() {
    const { tenantCount, userCount, activeSubs, estimatedRevenue, recentTenants } = await getAdminStats();

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric Cards - Platform Wide */}
                {[
                    { label: "Total Tenants", value: tenantCount.toString(), change: "Gyms" },
                    { label: "Est. Monthly Revenue", value: `$${estimatedRevenue.toLocaleString()}`, change: "USD" },
                    { label: "Total Users", value: userCount.toString(), change: "Global" },
                    { label: "Active Subscriptions", value: activeSubs.toString(), change: "Paid" },
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
                        <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-semibold text-white">{stat.value}</span>
                            {/* Change indicators differ per metric, keep simple for now */}
                            <span className="text-sm font-medium text-gray-500">
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Admin Quick Actions or Recent Tenants */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Gym Registrations</h3>
                <div className="space-y-4">
                    {recentTenants.length === 0 ? (
                        <p className="text-zinc-500">No tenants registered yet.</p>
                    ) : (
                        <div className="flow-root">
                            <ul role="list" className="divide-y divide-gray-200">
                                {recentTenants.map((tenant) => {
                                    const status = tenant.tenantSubscription?.status || 'trialing';
                                    return (
                                        <li key={tenant.id} className="py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {tenant.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {tenant.slug}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${status === 'active'
                                                            ? 'bg-green-100 text-green-800 border-green-200'
                                                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}>
                                                        {status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TenantActions } from "./tenant-actions";

export default async function AdminTenantsPage() {
    const tenants = await prisma.tenant.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            tenantSubscription: true,
            plan: true,
            _count: {
                select: { users: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Users</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {tenants.map((tenant) => {
                            const status = tenant.tenantSubscription?.status || 'trialing';
                            return (
                                <tr key={tenant.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{tenant.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{tenant.slug}</td>
                                    <td className="px-6 py-4 capitalize">{tenant.plan?.key || 'None'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status === 'active'
                                            ? 'bg-green-100 text-green-800 border-green-200'
                                            : 'bg-red-100 text-red-800 border-red-200'
                                            }`}>
                                            {status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{tenant._count.users}</td>
                                    <td className="px-6 py-4 text-right">
                                        <TenantActions tenantId={tenant.id} isSuspended={status === 'canceled'} />
                                    </td>
                                </tr>
                            )
                        })}
                        {tenants.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No tenants found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

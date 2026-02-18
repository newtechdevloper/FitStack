
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateSnapshot } from "@/lib/analytics";

async function getAnalyticsData(tenantId: string) {
    // Ensure we have latest data for "today" by generating a snapshot now (for demo purposes)
    // In prod, this would be cached/nightly.
    await generateSnapshot(tenantId);

    // Fetch snapshots for the last 6 months
    const snapshots = await prisma.financialSnapshot.findMany({
        where: { tenantId },
        orderBy: { month: 'asc' },
        take: 6
    });

    return snapshots;
}

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        select: { tenantId: true }
    });

    if (!tenantUser?.tenantId) redirect("/onboarding");

    const snapshots = await getAnalyticsData(tenantUser.tenantId);
    const currentMonth = snapshots[snapshots.length - 1];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Financial Analytics</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Monthly Recurring Revenue</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        ${currentMonth?.mrr.toString() || "0"}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Usage Fees (Est.)</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        ${currentMonth?.usageFees.toString() || "0"}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Platform Fees</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        ${currentMonth?.platformFees.toString() || "0"}
                    </dd>
                </div>
            </div>

            {/* Simple Table for History */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Revenue History</h3>
                    <div className="mt-4 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Month</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">MRR</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Usage</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {snapshots.map((snap) => (
                                            <tr key={snap.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                                    {snap.month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${snap.mrr.toString()}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${snap.usageFees.toString()}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ${(Number(snap.mrr) + Number(snap.usageFees)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

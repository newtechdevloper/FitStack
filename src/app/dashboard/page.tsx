
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | GymNexus',
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric Cards */}
                {[
                    { label: "Total Revenue", value: "$12,450", change: "+12%" },
                    { label: "Active Members", value: "340", change: "+5%" },
                    { label: "Class Bookings", value: "1,204", change: "+18%" },
                    { label: "New Signups", value: "45", change: "-2%" },
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-semibold text-gray-900">{stat.value}</span>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[300px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                    <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        Chart Placeholder
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[300px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-gray-900">Yoga Flow</p>
                                    <p className="text-sm text-gray-500">Today, 5:00 PM</p>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Confirmed
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

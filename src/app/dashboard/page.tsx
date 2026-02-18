
import { Metadata } from 'next';
import { DollarSign, Users, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

export const metadata: Metadata = {
    title: 'Dashboard | FitStack',
};

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-500">Welcome back! Here's what's happening at your gym today.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        Last 7 Days
                    </button>
                    <button className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:scale-105">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Add Revenue
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Revenue", value: "$12,450", change: "+12.5%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Active Members", value: "340", change: "+5.2%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Class Bookings", value: "1,204", change: "+18.3%", icon: Calendar, color: "text-violet-600", bg: "bg-violet-50" },
                    { label: "New Signups", value: "45", change: "-2.1%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
                                </div>
                            </div>
                            <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            {stat.change.startsWith('+') ? (
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 text-rose-500" />
                            )}
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.change}
                            </span>
                            <span className="text-sm text-gray-400">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Chart Section (2/3 width) */}
                <div className="lg:col-span-2 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                            <p className="text-sm text-gray-500">Monthly revenue breakdown</p>
                        </div>
                        <div className="flex gap-2">
                            {['1M', '3M', '6M', '1Y'].map((period) => (
                                <button key={period} className="px-3 py-1 text-xs font-medium rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visual Chart Mockup */}
                    <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4">
                        {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 65, 85].map((height, i) => (
                            <div key={i} className="group relative w-full bg-indigo-50 rounded-t-lg hover:bg-indigo-100 transition-colors cursor-pointer">
                                <div
                                    className="absolute bottom-0 w-full bg-indigo-500/80 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"
                                    style={{ height: `${height}%` }}
                                />
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded shadow transition-opacity">
                                    ${height * 100}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 px-4">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="space-y-8">
                    {/* Recent Bookings */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Class Schedule</h3>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "Morning Yoga Flow", time: "09:00 AM", instructor: "Sarah J.", color: "bg-orange-100 text-orange-700" },
                                { name: "HIIT Intensity", time: "10:30 AM", instructor: "Mike T.", color: "bg-rose-100 text-rose-700" },
                                { name: "Power Lifting", time: "02:00 PM", instructor: "Alex R.", color: "bg-blue-100 text-blue-700" },
                                { name: "Evening Pilates", time: "06:00 PM", instructor: "Jenna W.", color: "bg-emerald-100 text-emerald-700" },
                            ].map((session, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xs ${session.color}`}>
                                        {session.time.split(' ')[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate">{session.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">with {session.instructor}</p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-400">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats Widget */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Subscription</h3>
                        </div>
                        <p className="text-indigo-100 text-sm mb-6">
                            Your "Professional Plan" renews in 12 days.
                        </p>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-3xl font-bold">$79</span>
                            <span className="text-sm text-indigo-200">/month</span>
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-white text-indigo-600 text-sm font-bold shadow hover:bg-indigo-50 transition-colors">
                            Manage Renewal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

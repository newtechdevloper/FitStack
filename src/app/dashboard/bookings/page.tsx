
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Clock, MapPin } from "lucide-react";

export default async function MyBookingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            session: {
                startTime: 'asc'
            }
        },
        include: {
            session: {
                include: {
                    class: true
                }
            },
            tenant: {
                select: {
                    name: true
                }
            }
        }
    });

    const upcomingBookings = bookings.filter(b => new Date(b.session.startTime) >= new Date());
    const pastBookings = bookings.filter(b => new Date(b.session.startTime) < new Date());

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Bookings</h1>
                <p className="mt-2 text-gray-600">Manage your upcoming class reservations.</p>
            </div>

            <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
                {upcomingBookings.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-semibold text-gray-900">No upcoming bookings</span>
                        <p className="mt-1 block text-sm text-gray-500">Check the schedule to book a class!</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {upcomingBookings.map((booking) => (
                            <div key={booking.id} className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <span className="text-xs text-gray-500">{booking.tenant.name}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{booking.session.class.name}</h3>

                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>{new Date(booking.session.startTime).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span>
                                                {new Date(booking.session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {' - '}
                                                {new Date(booking.session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                    <button className="text-sm font-medium text-red-600 hover:text-red-500">
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-8 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Classes</h2>
                {pastBookings.length === 0 ? (
                    <p className="text-sm text-gray-500">No past bookings found.</p>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {pastBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {booking.session.class.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(booking.session.startTime).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {booking.tenant.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {booking.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

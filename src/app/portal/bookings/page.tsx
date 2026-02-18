import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Clock, MapPin, X, ArrowRight, CheckCircle2, History } from "lucide-react";
import Link from "next/link";
import { cancelBooking } from "./actions";

export default async function BookingsPage({
    searchParams,
}: {
    searchParams?: Promise<{ tab?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const resolvedSearchParams = await searchParams;
    const tab = resolvedSearchParams?.tab || "upcoming"; // 'upcoming' or 'past'
    const isUpcoming = tab === "upcoming";

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id,
            session: {
                startTime: isUpcoming ? { gte: new Date() } : { lt: new Date() }
            }
        },
        include: {
            session: {
                include: {
                    class: {
                        include: {
                            instructor: { include: { user: true } }
                        }
                    }
                }
            }
        },
        orderBy: {
            session: { startTime: isUpcoming ? 'asc' : 'desc' }
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Bookings</h1>

                {/* Visual Tabs */}
                <div className="bg-gray-100 p-1 rounded-xl flex items-center">
                    <Link
                        href="/portal/bookings?tab=upcoming"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isUpcoming
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Upcoming
                    </Link>
                    <Link
                        href="/portal/bookings?tab=past"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isUpcoming
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Past History
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                        <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            {isUpcoming ? <Calendar className="h-10 w-10 text-gray-300" /> : <History className="h-10 w-10 text-gray-300" />}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {isUpcoming ? "No upcoming bookings" : "No past bookings"}
                        </h3>
                        {isUpcoming && (
                            <div className="mt-6">
                                <Link href="/portal" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all">
                                    Browse Classes <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {bookings.map((booking) => {
                    const sessionDate = new Date(booking.session.startTime);
                    const canCancel = isUpcoming && booking.status !== "CANCELLED"; // Added check just in case

                    return (
                        <div key={booking.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            {/* Date Block */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                                <span className="text-xs font-bold uppercase">{sessionDate.toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-xl font-bold">{sessionDate.getDate()}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{booking.session.class.name}</h3>
                                <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        {sessionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} • {booking.session.class.duration} min
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        Gym Floor {/* Placeholder location */}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-gray-700">Instructor:</span>
                                        {booking.session.class.instructor?.user.name || "Staff"}
                                    </div>
                                </div>
                            </div>

                            {/* Actions / Status */}
                            <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                                {isUpcoming ? (
                                    <form action={cancelBooking}>
                                        <input type="hidden" name="bookingId" value={booking.id} />
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 transition-colors"
                                            title="Cancel Booking"
                                        >
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-sm font-medium text-gray-500">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

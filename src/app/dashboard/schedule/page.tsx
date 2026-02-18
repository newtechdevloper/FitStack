
import { getClasses, getSessions } from "@/server/actions/class";
import { CreateClassForm } from "@/components/dashboard/ClassForm";
import { ScheduleSessionForm } from "@/components/dashboard/ScheduleSessionForm";
import { BookClassButton } from "@/components/dashboard/BookClassButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, Users, Plus, Layers } from "lucide-react";

export default async function SchedulePage() {
    const session = await auth();
    const classes = await getClasses();
    const sessions = await getSessions();

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session?.user?.id },
        select: { role: true }
    });

    const isMember = tenantUser?.role === 'MEMBER';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Class Schedule</h1>
                <p className="mt-2 text-gray-500">
                    {isMember ? "Browse and book upcoming classes." : "Manage your class types and schedule upcoming sessions."}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Management Tools (Hidden for Members) */}
                {!isMember && (
                    <div className="space-y-6 lg:col-span-1">
                        {/* Class Types Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-indigo-600" />
                                    Class Types
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <CreateClassForm />

                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Existing Classes</h3>
                                    <ul className="space-y-2">
                                        {classes.length === 0 && (
                                            <li className="text-sm text-gray-500 italic">No classes defined yet.</li>
                                        )}
                                        {classes.map((c) => (
                                            <li key={c.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                                                    <p className="text-xs text-gray-500">{c.duration} mins • {c.capacity} spots</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Session Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                    Schedule Session
                                </h2>
                            </div>
                            <div className="p-6">
                                {classes.length > 0 ? (
                                    <ScheduleSessionForm classes={classes} />
                                ) : (
                                    <p className="text-sm text-gray-500">Create a class type first to schedule sessions.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Column: Calendar / Upcoming Sessions */}
                <div className={`space-y-6 ${!isMember ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Upcoming Sessions</h3>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View Calendar</button>
                        </div>
                        <ul role="list" className="divide-y divide-gray-100">
                            {sessions.length === 0 && (
                                <li className="p-12 text-center">
                                    <div className="mx-auto h-12 w-12 text-gray-300 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <p className="text-gray-500">No sessions scheduled.</p>
                                </li>
                            )}
                            {sessions.map((session) => {
                                const sessionDate = new Date(session.startTime);
                                const isFull = session._count.bookings >= session.class.capacity;

                                return (
                                    <li key={session.id} className="group hover:bg-gray-50 transition-colors">
                                        <div className="px-6 py-5 flex items-center gap-6">
                                            {/* Date Block */}
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                <span className="text-xs font-bold uppercase">{sessionDate.toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-xl font-bold">{sessionDate.getDate()}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {session.class.name}
                                                    </h4>
                                                    {!isMember && (
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${session.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {session.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        <span className={isFull ? "text-amber-600 font-medium" : ""}>
                                                            {session._count.bookings} / {session.class.capacity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {isMember ? (
                                                    <BookClassButton
                                                        sessionId={session.id}
                                                        isBooked={session.bookings.length > 0}
                                                    />
                                                ) : (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {/* Manage Button Placeholder */}
                                                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                                                            <MoreHorizontal className="h-5 w-5" /> {/* Need to import MoreHorizontal */}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

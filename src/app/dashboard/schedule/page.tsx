
import { getClasses, getSessions } from "@/server/actions/class";
import { CreateClassForm } from "@/components/dashboard/ClassForm";
import { ScheduleSessionForm } from "@/components/dashboard/ScheduleSessionForm";
import { BookClassButton } from "@/components/dashboard/BookClassButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Class Schedule</h1>
                <p className="mt-2 text-gray-600">
                    {isMember ? "Browse and book upcoming classes." : "Manage your class types and schedule upcoming sessions."}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Column: Manage Classes (Hidden for Members) */}
                {!isMember && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 shadow sm:rounded-lg border border-gray-200">
                            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create New Class Type</h2>
                            <CreateClassForm />
                        </div>

                        <div className="bg-white shadow sm:rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Existing Classes</h3>
                            </div>
                            <ul role="list" className="divide-y divide-gray-200">
                                {classes.length === 0 && (
                                    <li className="px-4 py-4 text-sm text-gray-500">No classes defined yet.</li>
                                )}
                                {classes.map((c) => (
                                    <li key={c.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-indigo-600">{c.name}</p>
                                            <p className="text-sm text-gray-500">{c.duration} mins • {c.capacity} capacity</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Right Column: Schedule Sessions (Expanded for Members) */}
                <div className={`space-y-6 ${isMember ? 'md:col-span-2' : ''}`}>
                    {!isMember && (
                        <div className="bg-white p-6 shadow sm:rounded-lg border border-gray-200">
                            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Schedule a Session</h2>
                            {classes.length > 0 ? (
                                <ScheduleSessionForm classes={classes} />
                            ) : (
                                <p className="text-sm text-gray-500">Create a class type first.</p>
                            )}
                        </div>
                    )}

                    <div className="bg-white shadow sm:rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Upcoming Sessions</h3>
                        </div>
                        <ul role="list" className="divide-y divide-gray-200">
                            {sessions.length === 0 && (
                                <li className="px-4 py-4 text-sm text-gray-500">No sessions scheduled.</li>
                            )}
                            {sessions.map((session) => (
                                <li key={session.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{session.class.name}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(session.startTime).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {session._count.bookings} / {session.class.capacity} booked
                                            </p>
                                        </div>
                                        <div>
                                            {isMember ? (
                                                <BookClassButton
                                                    sessionId={session.id}
                                                    isBooked={session.bookings.length > 0}
                                                />
                                            ) : (
                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                                    {session.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

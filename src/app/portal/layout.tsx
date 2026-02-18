
import Link from 'next/link';
import { Dumbbell, LogOut, Calendar, User, Home } from 'lucide-react';
import { auth, signOut } from '@/auth';

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/portal" className="flex flex-shrink-0 items-center gap-2 group">
                                <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                                    <Dumbbell className="h-5 w-5" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">My Gym</span>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex ml-4 gap-1">
                                <Link href="/portal" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                                <Link href="/portal/bookings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                                    <Calendar className="h-4 w-4" />
                                    Bookings
                                </Link>
                                <Link href="/portal/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900 leading-none">
                                    {session?.user?.name || "Member"}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">Free Member</span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-xs">
                                        {session?.user?.name?.[0] || "M"}
                                    </div>
                                )}
                            </div>

                            <form action={async () => {
                                "use server"
                                await signOut({ redirectTo: "/" })
                            }}>
                                <button type="submit" className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

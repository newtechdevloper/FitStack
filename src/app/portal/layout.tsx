
import Link from 'next/link';
import { Dumbbell, LogOut } from 'lucide-react';
import { auth, signOut } from '@/auth';

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <Link href="/portal" className="flex flex-shrink-0 items-center">
                                <Dumbbell className="h-8 w-8 text-indigo-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">My Gym</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-4">
                                Hello, {session?.user?.name || "Member"}
                            </span>
                            <form action={async () => {
                                "use server"
                                await signOut({ redirectTo: "/" })
                            }}>
                                <button type="submit" className="text-gray-500 hover:text-gray-700">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {children}
            </main>
        </div>
    );
}

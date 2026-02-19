
import Link from 'next/link';
import { Building2, LogOut, Calendar, User, Home } from 'lucide-react';
import { auth, signOut } from '@/auth';
import { MemberSidebar } from '@/components/dashboard/MemberSidebar';

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex h-screen mesh-gradient-bg overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-500/10 blur-[120px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/10 blur-[120px] opacity-10 pointer-events-none" />

            {/* Sidebar */}
            <div className="hidden md:block fixed inset-y-0 z-50">
                <MemberSidebar />
            </div>

            <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 relative z-10">
                {/* Minimal Header for Portal */}
                <header className="flex h-20 items-center justify-between px-8 border-b border-white/5 glass-morphism backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-70">
                            Neural Sync: Active
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                                {session?.user?.name || "Member"}
                            </span>
                            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1">PLATINUM NODE</span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px]">
                            <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden uppercase">
                                {session?.user?.name?.[0] || "M"}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

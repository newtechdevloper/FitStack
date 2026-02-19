
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Basic Role protection
    // In a real app, you would check session.user.globalRole === 'SUPER_ADMIN'
    if (!session?.user) {
        redirect("/login");
    }

    // TODO: Add stricter role check here
    // if (session.user.globalRole !== 'SUPER_ADMIN') redirect('/dashboard');

    return (
        <div className="flex h-screen mesh-gradient-bg overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-glow blur-[120px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary-glow blur-[120px] opacity-20 pointer-events-none" />

            {/* Sidebar */}
            <div className="hidden md:block fixed inset-y-0 z-50">
                <AdminSidebar />
            </div>

            <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 relative z-10">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

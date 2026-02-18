
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
        <div className="flex h-screen bg-zinc-950">
            {/* Sidebar hidden on mobile, block on md+ */}
            <div className="hidden md:block fixed inset-y-0 z-50">
                <AdminSidebar />
            </div>

            <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6 bg-zinc-900 text-zinc-200">
                    {children}
                </main>
            </div>
        </div>
    );
}

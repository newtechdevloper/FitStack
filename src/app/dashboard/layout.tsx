import { Sidebar } from "@/components/dashboard/Sidebar";
import { MemberSidebar } from "@/components/dashboard/MemberSidebar";
import { Header } from "@/components/dashboard/Header";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SubscriptionGate } from "@/components/dashboard/SubscriptionGate";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    // Check user's role in their first tenant context
    let isOwnerOrAdmin = false;
    let subscriptionStatus = 'trialing';

    // 1. Handle Temp Admin (Bypass DB)
    if (session.user.id === 'temp-admin-user' || (session.user as any).globalRole === 'SUPER_ADMIN') {
        isOwnerOrAdmin = true;
        subscriptionStatus = 'active';
    }
    // 2. Handle Real User with DB
    else {
        try {
            const tenantUser = await prisma.tenantUser.findFirst({
                where: { userId: session.user.id },
                include: {
                    tenant: {
                        include: { tenantSubscription: true }
                    }
                }
            });

            if (tenantUser) {
                isOwnerOrAdmin = tenantUser?.role === 'OWNER' || tenantUser?.role === 'ADMIN';
                subscriptionStatus = tenantUser?.tenant?.tenantSubscription?.status || 'trialing';
            }
        } catch (error) {
            console.error("Dashboard Layout DB Error:", error);
            // If DB is down, we show Member View (safe fallback) or Error UI.
            // We swallow the error to prevent 500 Page Crash
        }
    }

    // If owner, enforce gate. Members might have different rules (gym pays, not them).
    // Usually if Gym is canceled, Members should also be blocked or see a message.
    // For now, let's gate everyone if the Gym is down.

    return (
        <div className="flex h-screen mesh-gradient-bg overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/10 blur-[120px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-fuchsia-500/10 blur-[120px] opacity-10 pointer-events-none" />

            {/* Sidebar */}
            <div className="hidden md:block fixed inset-y-0 z-50">
                {isOwnerOrAdmin ? <Sidebar /> : <MemberSidebar />}
            </div>

            <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 relative z-10">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        <SubscriptionGate status={subscriptionStatus}>
                            {children}
                        </SubscriptionGate>
                    </div>
                </main>
            </div>
        </div>
    );
}

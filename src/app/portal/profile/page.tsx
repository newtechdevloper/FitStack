import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Building2, LogOut, Settings } from "lucide-react";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const memberships = await prisma.tenantUser.findMany({
        where: { userId: session.user.id },
        include: { tenant: true }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
                <p className="mt-2 text-gray-500">Manage your personal information and account settings.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Main Profile Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-600" />
                                Personal Information
                            </h2>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Edit</button>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                                    {session.user.image ? (
                                        <img src={session.user.image} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-3xl">
                                            {session.user.name?.[0] || "?"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{session.user.name}</h3>
                                    <p className="text-gray-500">{session.user.email}</p>
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <div className="mt-2 flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-900 font-medium">
                                        <User className="h-4 w-4 text-gray-400" />
                                        {session.user.name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <div className="mt-2 flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-900 font-medium">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        {session.user.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Memberships */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-indigo-600" />
                                My Gyms
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {memberships.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    You are not a member of any gyms.
                                </div>
                            )}
                            {memberships.map((m) => (
                                <div key={m.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{m.tenant.name}</h3>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{m.tenant.description || "No description"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${m.role === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                                                m.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {m.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-gray-400" />
                                Account
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <form action={async () => {
                                "use server"
                                await signOut({ redirectTo: "/" })
                            }}>
                                <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </form>
                            <button className="w-full text-center text-xs text-red-500 hover:text-red-700 hover:underline">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

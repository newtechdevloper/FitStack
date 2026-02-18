
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateSettings } from "./actions";
import { DeleteTenantButton } from "@/components/dashboard/DeleteTenantButton";
import { Building2, Globe, AlertTriangle, Save } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        include: { tenant: true }
    });

    if (!tenantUser?.tenantId) redirect("/onboarding");
    if (tenantUser.role !== 'OWNER' && tenantUser.role !== 'ADMIN') {
        return (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-red-700">
                <div className="flex bg-red-50">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Access Denied. Only Owners can manage settings.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gym Settings</h1>
                <p className="mt-2 text-gray-500">
                    Manage your gym's public profile, preferences, and danger zone.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Settings Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-indigo-600" />
                                General Information
                            </h2>
                        </div>
                        <div className="p-6">
                            <form action={updateSettings} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Gym Name
                                    </label>
                                    <div className="mt-2 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            defaultValue={tenantUser.tenant.name}
                                            className="block w-full pl-10 rounded-xl border-gray-300 py-2.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">This is the name visible to your members.</p>
                                </div>

                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
                                        Subdomain Slug
                                    </label>
                                    <div className="mt-2 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="slug"
                                            id="slug"
                                            disabled
                                            defaultValue={tenantUser.tenant.slug}
                                            className="block w-full pl-10 rounded-xl border-gray-200 bg-gray-50 py-2.5 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Your unique URL identifier. Cannot be changed.</p>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Danger Zone */}
                <div className="space-y-6">
                    {/* Danger Zone */}
                    {tenantUser.role === 'OWNER' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                            <div className="p-6 border-b border-red-50 bg-red-50/30">
                                <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    Danger Zone
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-6">
                                    Permanently delete your gym and all associated data. This action cannot be undone.
                                </p>
                                <DeleteTenantButton />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


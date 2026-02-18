
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateSettings } from "./actions";
import { DeleteTenantButton } from "@/components/dashboard/DeleteTenantButton";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        include: { tenant: true }
    });

    if (!tenantUser?.tenantId) redirect("/onboarding");
    if (tenantUser.role !== 'OWNER' && tenantUser.role !== 'ADMIN') {
        return <div>Access Denied. Only Owners can manage settings.</div>;
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gym Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your gym's profile and preferences.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">General Information</h3>
                    <form action={updateSettings} className="mt-5 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Gym Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    defaultValue={tenantUser.tenant.name}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
                                Subdomain Slug (Cannot be changed)
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="slug"
                                    id="slug"
                                    disabled
                                    defaultValue={tenantUser.tenant.slug}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {tenantUser.role === 'OWNER' && (
                <div className="bg-white shadow sm:rounded-lg border-l-4 border-red-500">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Danger Zone</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Once you delete your gym, there is no going back. Please be certain.</p>
                        </div>
                        <div className="mt-5">
                            <DeleteTenantButton />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ConnectRazorpayButton } from "@/components/dashboard/ConnectRazorpayButton";
import { CheckCircle2 } from "lucide-react";
import RazorpayCheckoutButton from "@/components/dashboard/RazorpayCheckoutButton";

export default async function BillingPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
        include: {
            tenant: {
                include: {
                    plan: true,
                    tenantSubscription: true
                }
            }
        }
    });

    if (!tenantUser) return <div>Gym not found.</div>;

    const tenant = tenantUser.tenant;
    const isConnected = !!tenant.razorpayAccountId;
    const isSuccess = searchParams['connect'] === 'success';
    const status = tenant.tenantSubscription?.status || 'trialing';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Billing & Payouts</h1>
                <p className="mt-2 text-gray-600">Manage your subscription and payout settings.</p>
            </div>

            {isSuccess && (
                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                    <div className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Account Connected</h3>
                            <p className="mt-2 text-sm text-green-700">Your bank account has been successfully connected for payouts.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Platform Subscription */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Subscription</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Plan</span>
                            <span className="font-medium text-gray-900">{tenant.plan?.name || "Free Trial"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {status.toUpperCase()}
                            </span>
                        </div>
                        {!tenant.tenantSubscription && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs text-gray-500">Choose a plan to get started:</p>
                                <RazorpayCheckoutButton plan="starter" label="Subscribe — Starter" />
                                <RazorpayCheckoutButton plan="growth" label="Subscribe — Growth" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Payout Settings */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Settings</h2>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Connect your bank account to receive payouts from member bookings via Razorpay.
                        </p>
                        {isConnected ? (
                            <div className="rounded-md bg-gray-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">R</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Razorpay Connected</p>
                                        <p className="text-xs text-gray-500">Account: {tenant.razorpayAccountId}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <ConnectRazorpayButton isConnected={true} accountRef={tenant.razorpayAccountId ?? undefined} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                                <p className="text-sm text-gray-600 mb-4">
                                    You need to set up payouts to accept payments from members.
                                </p>
                                <ConnectRazorpayButton isConnected={false} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

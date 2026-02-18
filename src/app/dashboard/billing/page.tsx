
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ConnectRazorpayButton } from "@/components/dashboard/ConnectRazorpayButton";
import { CheckCircle2, CreditCard, Wallet, AlertCircle, Building2 } from "lucide-react";
import RazorpayCheckoutButton from "@/components/dashboard/RazorpayCheckoutButton";

export default async function BillingPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

    const tenant = tenantUser.tenant as any;
    const isConnected = !!tenant.razorpayAccountId;
    const resolvedSearchParams = await searchParams;
    const isSuccess = resolvedSearchParams['connect'] === 'success';
    const status = tenant.tenantSubscription?.status || 'trialing';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Billing & Payouts</h1>
                <p className="mt-2 text-gray-500">Manage your subscription plan and payout account settings.</p>
            </div>

            {isSuccess && (
                <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-emerald-800">Account Connected</h3>
                        <p className="mt-1 text-sm text-emerald-700">Your bank account has been successfully connected via Razorpay.</p>
                    </div>
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Platform Subscription Card */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-indigo-600" />
                            Current Plan
                        </h2>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}>
                            {status}
                        </span>
                    </div>

                    <div className="p-8">
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-extrabold text-gray-900">
                                {/* Hardcoded pricing map since Plan model lacks price field */}
                                {tenant.plan?.key === 'STARTER' ? '$29' :
                                    tenant.plan?.key === 'GROWTH' ? '$79' :
                                        tenant.plan?.key === 'PRO' ? '$199' :
                                            '$0'}
                            </span>
                            <span className="text-gray-500 font-medium">/month</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Plan Name</span>
                                <span className="font-semibold text-gray-900">{tenant.plan?.name || "Trial Period"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Next Billing Date</span>
                                <span className="font-medium text-gray-900">Oct 24, 2026</span> {/* Mock Date */}
                            </div>
                        </div>

                        {!tenant.tenantSubscription ? (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700">Upgrade to unlock full features:</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <RazorpayCheckoutButton plan="starter" label="Starter ($29)" />
                                    <RazorpayCheckoutButton plan="growth" label="Growth ($79)" />
                                </div>
                            </div>
                        ) : (
                            <button className="w-full py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                Manage Subscription
                            </button>
                        )}
                    </div>
                </div>

                {/* Payout Settings Card */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-indigo-600" />
                            Payout Settings
                        </h2>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-900">Razorpay Connect</h3>
                                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                    Connect your Razorpay account to automatically receive payouts from member bookings and purchases.
                                </p>
                            </div>
                        </div>

                        {isConnected ? (
                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-lg bg-[#0c2451] flex items-center justify-center text-white font-bold text-sm shadow-sm">R</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Connected</p>
                                        <p className="text-xs text-gray-500 font-mono">{tenant.razorpayAccountId}</p>
                                    </div>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
                                </div>
                                <ConnectRazorpayButton isConnected={true} accountRef={tenant.razorpayAccountId ?? undefined} />
                            </div>
                        ) : (
                            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">Payouts Disabled</p>
                                        <p className="text-xs text-amber-700 mt-1">You must connect Razorpay to accept payments.</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <ConnectRazorpayButton isConnected={false} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

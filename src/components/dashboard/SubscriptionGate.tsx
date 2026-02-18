
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import Link from "next/link";

interface SubscriptionGateProps {
    status: string; // "active" | "trialing" | "past_due" | "canceled"
    children: React.ReactNode;
}

export function SubscriptionGate({ status, children }: SubscriptionGateProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Paths that are always allowed (Billing, Settings, etc. to recover)
    const allowedPaths = ["/dashboard/billing", "/dashboard/settings"];
    const isAllowedPath = allowedPaths.some(p => pathname?.startsWith(p));

    if (status === "canceled" && !isAllowedPath) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                        <Lock className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Canceled</h2>
                    <p className="text-gray-500 mb-6">
                        Your gym's subscription has been canceled. Please reactivate your plan to access the dashboard.
                    </p>
                    <Link
                        href="/dashboard/billing"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-[#635BFF] px-5 py-3 text-base font-semibold text-white shadow-md hover:bg-[#534be0] transition-colors"
                    >
                        Go to Billing
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {status === "past_due" && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <span className="font-medium">Payment Past Due.</span> Your subscription payment failed.
                                <Link href="/dashboard/billing" className="font-semibold underline ml-1 hover:text-red-800">
                                    Update payment method
                                </Link>
                                {" "}to avoid interruption.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}

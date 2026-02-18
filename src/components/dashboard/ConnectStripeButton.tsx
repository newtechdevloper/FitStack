
"use client";

import { useTransition } from "react";
import { createStripeConnectAccount } from "@/server/actions/stripe";
import { Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConnectStripeButton({ isConnected }: { isConnected: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleConnect = () => {
        startTransition(async () => {
            try {
                const result = await createStripeConnectAccount();
                if (result.url) {
                    window.location.href = result.url;
                }
            } catch (error) {
                alert("Failed to initiate Stripe Connect. Please try again.");
            }
        });
    };

    return (
        <button
            onClick={handleConnect}
            disabled={isPending}
            className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${isConnected
                    ? "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    : "bg-[#635BFF] text-white hover:bg-[#534be0] focus-visible:outline-[#635BFF]"
                }`}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isConnected ? (
                <>
                    Manage Payouts <ExternalLink className="h-4 w-4" />
                </>
            ) : (
                "Connect with Stripe"
            )}
        </button>
    );
}

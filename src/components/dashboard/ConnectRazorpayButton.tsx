
"use client";

import { useState, useTransition } from "react";
import { Loader2, ExternalLink, Building2 } from "lucide-react";

interface ConnectRazorpayButtonProps {
    isConnected: boolean;
    accountRef?: string;
}

export function ConnectRazorpayButton({ isConnected, accountRef }: ConnectRazorpayButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [bankAccount, setBankAccount] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = () => {
        if (!bankAccount || !ifsc) {
            setError("Please fill in all fields.");
            return;
        }
        startTransition(async () => {
            try {
                const { saveRazorpayAccountDetails } = await import("@/server/actions/razorpay");
                await saveRazorpayAccountDetails(bankAccount, ifsc);
                setSuccess(true);
                setShowForm(false);
            } catch (err: any) {
                setError(err.message || "Failed to save account details.");
            }
        });
    };

    if (isConnected || success) {
        return (
            <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-300"
            >
                <Building2 className="h-4 w-4 text-green-500" />
                Bank Account Connected
                <ExternalLink className="h-4 w-4" />
            </button>
        );
    }

    if (showForm) {
        return (
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Bank Account Number"
                    value={bankAccount}
                    onChange={e => setBankAccount(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="IFSC Code (e.g. SBIN0001234)"
                    value={ifsc}
                    onChange={e => setIfsc(e.target.value.toUpperCase())}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="flex-1 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Details"}
                    </button>
                    <button
                        onClick={() => setShowForm(false)}
                        className="rounded-md px-4 py-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-blue-600 text-white hover:bg-blue-700"
        >
            <Building2 className="h-4 w-4" />
            Connect Bank Account
        </button>
    );
}

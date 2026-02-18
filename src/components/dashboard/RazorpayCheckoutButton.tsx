
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
    plan: "starter" | "growth";
    label: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RazorpayCheckoutButton({ plan, label }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCheckout = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/razorpay/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to create subscription");
            }

            const { subscriptionId, keyId, customerName, customerEmail } = await res.json();

            // Load Razorpay checkout script dynamically
            if (!window.Razorpay) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
                    document.body.appendChild(script);
                });
            }

            const options = {
                key: keyId,
                subscription_id: subscriptionId,
                name: "Nexus Gym SaaS",
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
                prefill: {
                    name: customerName,
                    email: customerEmail,
                },
                theme: { color: "#2563EB" },
                handler: () => {
                    // Payment successful — webhook will update DB
                    window.location.href = "/dashboard/billing?success=true";
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
            </button>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

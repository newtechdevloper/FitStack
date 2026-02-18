
"use client";

import { useTransition } from "react";
import { bookClass } from "@/server/actions/class";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function BookClassButton({ sessionId, isBooked }: { sessionId: string, isBooked: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleBook = () => {
        startTransition(async () => {
            const result = await bookClass(sessionId);
            if (result.error) {
                alert(result.error);
            } else {
                alert("Booked successfully!");
                router.refresh(); // Refresh to update UI
            }
        });
    };

    if (isBooked) {
        return (
            <button
                disabled
                className="rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 opacity-70 cursor-not-allowed"
            >
                Booked
            </button>
        );
    }

    return (
        <button
            onClick={handleBook}
            disabled={isPending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Book Class
        </button>
    );
}


"use client";

import { useState, useTransition } from "react";
import { deleteTenant } from "@/app/dashboard/settings/actions";
import { Trash2, AlertTriangle } from "lucide-react";

import { toast } from "sonner";

export function DeleteTenantButton() {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteTenant();
                toast.success("Gym deleted successfully");
            } catch (error) {
                toast.error("Failed to delete gym. Please try again.");
                console.error(error);
            }
        });
    };

    if (showConfirm) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in zoom-in duration-200">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900">Are you absolutely sure?</h4>
                        <p className="text-sm text-red-700 mt-1">
                            This action cannot be undone. All data, members, and settings will be permanently lost.
                        </p>
                        <div className="flex gap-3 mt-3">
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50 transition-colors"
                            >
                                {isPending ? "Deleting..." : "Yes, Delete Everything"}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                                className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors"
        >
            <Trash2 className="w-4 h-4" />
            Delete Gym
        </button>
    );
}

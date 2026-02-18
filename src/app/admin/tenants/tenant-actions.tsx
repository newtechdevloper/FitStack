'use client';

import { useState } from 'react';
import { MoreHorizontal, Ban, Trash2, CheckCircle } from 'lucide-react';
import { suspendTenant, activateTenant, deleteTenant } from './actions';

interface TenantActionsProps {
    tenantId: string;
    isSuspended: boolean;
}

export function TenantActions({ tenantId, isSuspended }: TenantActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSuspend = async () => {
        setLoading(true);
        if (isSuspended) {
            await activateTenant(tenantId);
        } else {
            await suspendTenant(tenantId);
        }
        setLoading(false);
        setIsOpen(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this tenant? This action cannot be undone.")) return;
        setLoading(true);
        await deleteTenant(tenantId);
        setLoading(false);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleOpen}
                disabled={loading}
                className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
            >
                <MoreHorizontal className="h-5 w-5" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-md border border-zinc-800 bg-zinc-950 shadow-xl z-20 overflow-hidden">
                        <button
                            onClick={handleSuspend}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white text-left transition-colors"
                        >
                            {isSuspended ? (
                                <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Activate Tenant
                                </>
                            ) : (
                                <>
                                    <Ban className="h-4 w-4 text-yellow-500" />
                                    Suspend Tenant
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300 text-left transition-colors border-t border-zinc-900"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Tenant
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

import { Shield, X } from "lucide-react";
import { getTenantContext } from "@/lib/context";
import { impersonateTenant } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export async function ImpersonationBanner() {
    const context = await getTenantContext();

    if (!context.isImpersonating || !context.tenantId) {
        return null;
    }

    const tenant = await prisma.tenant.findUnique({
        where: { id: context.tenantId },
        select: { name: true }
    });

    return (
        <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between shadow-2xl relative z-[1000] border-b border-indigo-400/30">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-md bg-white/20 flex items-center justify-center animate-pulse">
                    <Shield className="h-3.5 w-3.5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest italic">
                    <span className="opacity-70">Super Admin Mode:</span> Impersonating Hub <span className="text-white underline decoration-indigo-400">{tenant?.name || "Unknown"}</span>
                </p>
            </div>

            <form action={impersonateTenant.bind(null, null)}>
                <button
                    type="submit"
                    className="flex items-center gap-2 bg-white text-indigo-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
                >
                    <X className="h-3 w-3" />
                    Stop View
                </button>
            </form>
        </div>
    );
}

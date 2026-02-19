import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import {
    Building2, Users, Shield, Activity, Clock, CheckCircle, XCircle, TriangleAlert
} from "lucide-react";
import { CreateTenantModal } from "./create-tenant-modal";
import { TenantTableClient } from "./tenant-table-client";

export const metadata: Metadata = { title: 'Tenants | Super Admin' };

async function getTenants() {
    return prisma.tenant.findMany({
        include: {
            plan: true,
            tenantSubscription: true,
            _count: { select: { users: true, classes: true, bookings: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function TenantsPage() {
    const rawTenants = await getTenants();
    const rawPlans = await prisma.plan.findMany();

    // Standardize Decimal objects for Client Components
    const tenants = JSON.parse(JSON.stringify(rawTenants));
    const plans = JSON.parse(JSON.stringify(rawPlans));

    const statusConfig: Record<string, { label: string; color: string }> = {
        active: { label: 'Active', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
        trialing: { label: 'Trialing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
        canceled: { label: 'Suspended', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
        past_due: { label: 'Past Due', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 uppercase tracking-tighter">
                <div>
                    <h1 className="text-4xl font-black text-white italic">
                        Tenant Console
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Orchestrating {tenants.length} active platform nodes
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <CreateTenantModal plans={plans} />
                </div>
            </div>

            {/* Stats Row - Holographic cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Nodes", value: tenants.length, icon: Building2, color: "text-indigo-400", border: "border-indigo-500/20" },
                    { label: "Active Units", value: (tenants || []).reduce((a: number, t: any) => a + (t._count?.users || 0), 0).toLocaleString(), icon: Users, color: "text-cyan-400", border: "border-cyan-500/20" },
                    { label: "Operations", value: (tenants || []).reduce((a: number, t: any) => a + (t._count?.classes || 0), 0).toLocaleString(), icon: Activity, color: "text-purple-400", border: "border-purple-500/20" },
                    { label: "Integrations", value: (tenants || []).reduce((a: number, t: any) => a + (t._count?.bookings || 0), 0).toLocaleString(), icon: Shield, color: "text-emerald-400", border: "border-emerald-500/20" },
                ].map((s: any, i: number) => (
                    <div key={i} className={`holographic-card glass-morphism p-5 rounded-2xl border ${s.border} group`}>
                        <div className="flex items-center gap-3 mb-3">
                            <s.icon className={`h-4 w-4 ${s.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">{s.label}</p>
                        </div>
                        <p className={`text-2xl font-black text-white italic tracking-tighter`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Tenant Registry - Client Side for Search/Features */}
            <TenantTableClient
                initialTenants={tenants}
                statusConfig={statusConfig}
                plans={plans}
            />
        </div>
    );
}

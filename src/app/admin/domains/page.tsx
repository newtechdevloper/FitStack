import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import { Globe, Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { DomainTableClient } from "./domain-table-client";

export const metadata: Metadata = { title: 'Domains | Super Admin' };

async function getDomainData() {
    const tenants = await prisma.tenant.findMany({
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            name: true,
            slug: true,
            customDomain: true,
            domainStatus: true,
            updatedAt: true
        }
    });

    return JSON.parse(JSON.stringify(tenants));
}

export default async function DomainsPage() {
    const rawTenants = await getDomainData();
    const tenants = JSON.parse(JSON.stringify(rawTenants));
    const verifiedCount = tenants.filter((t: any) => t.domainStatus === 'VERIFIED').length;
    const pendingCount = tenants.filter((t: any) => t.domainStatus === 'PENDING' && t.customDomain).length;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Domain Registry
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Orchestrating {tenants.length} network access points
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Verified Domains", value: verifiedCount, icon: CheckCircle, color: "text-emerald-400", border: "border-emerald-500/20" },
                    { label: "Pending Setup", value: pendingCount, icon: Clock, color: "text-amber-400", border: "border-amber-500/20" },
                    { label: "Network Capacity", value: tenants.length, icon: Globe, color: "text-indigo-400", border: "border-indigo-500/20" },
                    { label: "System Guard", value: "Active", icon: Shield, color: "text-cyan-400", border: "border-cyan-500/20" },
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

            {/* Warning Info */}
            <div className="glass-morphism rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-4 flex items-center gap-4">
                <AlertTriangle className="h-5 w-5 text-blue-400" />
                <p className="text-[10px] text-blue-300 font-medium uppercase tracking-tight">
                    Custom domain verification requires CNAME propagation. Primary node: fitstack.com
                </p>
            </div>

            <DomainTableClient initialTenants={tenants} />
        </div>
    );
}

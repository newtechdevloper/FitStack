"use client";

import { useState } from "react";
import {
    Globe, Shield, CheckCircle, XCircle, Clock,
    Search, Filter, ExternalLink, AlertTriangle, RefreshCw
} from "lucide-react";
import { updateTenantDomain, verifyTenantDomain } from "../actions";

interface DomainTableClientProps {
    initialTenants: any[];
}

export function DomainTableClient({ initialTenants }: DomainTableClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isVerifying, setIsVerifying] = useState<string | null>(null);

    const filteredTenants = initialTenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customDomain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleVerify = async (tenantId: string) => {
        setIsVerifying(tenantId);
        try {
            await verifyTenantDomain(tenantId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsVerifying(null);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'FAILED': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search by hub or custom domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass-morphism border-white/5 bg-white/5 text-white text-xs pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 font-bold uppercase tracking-tight"
                    />
                </div>
            </div>

            <div className="glass-morphism rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5">
                            <tr>
                                {['Hub Identity', 'Custom Domain', 'DNS Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-[10px] font-black text-zinc-500 px-8 py-4 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <p className="font-black text-white text-sm uppercase tracking-tighter leading-none mb-1">{tenant.name}</p>
                                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none">{tenant.slug}.fitstack.com</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {tenant.customDomain ? (
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-3 w-3 text-cyan-400" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{tenant.customDomain}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest italic">Default Subdomain Only</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black italic uppercase tracking-widest border border-white/10 ${getStatusStyles(tenant.domainStatus)}`}>
                                            {tenant.domainStatus === 'VERIFIED' ? <CheckCircle className="h-3 w-3" /> : tenant.domainStatus === 'FAILED' ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {tenant.domainStatus}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleVerify(tenant.id)}
                                                disabled={!tenant.customDomain || isVerifying === tenant.id}
                                                className="neon-border-cyan glass-morphism text-cyan-400 p-2 rounded-xl hover:bg-cyan-500/10 transition-colors disabled:opacity-20"
                                                title="Sync DNS Records"
                                            >
                                                <RefreshCw className={`h-4 w-4 ${isVerifying === tenant.id ? 'animate-spin' : ''}`} />
                                            </button>
                                            {tenant.customDomain && (
                                                <a
                                                    href={`https://${tenant.customDomain}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="neon-border glass-morphism text-emerald-400 p-2 rounded-xl hover:bg-emerald-500/10 transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTenants.length === 0 && (
                        <div className="p-20 text-center">
                            <Globe className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">No network nodes found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

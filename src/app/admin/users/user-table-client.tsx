"use client";

import { useState } from "react";
import {
    Search, Shield, Ban, Crown, Trash2, Mail, Calendar,
    UserCheck, AlertTriangle, CheckCircle, XCircle, MoreVertical, ExternalLink
} from "lucide-react";
import { banUser, unbanUser, promoteToSuperAdmin, deleteUserAdmin, impersonateTenant } from "../actions";

interface UserTableClientProps {
    initialUsers: any[];
}

export function UserTableClient({ initialUsers }: UserTableClientProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = initialUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImpersonate = async (user: any) => {
        // If the user is a tenant admin, we can impersonate their primary tenant
        const primaryTenant = user.memberships?.find((m: any) => m.role === 'OWNER' || m.role === 'ADMIN');
        if (primaryTenant) {
            await impersonateTenant(primaryTenant.tenantId);
        } else {
            alert("This user has no active tenant administrative roles to impersonate.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                    type="text"
                    placeholder="Search global identities by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full glass-morphism border-white/5 bg-white/5 text-white text-xs pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-zinc-600 font-bold uppercase tracking-tight"
                />
            </div>

            {/* Table */}
            <div className="glass-morphism rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5">
                            <tr>
                                {['Identity', 'Deployment Roles', 'Global Access', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-[10px] font-black text-zinc-500 px-8 py-4 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => {
                                const isSuperAdmin = user.globalRole === 'SUPER_ADMIN';
                                const isBanned = user.globalRole === 'BANNED';
                                const hasTenants = user.memberships?.length > 0;

                                return (
                                    <tr key={user.id} className={`hover:bg-white/5 transition-all group ${isBanned ? 'opacity-40' : ''}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-white font-black text-xs border border-white/10 italic">
                                                    {(user.name || user.email).substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-sm uppercase tracking-tighter leading-none mb-1">{user.name || 'Anonymous Entity'}</p>
                                                    <p className="text-[10px] text-zinc-500 font-mono tracking-widest leading-none lowercase">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex -space-x-2">
                                                {user.memberships?.slice(0, 3).map((m: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="h-7 w-7 rounded-lg glass-morphism border border-white/10 flex items-center justify-center text-[8px] font-black text-zinc-400 bg-black/40 uppercase"
                                                        title={`${m.tenant.name} (${m.role})`}
                                                    >
                                                        {m.tenant.name.substring(0, 1)}
                                                    </div>
                                                ))}
                                                {user.memberships?.length > 3 && (
                                                    <div className="h-7 w-7 rounded-lg glass-morphism border border-white/10 flex items-center justify-center text-[8px] font-black text-zinc-500 bg-black/40">
                                                        +{user.memberships.length - 3}
                                                    </div>
                                                )}
                                                {user.memberships?.length === 0 && (
                                                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">No Node Assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black italic uppercase tracking-widest border border-white/10 ${isSuperAdmin ? 'text-amber-400 bg-amber-400/10' : isBanned ? 'text-red-400 bg-red-400/10' : 'text-zinc-400 bg-white/5'
                                                }`}>
                                                {isSuperAdmin ? <Crown className="h-3 w-3 shadow-[0_0_10px_rgba(251,191,36,0.5)]" /> : <Shield className="h-3 w-3" />}
                                                {user.globalRole}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                {/* Impersonate */}
                                                <button
                                                    onClick={() => handleImpersonate(user)}
                                                    disabled={isBanned || !hasTenants}
                                                    className="neon-border-cyan glass-morphism text-cyan-400 hover:bg-cyan-500/10 transition-colors p-2 rounded-xl disabled:opacity-20"
                                                    title="Impersonate Node Admin"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                </button>

                                                {/* Global Role Promotion */}
                                                {!isSuperAdmin && (
                                                    <button
                                                        onClick={() => promoteToSuperAdmin(user.id)}
                                                        className="neon-border glass-morphism text-amber-400 hover:bg-amber-500/10 transition-colors p-2 rounded-xl"
                                                        title="Promote to Super Admin"
                                                    >
                                                        <Crown className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {/* Ban / Unban */}
                                                {isBanned ? (
                                                    <button
                                                        onClick={() => unbanUser(user.id)}
                                                        className="glass-morphism text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors p-2 rounded-xl"
                                                        title="Restore Access Protocol"
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => banUser(user.id)}
                                                        className="glass-morphism text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors p-2 rounded-xl"
                                                        title="Blacklist Protocol"
                                                    >
                                                        <Ban className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                <button
                                                    onClick={async () => {
                                                        if (confirm(`Purge identity ${user.email}? This is permanent.`)) {
                                                            await deleteUserAdmin(user.id);
                                                        }
                                                    }}
                                                    className="neon-border glass-morphism text-red-500 hover:bg-red-500/10 transition-colors p-2 rounded-xl"
                                                    title="Purge Identity"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-20 text-center">
                            <Search className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic text-glow">Identity registry scan returned zero results.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

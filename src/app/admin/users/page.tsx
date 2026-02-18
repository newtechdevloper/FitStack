import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import {
    Users, Shield, Ban, Crown, Trash2, CheckCircle, XCircle,
    AlertTriangle, UserCheck, Mail, Calendar
} from "lucide-react";
import { banUser, unbanUser, promoteToSuperAdmin, deleteUserAdmin } from "../actions";

export const metadata: Metadata = { title: 'Users | Super Admin' };

async function getUsers() {
    return prisma.user.findMany({
        include: {
            memberships: {
                include: { tenant: { select: { name: true, slug: true } } }
            },
            _count: { select: { memberships: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });
}

export default async function UsersPage() {
    const users = await getUsers();

    const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
        SUPER_ADMIN: { label: 'Super Admin', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20', icon: Crown },
        USER: { label: 'User', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20', icon: UserCheck },
        BANNED: { label: 'Banned', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Ban },
    };

    const totalBanned = users.filter(u => u.globalRole === 'BANNED').length;
    const totalAdmins = users.filter(u => u.globalRole === 'SUPER_ADMIN').length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Control access for all {users.length} platform users.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-lg px-3 py-2">
                        {totalAdmins} Super Admins
                    </span>
                    <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                        {totalBanned} Banned
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Users", value: users.length, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
                    { label: "Super Admins", value: totalAdmins, color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
                    { label: "Banned", value: totalBanned, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
                ].map((s, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${s.bg}`}>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</p>
                        <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <Users className="h-4 w-4 text-zinc-400" />
                        All Users
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900/80">
                            <tr>
                                {['User', 'Role', 'Gyms', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-medium text-zinc-500 px-6 py-3 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {users.map((user) => {
                                const role = user.globalRole || 'USER';
                                const cfg = roleConfig[role] || roleConfig.USER;
                                const isBanned = role === 'BANNED';

                                return (
                                    <tr key={user.id} className={`hover:bg-zinc-800/30 transition-colors group ${isBanned ? 'opacity-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center text-blue-300 font-bold text-sm border border-blue-500/20 flex-shrink-0">
                                                    {(user.name || user.email).substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">{user.name || 'No Name'}</p>
                                                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                                                        <Mail className="h-2.5 w-2.5" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${cfg.color}`}>
                                                <cfg.icon className="h-3 w-3" />
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.memberships.slice(0, 2).map(m => (
                                                    <span key={m.id} className="text-xs bg-zinc-800 text-zinc-400 rounded px-1.5 py-0.5">
                                                        {m.tenant.name}
                                                    </span>
                                                ))}
                                                {user.memberships.length > 2 && (
                                                    <span className="text-xs text-zinc-600">+{user.memberships.length - 2}</span>
                                                )}
                                                {user.memberships.length === 0 && (
                                                    <span className="text-xs text-zinc-700">None</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 text-xs">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Ban / Unban */}
                                                {isBanned ? (
                                                    <form action={unbanUser.bind(null, user.id)}>
                                                        <button type="submit" className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1">
                                                            <CheckCircle className="h-3 w-3" /> Unban
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <form action={banUser.bind(null, user.id)}>
                                                        <button type="submit" className="rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1">
                                                            <Ban className="h-3 w-3" /> Ban
                                                        </button>
                                                    </form>
                                                )}

                                                {/* Promote to Super Admin */}
                                                {role !== 'SUPER_ADMIN' && (
                                                    <form action={promoteToSuperAdmin.bind(null, user.id)}>
                                                        <button type="submit" className="rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1">
                                                            <Crown className="h-3 w-3" /> Promote
                                                        </button>
                                                    </form>
                                                )}

                                                {/* Delete */}
                                                <form action={deleteUserAdmin.bind(null, user.id)}>
                                                    <button
                                                        type="submit"
                                                        className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors px-2.5 py-1.5 text-xs font-medium flex items-center gap-1"
                                                        onClick={(e) => { if (!confirm(`Delete ${user.email}? This is irreversible.`)) e.preventDefault(); }}
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

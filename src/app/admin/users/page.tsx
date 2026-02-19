import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import {
    Users, Shield, Ban, Crown, Trash2, CheckCircle, XCircle,
    AlertTriangle, UserCheck, Mail, Calendar, Activity
} from "lucide-react";
import { banUser, unbanUser, promoteToSuperAdmin, deleteUserAdmin } from "../actions";
import { UserTableClient } from "./user-table-client";

export const metadata: Metadata = { title: 'Users | Super Admin' };

async function getUsers() {
    return prisma.user.findMany({
        include: {
            memberships: {
                include: { tenant: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function UsersPage() {
    let users = [];
    try {
        const rawUsers = await getUsers();
        users = JSON.parse(JSON.stringify(rawUsers));
    } catch (error) {
        console.error("Users Fetch Error:", error);
    }
    const totalAdmins = users.filter((u: any) => u.globalRole === 'SUPER_ADMIN').length;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Identity Registry
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        {">>"} Oversight of {users.length} global platform entities
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="glass-morphism px-4 py-2 rounded-xl border-amber-500/20">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                            {totalAdmins} Super Admins
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Accounts", value: users.length, icon: Users, color: "text-indigo-400", border: "border-indigo-500/20" },
                    { label: "Privileged", value: totalAdmins, icon: Crown, color: "text-amber-400", border: "border-amber-500/20" },
                    { label: "Engagement", value: users.filter((u: any) => u.memberships.length > 0).length, icon: Activity, color: "text-cyan-400", border: "border-cyan-500/20" },
                    { label: "Nodes Connected", value: users.reduce((a: number, u: any) => a + u.memberships.length, 0), icon: Shield, color: "text-purple-400", border: "border-purple-500/20" },
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

            {/* User Registry - Client Side for Search/Actions */}
            <UserTableClient initialUsers={users} />
        </div>
    );
}

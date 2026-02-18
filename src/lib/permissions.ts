
import { prisma } from "@/lib/prisma";

export type FeatureKey = "custom_domain" | "sms_marketing" | "advanced_analytics" | "white_label" | "api_access" | "priority_support";

interface TenantContext {
    id: string;
    plan: {
        key: string;
        maxMembers: number;
        features: string; // JSON string
    } | null;
}

/**
 * Checks if a tenant has access to a specific feature.
 */
export function hasFeature(tenant: TenantContext, feature: FeatureKey): boolean {
    if (!tenant.plan) return false;
    try {
        const features = JSON.parse(tenant.plan.features) as string[];
        return features.includes(feature);
    } catch (e) {
        return false;
    }
}

/**
 * Checks if a tenant has reached their member limit.
 * Returns true if they CAN add more members.
 */
export async function canAddMember(tenantId: string): Promise<boolean> {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
            plan: true,
            _count: {
                select: { users: { where: { role: "MEMBER" } } }
            }
        }
    });

    if (!tenant || !tenant.plan) return false;

    // Unlimited if maxMembers is very high? 
    // Logic: current count < maxMembers
    return tenant._count.users < tenant.plan.maxMembers;
}

/**
 * Enterprise Guard: Centralized check
 */
export async function checkGate(tenantId: string, gate: "add_member" | FeatureKey): Promise<boolean> {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { plan: true }
    });

    if (!tenant) return false;

    if (gate === "add_member") {
        return canAddMember(tenantId);
    }

    return hasFeature(tenant, gate as FeatureKey);
}

import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/context";
import { cache } from "react";

/**
 * Resolves the Tenant ID for the current request.
 * 
 * Strategy:
 * 1. Checks `x-tenant-id` header (if passed by trusted upstream).
 * 2. Checks `x-tenant-subdomain` header.
 * 3. Queries DB to find Tenant by slug.
 * 4. Returns Tenant ID or null.
 * 
 * Uses React `cache` to dedupe requests within the same render cycle.
 */
export const getCurrentTenantId = cache(async (): Promise<string | null> => {
    const context = await getTenantContext();

    // 1. Direct ID (if available and trusted)
    if (context.tenantId) {
        return context.tenantId;
    }

    // 2. Subdomain lookup
    if (context.subdomain) {
        const tenant = await prisma.tenant.findUnique({
            where: { slug: context.subdomain },
            select: { id: true }
        });

        return tenant?.id || null;
    }

    return null;
});

/**
 * Helper that throws if no tenant is found.
 */
export async function requireVerifiedTenantId(): Promise<string> {
    const id = await getCurrentTenantId();
    if (!id) {
        throw new Error("Tenant Not Found: Unable to resolve tenant context.");
    }
    return id;
}

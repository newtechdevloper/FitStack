import { headers, cookies } from "next/headers";
import { auth } from "@/auth";

/**
 * Tenant Context Helper
 * Retrieves the current tenant context from the request headers injected by Middleware.
 * This is used in Server Components and Server Actions.
 */

// Define the shape of our Tenant Context
export interface TenantContext {
    subdomain: string | null;
    tenantId: string | null;
    isImpersonating: boolean;
}

export async function getTenantContext(): Promise<TenantContext> {
    const headerStore = await headers();
    const cookieStore = await cookies();
    const session = await auth();

    const subdomain = headerStore.get("x-tenant-subdomain");
    let tenantId = headerStore.get("x-tenant-id");

    // Impersonation Logic for Super Admins
    let isImpersonating = false;
    if (session?.user?.globalRole === 'SUPER_ADMIN') {
        const impersonatedId = cookieStore.get("impersonated_tenant_id")?.value;
        if (impersonatedId) {
            tenantId = impersonatedId;
            isImpersonating = true;
        }
    }

    return {
        subdomain: subdomain || null,
        tenantId: tenantId || null,
        isImpersonating
    };
}

/**
 * Helper to enforce tenant context. 
 * Throws if no tenant context is found (for multi-tenant routes).
 */
export async function requireTenantContext(): Promise<TenantContext> {
    const context = await getTenantContext();
    if (!context.subdomain && !context.tenantId) {
        throw new Error("Tenant Context Missing: Request must be routed via subdomain or have tenant ID.");
    }
    return context;
}

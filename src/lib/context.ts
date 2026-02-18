import { headers } from "next/headers";

/**
 * Tenant Context Helper
 * Retrieves the current tenant context from the request headers injected by Middleware.
 * This is used in Server Components and Server Actions.
 */

// Define the shape of our Tenant Context
export interface TenantContext {
    subdomain: string | null;
    tenantId: string | null;
}

export async function getTenantContext(): Promise<TenantContext> {
    const headerStore = await headers();
    const subdomain = headerStore.get("x-tenant-subdomain");
    // If we had an ID lookup in middleware, we'd get x-tenant-id here
    // For now, we rely on subdomain or explicit header
    const tenantId = headerStore.get("x-tenant-id");

    return {
        subdomain: subdomain || null,
        tenantId: tenantId || null,
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

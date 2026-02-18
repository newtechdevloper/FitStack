import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Get hostname (e.g., "goldgym.gymnexus.com" or "localhost:3000")
    const hostname = request.headers.get("host") || "";

    // Define main domain (env var or hardcoded)
    // In dev: localhost:3000. In prod: gymnexus.com
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gymnexus.com";

    // Check if we are on a subdomain
    const isSubdomain = hostname.includes(appDomain) && hostname !== appDomain && hostname !== `www.${appDomain}`;
    const subdomain = isSubdomain ? hostname.split(".")[0] : null;

    // Clone headers to pass data downstream
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);

    // If subdomain exists, set tenant context header
    if (subdomain) {
        requestHeaders.set("x-tenant-subdomain", subdomain);

        // Rewrite to a dynamic route for handling tenant public pages
        // e.g., goldgym.gymnexus.com -> /site/goldgym
        // Only if it's NOT a clear app route (like /api, /_next, etc)
        const url = request.nextUrl.clone();
        if (!url.pathname.startsWith("/api") && !url.pathname.startsWith("/_next") && !url.pathname.startsWith("/dashboard") && !url.pathname.startsWith("/admin") && !url.pathname.startsWith("/login")) {
            console.log(`Rewriting subdomain ${subdomain} to /site/${subdomain}`);
            url.pathname = `/site/${subdomain}${url.pathname}`;
            return NextResponse.rewrite(url, {
                request: { headers: requestHeaders },
            });
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};

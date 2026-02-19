import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Root domain — set NEXT_PUBLIC_ROOT_DOMAIN in Vercel dashboard.
    // e.g. "fitstack.com" for production, "localhost:3001" for local dev.
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3001";

    const isVercelPreview = hostname.endsWith(".vercel.app");
    const isRootDomain = hostname === rootDomain || hostname === `www.${rootDomain}`;
    const isSubdomain = !isRootDomain && !isVercelPreview && hostname.includes(".");

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.globalRole;

    const isOnAdmin = url.pathname.startsWith("/admin");
    const isOnDashboard = url.pathname.startsWith("/dashboard");
    const isOnPortal = url.pathname.startsWith("/portal");
    const isOnAuth = url.pathname.startsWith("/login") || url.pathname.startsWith("/register");

    // 1. Role-Based Redirection / Protection
    // 1.1 If on Auth page and logged in, redirect to respective dashboard
    if (isOnAuth && isLoggedIn) {
        if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
        if (role === "OWNER" || role === "ADMIN") return NextResponse.redirect(new URL("/dashboard", req.url));
        return NextResponse.redirect(new URL("/portal", req.url));
    }

    // 1.2 Protect Admin routes
    if (isOnAdmin) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
        if (role !== "SUPER_ADMIN") return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 1.3 Protect Dashboard routes
    if (isOnDashboard) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
        if (role === "MEMBER") return NextResponse.redirect(new URL("/portal", req.url));
    }

    // 1.4 Protect Portal routes
    if (isOnPortal) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
        if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Clone headers to pass tenant context downstream (Server Components / Actions)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.url);

    if (isSubdomain) {
        const subdomain = hostname.split(".")[0];

        // Set tenant context header for Server Components
        requestHeaders.set("x-tenant-subdomain", subdomain);

        // Rewrite to /site/[subdomain] for public gym pages
        if (
            !path.startsWith("/api") &&
            !path.startsWith("/_next") &&
            !path.startsWith("/dashboard") &&
            !path.startsWith("/admin") &&
            !path.startsWith("/login")
        ) {
            return NextResponse.rewrite(new URL(`/site/${subdomain}${path}`, req.url), {
                request: { headers: requestHeaders },
            });
        }
    }

    // Rate Limiting on auth/api routes
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (path.startsWith("/api") || path.startsWith("/login") || path.startsWith("/signup")) {
        try {
            const { rateLimit } = await import("@/lib/ratelimit");
            const { success } = await rateLimit(ip);
            if (!success) {
                return new NextResponse("Too Many Requests", { status: 429 });
            }
        } catch {
            // rateLimit not configured — skip silently
        }
    }

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};

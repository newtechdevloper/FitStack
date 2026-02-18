
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Define allowed domains (localhost and main domain)
    const allowedDomains = ["localhost:3000", "gymnexus.com"];
    // In production, you'd use env var for base domain

    // Check if we are on a subdomain
    const isSubdomain = !allowedDomains.some(d => hostname.includes(d) && (hostname.split('.').length === d.split('.').length));
    // Simple check: if hostname is "goldgym.localhost:3000", it has more parts? 
    // Better: Extract subdomain.

    // Let's assume basic logic: if hostname is NOT the main domain, it's a tenant.
    // For localhost, we might use "gym.localhost:3000".

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // Rewriting logic
    if (isSubdomain) {
        // Extract subdomain: gym.localhost:3000 -> gym
        // This is a naive split, production needs robust TLD handling
        const subdomain = hostname.split('.')[0];

        // Rewrite to the gym site path
        return NextResponse.rewrite(new URL(`/site/${subdomain}${path}`, req.url));
    }

    // Optional: Rewrite main domain home to specific path if needed, or keep as is.

    // Subdomain Logic
    // If we want to rewrite subdomains to /site/[slug] directory

    // const subdomain = hostname.split('.')[0]; 
    // Implementation detail: local testing uses gym.localhost vs localhost.

    // For now, return checks for auth.
    // We can add rewriting logic here later or in a separate file if complex.

    // If authorized callback returns false, NextAuth redirects. 
    // If true, we continue.

    // Rate Limiting Logic
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Auth & Public API Rate Limiting
    if (path.startsWith("/api") || path.startsWith("/login") || path.startsWith("/signup")) {
        const { rateLimit } = await import("@/lib/ratelimit"); // Dynamic import to avoid edge issues if any
        const { success } = await rateLimit(ip);
        if (!success) {
            return new NextResponse("Too Many Requests", { status: 429 });
        }
    }

    return NextResponse.next();
});

export const config = {
    // Matcher ignoring internal Next.js paths and static files, but INCLUDING /api
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};

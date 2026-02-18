
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Root domain from environment — set NEXT_PUBLIC_ROOT_DOMAIN in Vercel dashboard.
    // e.g. "FitStack.com" for production, "localhost:3000" for local dev.
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

    // A request is a subdomain request if the hostname is NOT the root domain
    // and NOT a Vercel preview URL (*.vercel.app).
    const isVercelPreview = hostname.endsWith(".vercel.app");
    const isRootDomain = hostname === rootDomain || hostname === `www.${rootDomain}`;
    const isSubdomain = !isRootDomain && !isVercelPreview && hostname.includes(".");

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

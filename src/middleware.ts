
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export default auth((req: NextRequest & { auth: any }) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.globalRole;

    const isOnAdmin = nextUrl.pathname.startsWith("/admin");
    const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
    const isOnPortal = nextUrl.pathname.startsWith("/portal");
    const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

    // 1. If on Auth page and logged in, redirect to respective dashboard
    if (isOnAuth && isLoggedIn) {
        if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin", nextUrl));
        if (role === "OWNER" || role === "ADMIN") return NextResponse.redirect(new URL("/dashboard", nextUrl));
        return NextResponse.redirect(new URL("/portal", nextUrl));
    }

    // 2. Protect Admin routes
    if (isOnAdmin) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
        if (role !== "SUPER_ADMIN") return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    // 3. Protect Dashboard routes
    if (isOnDashboard) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
        if (role === "MEMBER") return NextResponse.redirect(new URL("/portal", nextUrl));
    }

    // 4. Protect Portal routes
    if (isOnPortal) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
        if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

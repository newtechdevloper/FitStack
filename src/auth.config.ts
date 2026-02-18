
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        newUser: "/onboarding",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        jwt({ token, user, trigger, session }) {
            if (user && user.id) {
                token.id = user.id;
                token.globalRole = (user as any).globalRole;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                (session.user as any).globalRole = token.globalRole;
            }
            return session;
        }
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;

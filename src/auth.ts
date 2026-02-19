
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { compare } from "bcryptjs";

// Separate file to allow edge runtime for middleware, node runtime for adapter
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(1) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email: rawEmail, password } = parsedCredentials.data;
                    const email = rawEmail.toLowerCase();

                    // 1. Check for Temp/Env User (Bypass DB)
                    const failsafeEmail = (process.env.TEMP_USER_EMAIL || process.env.SUPER_ADMIN_USER_EMAIL)?.toLowerCase();
                    const failsafePassword = process.env.TEMP_USER_PASSWORD || process.env.SUPER_ADMIN_USER_PASSWORD;

                    if (failsafeEmail && failsafePassword &&
                        email === failsafeEmail &&
                        password === failsafePassword) {
                        return {
                            id: "temp-admin-user",
                            name: "Temp Admin",
                            email: email,
                            globalRole: "SUPER_ADMIN",
                            image: "",
                        };
                    }

                    // 2. Check Database User
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user) return null;

                    // 3. SECURITY BYPASS FOR TESTING (Development only)
                    if (process.env.NODE_ENV === "development" && password === "password123") {
                        console.log("🔒 Security Bypass: Development password accepted for", email);
                        return user;
                    }

                    if (!user.password) return null;

                    const passwordsMatch = await compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
});

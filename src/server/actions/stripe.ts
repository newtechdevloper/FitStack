
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createStripeConnectAccount() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // 1. Get Tenant for the current user (Owner)
    const tenantUser = await prisma.tenantUser.findFirst({
        where: {
            userId: session.user.id,
            role: "OWNER"
        },
        include: {
            tenant: true
        }
    });

    if (!tenantUser || !tenantUser.tenant) {
        throw new Error("No Gym found or insufficient permissions.");
    }

    const tenant = tenantUser.tenant;

    // 2. Check if account already exists
    if (tenant.stripeConnectId) {
        // Create a login link if already connected? 
        // Or create an account link to resume onboarding?
        // For now, let's assume we want to continue onboarding or login.
        // We'll generate a new Account Link just in case they haven't finished.

        try {
            const accountLink = await stripe.accountLinks.create({
                account: tenant.stripeConnectId,
                refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?connect=success`,
                type: 'account_onboarding',
            });
            return { url: accountLink.url };
        } catch (error) {
            console.error("Error creating link for existing account:", error);
            // Fallback to creating new if invalid? No, better error.
            throw new Error("Could not access existing Stripe account.");
        }
    }

    // 3. Create Stripe Express Account
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US', // Defaulting to US for this MVP
            email: session.user.email || undefined,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: 'company',
            metadata: {
                tenantId: tenant.id
            }
        });

        // 4. Save ID to database
        await prisma.tenant.update({
            where: { id: tenant.id },
            data: { stripeConnectId: account.id }
        });

        // 5. Create Account Link
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?connect=success`,
            type: 'account_onboarding',
        });

        return { url: accountLink.url };

    } catch (error) {
        console.error("Stripe Connect Error:", error);
        throw new Error("Failed to Initiate Stripe Connect");
    }
}

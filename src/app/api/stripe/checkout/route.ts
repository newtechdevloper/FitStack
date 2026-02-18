
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe, PLANS, METERED_ITEMS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// PLANS are now imported from @/lib/stripe

export async function GET(req: Request) {
    const session = await auth();

    if (!session?.user || !session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan") as keyof typeof PLANS;

    if (!plan || !PLANS[plan]) {
        return new NextResponse("Invalid plan", { status: 400 });
    }

    const tenantUser = await prisma.tenantUser.findFirst({
        where: {
            userId: session.user.id,
            role: "OWNER",
        },
        include: {
            tenant: true,
        },
    });

    if (!tenantUser) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    const tenant = tenantUser.tenant;

    try {
        const stripe = getStripe();
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: PLANS[plan],
                    quantity: 1,
                },
                // Add Metered Items (Quantity 0 or not set for metered? Usually just add the price)
                // For metered recurring, we add the price.
                // Note: Ensure these prices are set to "Recurring" + "Usage Based" in Stripe.
                { price: METERED_ITEMS.sms },
                { price: METERED_ITEMS.whatsapp },
            ],
            customer_email: session.user.email,
            success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/pricing?canceled=true`,
            metadata: {
                tenantId: tenant.id,
                userId: session.user.id,
                planId: plan,
            },
            subscription_data: {
                metadata: {
                    tenantId: tenant.id
                }
            }
        });

        if (!checkoutSession.url) {
            return new NextResponse("Failed to create checkout session", { status: 500 });
        }

        return NextResponse.redirect(checkoutSession.url);
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

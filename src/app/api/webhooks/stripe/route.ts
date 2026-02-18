
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // 1. Idempotency Check
    const existingEvent = await prisma.webhookEvent.findUnique({
        where: { id: event.id }
    });

    if (existingEvent && existingEvent.status === "completed") {
        return new NextResponse("Event already processed", { status: 200 });
    }

    // 2. Log Receipt
    const { SecurityLogger } = await import("@/lib/security-logger");
    SecurityLogger.info("STRIPE_WEBHOOK_RECEIVED", { resourceId: event.id, details: { type: event.type } });

    try {
        if (event.type === "checkout.session.completed") {
            const subscriptionId = session.subscription as string;
            const tenantId = session.metadata?.tenantId;

            if (!tenantId) {
                SecurityLogger.warn("STRIPE_WEBHOOK_FAILED", { resourceId: event.id, details: { error: "No tenantId" } });
                return new NextResponse("Webhook Error: No tenantId in metadata", { status: 400 });
            }

            // Retrieve the subscription details from Stripe
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
            const planKey = session.metadata?.planKey;

            // Find Plan
            const plan = planKey ? await prisma.plan.findUnique({ where: { key: planKey } }) : null;

            // Update Tenant & Create Subscription
            await prisma.tenant.update({
                where: { id: tenantId },
                data: {
                    stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
                    plan: plan ? { connect: { id: plan.id } } : undefined,
                    tenantSubscription: {
                        upsert: {
                            create: {
                                stripeSubscriptionId: subscription.id,
                                status: 'active',
                                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                                planId: plan ? plan.id : "missing_plan"
                            },
                            update: {
                                stripeSubscriptionId: subscription.id,
                                status: 'active',
                                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                                planId: plan ? plan.id : undefined
                            }
                        }
                    }
                },
            });
        }

        if (event.type === "invoice.payment_succeeded") {
            const subscriptionId = session.subscription as string;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

            await prisma.tenantSubscription.update({
                where: { stripeSubscriptionId: subscription.id },
                data: {
                    status: (subscription as any).status,
                    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                }
            });
        }

        if (event.type === "account.updated") {
            const account = event.data.object as Stripe.Account;
            const tenantId = account.metadata?.tenantId;
            if (tenantId && account.charges_enabled) {
                console.log(`Stripe Account ${account.id} for Tenant ${tenantId} is now enabled.`);
            }
        }

        // 3. Mark as Processed
        await prisma.webhookEvent.upsert({
            where: { id: event.id },
            update: { status: "completed" },
            create: {
                id: event.id,
                type: event.type,
                status: "completed"
            }
        });

        return new NextResponse(null, { status: 200 });

    } catch (error: any) {
        SecurityLogger.error("STRIPE_WEBHOOK_FAILED", { resourceId: event.id, error });
        return new NextResponse(`Webhook Handler Error: ${error.message}`, { status: 500 });
    }
}

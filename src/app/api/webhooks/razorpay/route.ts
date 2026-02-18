
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

// Verify Razorpay webhook signature using HMAC-SHA256
function verifyRazorpaySignature(body: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("x-razorpay-signature") ?? "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not set");
        return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    // 1. Verify signature
    if (!verifyRazorpaySignature(body, signature, webhookSecret)) {
        return new NextResponse("Invalid signature", { status: 400 });
    }

    let event: any;
    try {
        event = JSON.parse(body);
    } catch {
        return new NextResponse("Invalid JSON", { status: 400 });
    }

    const eventId = event.id ?? `${event.event}_${Date.now()}`;
    const eventType: string = event.event;

    // 2. Idempotency check
    const existingEvent = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
    if (existingEvent?.status === "completed") {
        return new NextResponse("Event already processed", { status: 200 });
    }

    // 3. Log receipt
    const { SecurityLogger } = await import("@/lib/security-logger");
    SecurityLogger.info("RAZORPAY_WEBHOOK_RECEIVED", { resourceId: eventId, details: { type: eventType } });

    try {
        // subscription.activated — fires when first payment succeeds
        if (eventType === "subscription.activated") {
            const sub = event.payload?.subscription?.entity;
            const tenantId = sub?.notes?.tenantId;
            const planKey = sub?.notes?.planKey;

            if (!tenantId) {
                return new NextResponse("No tenantId in notes", { status: 400 });
            }

            const plan = planKey ? await prisma.plan.findUnique({ where: { key: planKey } }) : null;

            await prisma.tenant.update({
                where: { id: tenantId },
                data: {
                    plan: plan ? { connect: { id: plan.id } } : undefined,
                    tenantSubscription: {
                        upsert: {
                            create: {
                                razorpaySubscriptionId: sub.id,
                                status: "active",
                                currentPeriodEnd: new Date(sub.current_end * 1000),
                                planId: plan?.id ?? "missing_plan",
                            } as any,
                            update: {
                                razorpaySubscriptionId: sub.id,
                                status: "active",
                                currentPeriodEnd: new Date(sub.current_end * 1000),
                                planId: plan?.id ?? undefined,
                            } as any,
                        },
                    },
                },
            });
        }

        // subscription.charged — fires on every renewal payment
        if (eventType === "subscription.charged") {
            const sub = event.payload?.subscription?.entity;
            if (sub?.id) {
                await prisma.tenantSubscription.update({
                    where: { razorpaySubscriptionId: sub.id } as any,
                    data: {
                        status: sub.status,
                        currentPeriodEnd: new Date(sub.current_end * 1000),
                    },
                });
            }
        }

        // subscription.cancelled
        if (eventType === "subscription.cancelled") {
            const sub = event.payload?.subscription?.entity;
            if (sub?.id) {
                await prisma.tenantSubscription.update({
                    where: { razorpaySubscriptionId: sub.id } as any,
                    data: { status: "cancelled" },
                });
            }
        }

        // subscription.halted — payment failed after retries
        if (eventType === "subscription.halted") {
            const sub = event.payload?.subscription?.entity;
            if (sub?.id) {
                await prisma.tenantSubscription.update({
                    where: { razorpaySubscriptionId: sub.id } as any,
                    data: { status: "past_due" },
                });
            }
        }

        // 4. Mark as processed
        await prisma.webhookEvent.upsert({
            where: { id: eventId },
            update: { status: "completed" },
            create: { id: eventId, type: eventType, status: "completed" },
        });

        return new NextResponse(null, { status: 200 });

    } catch (error: any) {
        SecurityLogger.error("RAZORPAY_WEBHOOK_FAILED", { resourceId: eventId, error });
        return new NextResponse(`Webhook Handler Error: ${error.message}`, { status: 500 });
    }
}

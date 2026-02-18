
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRazorpay, PLANS } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user || !session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { plan } = await req.json() as { plan: keyof typeof PLANS };

    if (!plan || !PLANS[plan]) {
        return new NextResponse("Invalid plan", { status: 400 });
    }

    const tenantUser = await prisma.tenantUser.findFirst({
        where: {
            userId: session.user.id,
            role: "OWNER",
        },
        include: { tenant: true },
    });

    if (!tenantUser) {
        return new NextResponse("No gym found", { status: 404 });
    }

    const tenant = tenantUser.tenant;

    try {
        const razorpay = getRazorpay();

        // Create or reuse Razorpay customer
        let customerId = (tenant as any).razorpayCustomerId as string | null;
        if (!customerId) {
            const customer = await (razorpay.customers.create as any)({
                name: tenant.name,
                email: session.user.email,
                contact: "",
                fail_existing: "0",
            });
            customerId = customer.id as string;
            await prisma.tenant.update({
                where: { id: tenant.id },
                data: { razorpayCustomerId: customerId } as any,
            });
        }

        // Create Razorpay Subscription
        const subscription = await (razorpay.subscriptions.create as any)({
            plan_id: PLANS[plan],
            customer_notify: 1,
            total_count: 12, // 12 billing cycles (1 year)
            quantity: 1,
            notes: {
                tenantId: tenant.id,
                userId: session.user.id,
                planKey: plan,
            },
        });

        return NextResponse.json({
            subscriptionId: subscription.id,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            customerName: tenant.name,
            customerEmail: session.user.email,
            planName: plan,
        });

    } catch (error: any) {
        console.error("[RAZORPAY_CHECKOUT]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}


"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Razorpay Route (marketplace payouts) requires a separate KYC/onboarding flow.
 * For now, this action saves the gym owner's bank account details to the DB.
 * Full Razorpay Route integration requires contacting Razorpay support for Route access.
 */
export async function saveRazorpayAccountDetails(bankAccountNumber: string, ifscCode: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const tenantUser = await prisma.tenantUser.findFirst({
        where: {
            userId: session.user.id,
            role: "OWNER"
        },
        include: { tenant: true }
    });

    if (!tenantUser?.tenant) {
        throw new Error("No Gym found or insufficient permissions.");
    }

    // Store a reference that the account has been configured
    // In production with Razorpay Route, you'd call their API here
    await prisma.tenant.update({
        where: { id: tenantUser.tenant.id },
        data: {
            razorpayAccountId: `${ifscCode}_${bankAccountNumber.slice(-4)}`, // masked reference
        }
    });

    return { success: true };
}

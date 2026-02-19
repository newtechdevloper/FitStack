
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
    let dbStatus = "Checking...";
    let errorDetail = null;

    try {
        // EXACT QUERY FROM ADMIN PAGE
        const tenants = await prisma.tenant.findMany({
            include: { tenantSubscription: { include: { plan: true } } }
        });

        dbStatus = `Success! Fetched ${tenants.length} tenants with subscriptions.`;
    } catch (e: any) {
        dbStatus = "Failed";
        errorDetail = {
            message: e.message,
            code: e.code,
            meta: e.meta
        };
    } finally {
        await prisma.$disconnect();
    }

    return NextResponse.json({
        dbStatus,
        errorDetail
    });
}

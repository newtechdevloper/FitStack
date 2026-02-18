
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSnapshot } from "@/lib/analytics";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    // 1. Auth Check (Verify Cron Secret)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Fetch all active tenants
        // In a large system, we would paginate or use a queue.
        const tenants = await prisma.tenant.findMany({
            select: { id: true }
        });

        console.log(`[Snapshot] Starting analytics generation for ${tenants.length} tenants.`);

        const results = [];
        for (const tenant of tenants) {
            try {
                await generateSnapshot(tenant.id);
                results.push({ tenantId: tenant.id, status: "success" });
            } catch (e: any) {
                console.error(`[Snapshot] Failed for ${tenant.id}:`, e);
                results.push({ tenantId: tenant.id, status: "failed", error: e.message });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });
    } catch (error: any) {
        console.error("Financial Snapshot Cron Failed:", error);
        return new NextResponse(`Snapshot Error: ${error.message}`, { status: 500 });
    }
}

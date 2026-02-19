
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugStats() {
    console.log("Starting deep diagnostic scan...");

    try {
        console.log("Phase 1: Promise.all cluster...");
        const [tenants, userCount, subscriptions, auditLogs] = await Promise.all([
            prisma.tenant.findMany({
                include: { tenantSubscription: { include: { plan: true } } }
            }),
            prisma.user.count(),
            prisma.tenantSubscription.findMany({
                include: { plan: true }
            }),
            prisma.auditLog.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
            })
        ]);
        console.log(`✅ Phase 1 Success. Tenants: ${tenants.length}, Users: ${userCount}, Subs: ${subscriptions.length}, Logs: ${auditLogs.length}`);
    } catch (e) {
        console.error("❌ Phase 1 FAILED:", e.message);
        console.error("Full Error:", e);
    }

    try {
        console.log("Phase 2: Recent Tenants query...");
        const recentTenants = await prisma.tenant.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: {
                tenantSubscription: true,
                plan: true,
                _count: { select: { users: true } }
            }
        });
        console.log(`✅ Phase 2 Success. Recent: ${recentTenants.length}`);
    } catch (e) {
        console.error("❌ Phase 2 FAILED:", e.message);
        console.error("Full Error:", e);
    }

    console.log("Diagnostic complete.");
    await prisma.$disconnect();
}

debugStats();

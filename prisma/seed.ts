
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const demoEmail = "demo@fitstack.com";
    const demoPassword = "password123";
    const hashedPassword = hashSync(demoPassword, 10);

    console.log(`🌱 Seeding demo user: ${demoEmail}`);

    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email: demoEmail },
        update: {
            globalRole: "SUPER_ADMIN",
            password: hashedPassword // Update password just in case
        },
        create: {
            email: demoEmail,
            name: "Demo Admin",
            password: hashedPassword,
            emailVerified: new Date(),
            globalRole: "SUPER_ADMIN",
        },
    });

    console.log(`✅ User created: ${user.id}`);

    // 2. Seed Plans
    const plans = [
        {
            key: "STARTER",
            name: "Starter Plan",
            description: "Perfect for small studios.",
            maxMembers: 50,
            platformFeePercent: 1.0,
            features: JSON.stringify(["basic_analytics", "email_support"])
        },
        {
            key: "GROWTH",
            name: "Growth Plan",
            description: "For scaling gyms.",
            maxMembers: 10000, // Unlimited effectively
            platformFeePercent: 1.0,
            features: JSON.stringify(["advanced_analytics", "sms_marketing", "custom_domain"])
        },
        {
            key: "PRO",
            name: "Pro Plan",
            description: "Enterprise grade.",
            maxMembers: 100000,
            platformFeePercent: 0.8,
            features: JSON.stringify(["white_label", "api_access", "priority_support"])
        }
    ];

    for (const p of plans) {
        await prisma.plan.upsert({
            where: { key: p.key },
            update: p,
            create: p
        });
    }
    console.log(`✅ Plans seeded`);

    const growthPlan = await prisma.plan.findUnique({ where: { key: "GROWTH" } });

    // 3. Create a Demo Tenant (Gym) with GROWTH plan
    const tenantSlug = "iron-gym";

    // Check if tenant exists
    const existingTenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });

    let tenant;
    if (existingTenant) {
        tenant = await prisma.tenant.update({
            where: { slug: tenantSlug },
            data: {
                // Ensure plan link
                plan: { connect: { id: growthPlan!.id } }
            }
        });
    } else {
        tenant = await prisma.tenant.create({
            data: {
                name: "Iron Gym",
                slug: tenantSlug,
                primaryColor: "#ef4444",
                plan: { connect: { id: growthPlan!.id } }
            },
        });
    }

    console.log(`✅ Tenant created/updated: ${tenant.name} (${tenant.slug})`);

    // 4. Create/Ensure Subscription
    await prisma.tenantSubscription.upsert({
        where: { tenantId: tenant.id },
        update: {
            planId: growthPlan!.id,
            status: 'active'
        },
        create: {
            tenantId: tenant.id,
            planId: growthPlan!.id,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(new Date().getFullYear() + 1, 0, 1) // 1 year from now
        }
    });
    console.log(`✅ Subscription linked: Growth Plan`);

    // 5. Link User to Tenant as Owner
    await prisma.tenantUser.upsert({
        where: {
            userId_tenantId: {
                userId: user.id,
                tenantId: tenant.id,
            },
        },
        update: {},
        create: {
            userId: user.id,
            tenantId: tenant.id,
            role: "OWNER",
        },
    });

    console.log(`✅ User linked to Tenant as OWNER`);

    // 6. Create Default Classes (Check if none exist)
    const classCount = await prisma.class.count({ where: { tenantId: tenant.id } });
    if (classCount === 0) {
        await prisma.class.createMany({
            data: [
                { tenantId: tenant.id, name: "Morning HIIT", duration: 45, capacity: 20 },
                { tenantId: tenant.id, name: "Power Yoga", duration: 60, capacity: 15 },
                { tenantId: tenant.id, name: "CrossFit Fundamentals", duration: 60, capacity: 12 },
            ],
        });
        console.log(`✅ Dummy classes created`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

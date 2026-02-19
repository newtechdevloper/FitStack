
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function test() {
    console.log("Testing with DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^@]*@/, ":****@"));
    try {
        const tenants = await prisma.tenant.findMany();
        console.log("✅ Success! Tenants found:", tenants.length);
    } catch (e) {
        console.error("❌ Failed!");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

test();

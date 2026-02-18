
import { PrismaClient } from '@prisma/client';

// NOTE: DATABASE_URL should be a connection-pooled URL (Supabase/Neon pooler).
// Add DIRECT_URL (non-pooled) to schema.prisma for migrations.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

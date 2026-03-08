import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// ✅ FIXED: Using DB_URL for Vercel compatibility
export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasourceUrl: process.env.DB_URL || process.env.DATABASE_URL
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
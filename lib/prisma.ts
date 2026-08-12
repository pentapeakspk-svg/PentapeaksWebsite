import { PrismaClient } from '@prisma/client'

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL
  return databaseUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Always reuse the global singleton - avoids a new DB connection cold-start on every hot-reload
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  })

// Persist across hot-reloads in development so the connection is reused
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

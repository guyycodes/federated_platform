import { PrismaClient } from '../generated/prisma'

const globalForPrisma = globalThis

// Create a single instance of Prisma Client and reuse it
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Ensure the connection is established
if (process.env.NODE_ENV === 'production') {
  prisma.$connect().catch((e) => {
    console.error('Failed to connect to database:', e)
  })
}

export default prisma
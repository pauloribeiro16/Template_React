import { PrismaClient } from "@prisma/client"
import { env } from "../config/env.js"

// Uma instância por processo. O `globalThis` evita abrir um pool novo a cada
// hot-reload do `tsx watch`.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  })

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

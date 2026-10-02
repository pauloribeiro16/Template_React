import type { Request, Response } from "express"
import { env } from "../config/env.js"
import { prisma } from "../lib/prisma.js"

// Sonda de saúde: usada por deploys e pelo próprio frontend para confirmar que
// a API e a base de dados estão de pé.
export async function health(_req: Request, res: Response) {
  let database: "up" | "down" = "down"

  try {
    await prisma.$queryRaw`SELECT 1`
    database = "up"
  } catch {
    database = "down"
  }

  res.status(database === "up" ? 200 : 503).json({
    status: database === "up" ? "ok" : "degraded",
    database,
    env: env.NODE_ENV,
  })
}

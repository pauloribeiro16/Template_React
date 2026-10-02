import { createApp } from "./app.js"
import { env } from "./config/env.js"
import logger from "./lib/logger.js"
import { prisma } from "./lib/prisma.js"

const app = createApp()

const server = app.listen(env.PORT, () => {
  logger.info(`API a ouvir em http://localhost:${env.PORT}`)
})

// Fechar a pool do Prisma ao parar o processo, senão o processo não termina.
async function shutdown(signal: string) {
  logger.info(`${signal} recebido, a encerrar…`)
  server.close()
  await prisma.$disconnect()
  process.exit(0)
}

process.on("SIGINT", () => void shutdown("SIGINT"))
process.on("SIGTERM", () => void shutdown("SIGTERM"))

import cors from "cors"
import express from "express"
import { env } from "./config/env.js"
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js"
import { apiRouter } from "./routes/index.js"

// Separado do `server.ts` para que os testes possam importar a app sem abrir
// uma porta.
export function createApp() {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN }))
  app.use(express.json())

  app.use("/api", apiRouter)

  // A ordem importa: o 404 apanha o que sobrou, o error handler apanha
  // tudo o que foi lançado a seguir.
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

import { Router } from "express"
import { health } from "../controllers/health.js"
import { usersRouter } from "./users.js"

export const apiRouter = Router()

apiRouter.get("/health", health)
apiRouter.use("/users", usersRouter)

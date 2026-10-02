import { Router } from "express"
import * as usersController from "../controllers/users.js"
import { validate } from "../middleware/validate.js"
import { createUserSchema } from "../schemas/users.js"

// As rotas ficam finas: método + caminho + validação. Nada mais.
export const usersRouter = Router()

usersRouter.get("/", usersController.listUsers)
usersRouter.post("/", validate(createUserSchema), usersController.createUser)
usersRouter.get("/:id", usersController.getUserById)

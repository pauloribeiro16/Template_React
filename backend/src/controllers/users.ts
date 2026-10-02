import { Prisma } from "@prisma/client"
import type { NextFunction, Request, Response } from "express"
import { userIdSchema, type CreateUserInput } from "../schemas/users.js"
import * as userService from "../services/users.js"

// Os controllers são finos: traduzem HTTP <-> serviço. Sem regras de negócio
// aqui — essas vivem em `services/`.
export async function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await userService.listUsers()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = userIdSchema.safeParse(req.params.id)
    if (!parsed.success) {
      res.status(400).json({ message: "Id inválido" })
      return
    }

    const user = await userService.getUserById(parsed.data)
    if (!user) {
      res.status(404).json({ message: "Utilizador não encontrado" })
      return
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // O corpo já foi validado e tipado pelo middleware `validate`.
    const input = req.body as CreateUserInput
    const user = await userService.createUser(input)
    res.status(201).json(user)
  } catch (error) {
    // P2002 = violação de `@unique`; traduzir para 409 é mais útil que um 500.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ message: "Já existe um utilizador com esse email" })
      return
    }
    next(error)
  }
}

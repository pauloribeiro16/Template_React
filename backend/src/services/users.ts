import type { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import type { CreateUserInput } from "../schemas/users.js"

// `select` explícito em todas as queries: devolve exactamente o que a rota
// precisa e evita vazar colunas sensíveis quando o modelo cresce.
const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: userSelect,
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: userSelect })
}

export async function createUser(input: CreateUserInput) {
  return prisma.user.create({ data: input, select: userSelect })
}

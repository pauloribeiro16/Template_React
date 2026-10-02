import { z } from "zod"

// Os schemas Zod vivem na fronteira HTTP: o que entra é validado antes de
// tocar em qualquer regra de negócio.
export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(1, "Nome é obrigatório").max(120),
})

export const userIdSchema = z.string().uuid("Id inválido")

export type CreateUserInput = z.infer<typeof createUserSchema>

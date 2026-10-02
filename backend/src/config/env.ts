// O `dotenv/config` tem de ser o PRIMEIRO import: as restantes importações são
// içadas para o topo do módulo e o schema é avaliado antes de `.env` existir.
import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatório"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // Falhar aqui é melhor do que arrancar com configuração a meio.
  console.error(
    "Variáveis de ambiente inválidas:",
    parsed.error.flatten().fieldErrors,
  )
  throw new Error("Configuração de ambiente inválida — ver .env.example")
}

export const env = parsed.data
export type Env = z.infer<typeof envSchema>

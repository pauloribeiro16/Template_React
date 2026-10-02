import logger from "@/helpers/logger"
import { z } from "zod"

const envSchema = z.object({
  DEV: z.boolean(),
  VITE_BASE_URL: z.string(),
})

const env = envSchema.safeParse(import.meta.env)

if (!env.success) {
  logger.error("Invalid environment variables:", env.error.format())
  throw new Error()
}

export const envConfig = env.data
export type EnvConfig = z.infer<typeof envSchema>

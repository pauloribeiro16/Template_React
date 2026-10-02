import "dotenv/config"
import path from "node:path"
import { defineConfig } from "prisma/config"

// Substitui a chave `prisma` do package.json, que a Prisma 7 remove. O
// `dotenv/config` é importado primeiro porque o CLI já não carrega o `.env`
// sozinho quando existe um ficheiro de configuração.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
})

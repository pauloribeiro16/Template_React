import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Idempotente: pode correr várias vezes sem duplicar registos.
const users = [
  { email: "ana.silva@exemplo.pt", name: "Ana Silva" },
  { email: "bruno.costa@exemplo.pt", name: "Bruno Costa" },
  { email: "carla.dias@exemplo.pt", name: "Carla Dias" },
]

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: user,
    })
  }
  console.log(`Seed concluído — ${users.length} utilizadores garantidos.`)
}

main()
  .catch((error) => {
    console.error("Seed falhou:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

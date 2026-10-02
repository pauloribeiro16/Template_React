import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCreateUser, useFetchUsers } from "@/services"
import { useState } from "react"

// Página de exemplo: mostra o caminho completo frontend → API → Prisma → Postgres.
// Os dados vêm sempre de hooks de `@/services` — nunca fetch directo nem
// dados de servidor em useState.
export default function HomePage() {
  const { isPending, error, data } = useFetchUsers()
  const { mutate, isPending: isCreating } = useCreateUser()
  const [name, setName] = useState("")

  const handleCreate = () => {
    if (!name.trim()) return
    mutate({ name, email: `${name.split(" ")[0].toLowerCase()}@exemplo.pt` })
    setName("")
  }

  if (isPending) return <div>A carregar…</div>

  if (error)
    return <div className="p-8">Ocorreu um erro ao carregar os utilizadores.</div>

  return (
    <div className="flex flex-col gap-8 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Utilizadores</CardTitle>
          <CardDescription>
            Exemplo end-to-end: TanStack Query → Express → Prisma → Postgres
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do utilizador"
            />
            <Button onClick={handleCreate} disabled={isCreating}>
              Criar
            </Button>
          </div>
          <ul className="flex flex-col gap-2">
            {data.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Ainda não há utilizadores. Corre <code>pnpm db:seed</code> no
                backend ou cria o primeiro acima.
              </li>
            )}
            {data.map((user) => (
              <li key={user.id} className="text-sm">
                <span className="font-medium">{user.name}</span>{" "}
                <span className="text-muted-foreground">{user.email}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

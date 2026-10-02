# react-template

Template de projeto full-stack: **React 19 + TypeScript** no frontend,
**Express + Prisma + Postgres** no backend, num só repositório pnpm workspace.

Vem com a hierarquia de `AGENTS.md` já escrita, nove skills vendorizadas em
`.zcode/skills/`, e um exemplo end-to-end (TanStack Query → Express → Prisma →
Postgres) que podes apagar e substituir pela tua aplicação.

## Requisitos

| | |
|---|---|
| Node | 24.x |
| pnpm | 12.x |
| Postgres | 15 ou superior, a correr localmente |

> Se `pnpm` não for encontrado depois de o instalares, a shell tem o PATH antigo —
> reabre o terminal. O binário fica em `%LOCALAPPDATA%\pnpm\bin`.

## Arrancar

```bash
# 1. dependências (um lockfile para os dois pacotes)
pnpm install

# 2. configuração — só os .env.example são versionados
cp frontend/.env.example frontend/.env
cp backend/.env.example  backend/.env
#    ajusta DATABASE_URL no backend/.env com as tuas credenciais de Postgres

# 3. base de dados
pnpm db:generate
pnpm db:migrate        # cria e aplica a migration inicial
pnpm db:seed           # três utilizadores de exemplo (opcional)

# 4. subir tudo (frontend :5173 + backend :3000)
pnpm dev
```

Abre <http://localhost:5173>. A página inicial lista utilizadores vindos da
base de dados — se aparecerem, o caminho inteiro está a funcionar.

## Comandos

Todos correm na raiz e delegam no pacote certo.

| Comando | O que faz |
|---|---|
| `pnpm dev` | Sobe frontend e backend em paralelo |
| `pnpm dev:frontend` / `pnpm dev:backend` | Sobe só um deles |
| `pnpm lint` · `pnpm typecheck` · `pnpm test` | Validação completa |
| `pnpm build` | Build de produção dos dois pacotes |
| `pnpm format` | Prettier |
| `pnpm db:migrate` · `db:seed` · `db:studio` · `db:generate` | Prisma |

Para validar um ficheiro ou pacote em vez da suite toda, o padrão é
`pnpm --filter @react-template/frontend <script>` (ou `backend`).

## Estrutura

```
.
├── AGENTS.md            # regras do repositório — lê este primeiro
├── frontend/            # SPA React 19 + TS + Tailwind v4 + shadcn/ui
├── backend/             # API Express 5 + Zod + Prisma + Postgres
├── docs/                # estrutura e decisões
├── tmp/                 # scratch, gitignored
└── .zcode/skills/       # skills vendorizadas (versionadas)
```

As convenções de cada pacote estão no seu próprio `AGENTS.md` — o da raiz
resolve o resto. Detalhes em [docs/estrutura.md](docs/estrutura.md) e o
raciocínio por trás das escolhas em [docs/decisoes.md](docs/decisoes.md).

## Stack

**Frontend** — React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS v4 · shadcn/ui ·
TanStack Query 5 · react-router 7 · ky · zod · Vitest

**Backend** — Node 24 (ESM) · Express 5 · Prisma 6 · Postgres · Zod · tsx

## Notas

- O frontend chama a API por `/api`, um caminho relativo. Em dev o Vite faz
  proxy para `localhost:3000`, por isso não há CORS a configurar no browser.
- O formato de erro (`{ message, path, statusCode }`) é o contrato entre
  `backend/src/middleware/error-handler.ts` e o interceptor em
  `frontend/src/services/api.ts`. Mudar um lado obriga a mudar o outro.
- A pasta `tmp/` é para trabalho descartável. Nada de lá é um resultado a
  entregar.

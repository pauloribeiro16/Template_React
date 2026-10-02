# AGENTS.md — backend

Regras do repositório: [../AGENTS.md](../AGENTS.md). Escopo: a API HTTP, as
regras de negócio e o acesso ao Postgres via Prisma. **Nada de UI aqui.**

## Stack

Node 24 (ESM) · TypeScript 5.8 (strict, `NodeNext`) · Express 5 · Prisma 6 ·
Postgres · Zod · tsx (dev) · tsc (build).

## Comandos

Correm da raiz (`pnpm --filter @react-template/backend <script>`) ou de dentro de
`backend/`.

```bash
pnpm dev           # tsx watch em http://localhost:3000
pnpm lint          # ESLint flat
pnpm typecheck     # tsc --noEmit
pnpm build         # tsc -p tsconfig.build.json
pnpm db:generate   # regenerar o Prisma Client
pnpm db:migrate    # criar/aplicar migration em dev
pnpm db:seed       # dados de exemplo
pnpm db:studio     # Prisma Studio
```

Depois de mexer em `prisma/schema.prisma`, `pnpm db:generate` antes de
typechecar — os tipos do cliente são gerados.

## Ambiente

- `.env` (gitignored) obrigatório: `NODE_ENV`, `PORT`, `DATABASE_URL`,
  `CORS_ORIGIN`. Ver `.env.example`.
- **Nunca ler `process.env` fora de `src/config/env.ts`.** O schema Zod valida
  no arranque e falha logo se faltar algo.
- O `dotenv/config` tem de ser o **primeiro import** de `config/env.ts`: os
  restantes imports são içados e o schema é avaliado antes de o `.env` existir.

## Estrutura — onde colocar as coisas

```
src/
├── server.ts        # ponto de entrada: listen + shutdown
├── app.ts           # createApp() — sem listen, para os testes importarem
├── config/env.ts    # schema Zod das variáveis de ambiente
├── lib/             # prisma.ts (cliente singleton), logger.ts
├── routes/          # método + caminho + validação. Nada mais.
├── controllers/     # traduzem HTTP <-> serviço. Sem regras de negócio.
├── services/        # regras de negócio + ÚNICO sítio com queries Prisma
├── schemas/         # schemas Zod das fronteiras
└── middleware/      # validate.ts, error-handler.ts
```

A ordem de uma resposta é sempre: **route → middleware → controller → service
→ Prisma**.

## Regras

- **Todas as queries Prisma vivem em `src/services/`.** Um controller nunca
  importa o `prisma` directamente — é isso que mantém a camada HTTP testável.
- **`select` explícito em todas as queries**, mesmo quando devolves o modelo
  inteiro. O `userSelect` partilhado em `services/users.ts` é o padrão.
- **Nunca devolver campos sensíveis** (password, tokens). Se aparecerem no
  modelo, o `select` é a primeira defesa.
- **Validação Zod nas fronteiras.** O `middleware/validate.ts` valida
  `req.body` e substitui-o pelo objecto tipado; params são validados no
  controller com `safeParse`.
- Erros de domínio traduzidos para HTTP na camada do controller: violação de
  `@unique` (Prisma `P2002`) → `409`, não `500`.
- O `errorHandler` define o formato `{ message, path, statusCode }`. É o
  contrato com o interceptor em `frontend/src/services/api.ts` — mudar um
  lado obriga a mudar o outro.
- **Nunca vazar stack traces em produção.** O `errorHandler` só faz log do
  erro quando `NODE_ENV === "development"`.
- **Imports relativos com extensão `.js`** (`./lib/prisma.js`). É ESM com
  `NodeNext` e é o que faz o `tsc` gerar um `dist/` que corre sem configure
  nada. (O frontend usa alias `@/` porque o Vite resolve; aqui não há
  resolver de runtime — ver [../docs/decisoes.md](../docs/decisoes.md).)

## Migrações

- `prisma/schema.prisma` é a fonte de verdade do modelo de dados.
- Mudança de schema em dev: `pnpm db:migrate` — cria uma migration em
  `prisma/migrations/` com nome descritivo. **Versiona a migration.**
- **Nunca `prisma db push`** — descarta a semântica e não deixa histórico.
- Em produção/CI: `pnpm db:deploy` (aplica o que está versionado). Nunca criar
  migrations fora de dev.
- O seed vive em `prisma/seed.ts`, é **idempotente** (upsert) e corre com
  `pnpm db:seed`.

## Frontend ↔ Backend

- O frontend chama a API por `/api`, relativo, através do proxy do Vite em dev.
- Prefixos de rota: `/api/health`, `/api/users`. Rotas novas entram em
  `routes/index.ts`.
- `GET /api/health` responde `503` se a base de dados não responder — é o
  ponto que o teu orquestrador de deploys deve usar para decidir se o serviço
  está vivo.

## Boundaries

- **Always:** queries Prisma dentro de `services/`; `select` explícito; validar
  input com Zod antes de tocar em serviço; fechar o Prisma no shutdown;
  actualizar este ficheiro quando a estrutura ou a API mudarem.
- **Ask first:** dependência nova; biblioteca de estado ou de auth; alterar os
  defaults do `errorHandler`; mexer no `prisma.config.ts`; mudar a forma do
  erro sem avisar o frontend.
- **Never:** `prisma` fora de `services/`; `db push`; secrets no `.env.example`
  ou no git; stack traces em produção; `any` em código de aplicação; criar
  modelos sem `@@map` quando a tabela não segue a convenção do Prisma.

---
*Última atualização: 2026-10-02.*

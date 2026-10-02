# AGENTS.md — react-template

Hub do repositório. Começa aqui e desce pela hierarquia conforme a pasta em
que trabalhas — o ficheiro `AGENTS.md` mais próximo do que estás a editar tem
prioridade (*nearest wins*).

**Regra de ouro:** cada pacote vive inteiro na sua pasta. A raiz do repositório
não recebe ficheiros de pacote (código, configs, docs de um pacote). Um `.env`
tem de estar ao lado do pacote que o lê.

## Mapa do repositório

| Pasta | Pacote | Regras em |
|---|---|---|
| `frontend/` | SPA React 19 + TS + Tailwind v4 + shadcn/ui | [frontend/AGENTS.md](frontend/AGENTS.md) |
| `backend/` | API Express + Prisma + Postgres | [backend/AGENTS.md](backend/AGENTS.md) |

## Práticas globais

- **pnpm apenas — nunca npm nem yarn.** Node 24, pnpm 12. `pnpm install` na
  raiz resolve os dois pacotes com um lockfile só.
- **Texto visível da UI e mensagens da API: português.** Identificadores de
  código, nomes de ficheiro e nomes de commit: inglês.
- Validar as alterações antes de terminar com os comandos abaixo.

## Git

- **Remote previsto:** GitHub privado
  `https://github.com/pauloribeiro16/react-template.git` — por **HTTPS**, porque
  o acesso por SSH está bloqueado neste ambiente. O repositório ainda não foi
  criado no GitHub; quando for, liga-se com
  `git remote add origin https://github.com/pauloribeiro16/react-template.git`.
  A autenticação é feita pelo Git Credential Manager, sem segredos no remote.
- Branch `main`, mais `feat/<área>` para trabalho em curso.
- **Conventional Commits** em linha única, minúsculos: `feat:`, `fix:`,
  `chore:`, `docs:`, `refactor:` (ex.: `feat(auth): adicionar login com token`).
- **Commit e push só a pedido explícito do utilizador.** Nunca fazer `git push`
  por iniciativa própria.
- **Nunca commitar:** `.env`, segredos, `node_modules/`, `dist/`. O `.env.example`
  é a única coisa de ambiente que se versiona.
- Ficheiros de scratch → `<repo>/tmp/`, que é gitignored.

## Comandos

Todos os comandos correm **na raiz** do repositório, sobre o workspace pnpm.

| Acção | Ficheiro / pacote | Suite completa |
|---|---|---|
| Instalar | `pnpm install` | `pnpm install` |
| Subir tudo | `pnpm dev` | — |
| Subir um pacote | `pnpm dev:frontend` · `pnpm dev:backend` | — |
| Lint | `pnpm --filter <pkg> lint` | `pnpm lint` |
| Tipos | `pnpm --filter <pkg> typecheck` | `pnpm typecheck` |
| Testes | `pnpm --filter @react-template/frontend test` | `pnpm test` |
| Build | `pnpm --filter <pkg> build` | `pnpm build` |
| Formatar | `pnpm --filter <pkg> format` | `pnpm -r format` |
| Base de dados | `pnpm db:migrate` · `pnpm db:seed` · `pnpm db:studio` | — |

`<pkg>` é `@react-template/frontend` ou `@react-template/backend`.

**Toolchain:** Vite 6 · TypeScript 5.8 (strict) · ESLint flat + Prettier ·
Tailwind CSS v4 · Express 5 · Prisma 6 · Postgres · Vitest (só no frontend).
Decisões e o porquê em [docs/decisoes.md](docs/decisoes.md).

## Testes

- **Vitest, só no frontend.** Testes colocados ao lado do ficheiro testado
  (`foo.test.tsx`). O backend ainda não tem framework — para introduzires um,
  pergunta primeiro.
- **Nunca afirmar sucesso sem ter corrido o comando.** `pnpm test` e
  `pnpm lint` têm de passar antes de dares um trabalho por concluído.
- Para testar a app no browser (fluxos, screenshots, consola), activa a skill
  `webapp-testing`. Scripts de teste descartáveis vão para `tmp/`, nunca para
  `tests/`.

## Ambiente

- `frontend/.env` e `backend/.env` são obrigatórios para arrancar. Copia-os dos
 respectivos `.env.example` — nunca inventes o conteúdo de um `.env`.
- **Nunca ler `process.env` ou `import.meta.env` fora do `config/env.ts` do
  pacote.** Ambos os pacotes validam o ambiente com Zod no arranque.
- A base de dados é Postgres local. A `DATABASE_URL` leva credenciais reais:
  nunca a entres num `.env.example`, num commit ou numa mensagem.

## Hierarquia AGENTS.md (lê o mais próximo do que vais editar)

1. `AGENTS.md` (este) — regras do repositório
2. [frontend/AGENTS.md](frontend/AGENTS.md) — stack, estrutura e convenções da SPA
3. [backend/AGENTS.md](backend/AGENTS.md) — rotas, Prisma e regras da API

**Quando um `src/` tiver domínios com regras próprias** (à medida que o
frontend cresce, `frontend/src/pages/` e `frontend/src/services/` são os
candidatos naturais), cria aí um `AGENTS.md` com: uma linha de navegação para o
pai, o âmbito ("o que se faz aqui e o que não"), as regras, um exemplo canónico
e os Boundaries. Mantém cada ficheiro abaixo de 150 linhas.

## Skills (activa com a tool `skill` quando a tarefa corresponder)

Vendorizadas em `.zcode/skills/` e **versionadas** — o repo tem de ser
autocontido para colegas e outras máquinas. A cópia em `~/.zcode/skills/` tem
precedência quando o nome colide.

**Activa por iniciativa própria**, sem esperar por pedido: `frontend-design` ao
criar ou redesenhar UI, `feature-dev` ao desenvolver uma feature de ponta a
ponta, `webapp-testing`/`web-debug` ao testar no browser, `agents-md-writer` ao
mexer nestes ficheiros.

| Skill | Quando usar |
|---|---|
| `frontend-design` | Criar/redesenhar UI com qualidade (páginas, dashboards, componentes) |
| `webapp-testing` | Testar a app no browser com Playwright (fluxos, screenshots, logs) |
| `web-debug` | Algo partido no browser: erro a carregar, JS não arranca, layout, cliques mortos |
| `feature-dev` | Desenvolver uma feature de princípio a fim (workflow de 7 fases) |
| `codebase-architecture` | Refactorizações reais (limites de módulos, dívida técnica) |
| `react-naming` | Nomear componentes/hooks/handlers ou decidir o que vai em `src/` |
| `commit-workflow` | Commits, branches, mensagens Conventional Commits |
| `security-hooks` | Instalar gitleaks + detect-secrets para proteger segredos |
| `agents-md-writer` | Criar ou actualizar estes AGENTS.md |

## Boundaries

- **Always:** ler o `AGENTS.md` mais próximo antes de editar; `pnpm lint` e
  `pnpm test` antes de terminar; actualizar o `AGENTS.md` afectado quando a
  estrutura, os comandos ou as skills mudarem; scratch em `tmp/`.
- **Ask first:** dependências novas (procurar primeiro no catálogo do shadcn/ui);
  novas pastas de topo em `src/`; mudar configs de tooling (tsconfig, eslint,
  vite, prisma); introduzir um framework de testes no backend; commits e pushes.
- **Never:** npm ou yarn; commitar `.env` ou segredos; ler `import.meta.env`
  fora de `config/env.ts`; meter segredos no remote do git; ficheiros de
  pacote na raiz do repo; editar `frontend/src/components/ui/` à mão.

---
*Última atualização: 2026-10-02 — manter este ficheiro quando o mapa do repo,
os comandos ou as skills mudarem.*

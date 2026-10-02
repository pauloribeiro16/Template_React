# Estrutura

Como o repositório está organizado e porque.

## Monorepo, dois pacotes

`frontend/` e `backend/` vivem no mesmo repositório porque nesta equipa
frontend e API evoluem juntos: mudar o formato de um payload é uma alteração
única, num commit, com typecheck dos dois lados. O custo é a disciplina — a
regra de ouro é que **cada pacote vive inteiro na sua pasta** e a raiz só tem
o que é partilhado (config do workspace, docs, skills).

O workspace pnpm dá um lockfile só. Com dois lockfiles, o frontend e o backend
podem acabar com versões transitivas diferentes das mesmas bibliotecas — a
clássica divergência que só aparece em produção.

## Fluxo de um pedido

```
Componente (pages/)
  └─ hook de services/          TanStack Query
       └─ instância `api` (ky)  /api/... — relativo
            └─ [dev] proxy do Vite  →  localhost:3000
                 └─ route  ─ validate (Zod) ─ controller ─ service ─ Prisma ─ Postgres
```

Cada camada só conhece a de baixo:

| Camada | Sabe de | Não sabe de |
|---|---|---|
| `pages/` | hooks de `@/services` | HTTP, Prisma |
| `services/` | `api`, tipos | componentes, rotas |
| `routes/` | controllers, schemas | Prisma |
| `controllers/` | services, schemas | Prisma, detalhes de HTTP |
| `services/` (backend) | Prisma | Express, HTTP |
| `schemas/` | — | tudo o resto |

O `userSelect` partilhado em `backend/src/services/users.ts` é o motivo de as
queries viverem todas em `services/`: um `select` explícito é a primeira
defesa contra vazar uma coluna sensível quando o modelo cresce.

## Onde cada coisa vai

**Frontend** — decisão rápida, na mesma linha que a estrutura:

- ecrã de rota → `pages/`
- shell à volta das rotas → `containers/`
- componente reutilizável → `components/`
- HTTP / estado de servidor → `services/`
- estado de UI → hook ou contexto junto de quem o consome

**Backend** — a ordem é sempre `route → middleware → controller → service →
Prisma`. Se uma rota faz mais do que método + caminho + validação, está mal
dividida.

## As fronteiras de `AGENTS.md`

Três ficheiros, resolúveis por *nearest wins*:

1. `AGENTS.md` — o repositório
2. `frontend/AGENTS.md` — a SPA
3. `backend/AGENTS.md` — a API

Nenhum deles passa de ~150 linhas: acima disso o agente deixa de ler e as
regras perdem efeito. Quando um `src/` tiver domínios com regras próprias, o
ficheiro nasce nessa pasta com uma linha de navegação, o âmbito (o que se faz
ali e o que não), as regras, um exemplo canónico e os Boundaries. A receita
está no `AGENTS.md` da raiz.

## `tmp/`

Trabalho descartável: spikes, scripts de teste ad-hoc, screenshots, logs.
Gitignored, limpo no fim, e nunca um resultado a entregar. Quatro skills
repetem esta regra porque é uma regra da casa, não de um ficheiro.

## `.zcode/skills/`

Versionadas, ao contrário do repo de onde este template veio — lá eram config
local, aqui são parte do produto. Sem elas o repo deixa de funcionar para
colegas noutra máquina. As skills de utilizador em `~/.zcode/skills/` têm
precedência quando o nome colide.

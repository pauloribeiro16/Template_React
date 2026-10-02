# Decisões

O que foi decidido, e porquê. Quando uma decisão mudar, muda aqui — é a entrada
que o próximo vai procurar antes de mexer em tudo.

Data de todas as decisões abaixo: **2026-10-02**.

## Ferramentas

| Decisão | Alternativa rejeitada | Porquê |
|---|---|---|
| **pnpm + workspaces** | npm, dois lockfiles | Um lockfile só evita divergência de versões transitivas. Workspaces dão `pnpm install` e `pnpm dev` únicos. |
| **Vite 6** | Parcel, Create React App | CRA está em modo de manutenção. Vite é o que o ecossistema React usa. |
| **ESLint flat + Prettier** | ESLint só | O Prettier trata de estilo e o `eslint-config-prettier` desliga as regras de formatação do ESLint, para os dois não brigarem. |
| **Node 24, pnpm 12** | Node 22, pnpm 9 | O que está instalado nesta máquina. `engines` no `package.json` fixa o mínimo. |

## Frontend

| Decisão | Alternativa rejeitada | Porquê |
|---|---|---|
| **Tailwind v4 CSS-first** | CSS Modules | O shadcn/ui **exige** Tailwind. E a referência de onde veio este template usava CSS Modules com Create React App — o shadcn não cabia lá. Tokens em `src/styles/index.css`, sem `tailwind.config.js`. |
| **shadcn/ui como base** | Escrever tudo à mão | Componentes prontos, acessíveis (Radix), e a propriedade de os termos no código em vez de depender de um pacote. `components.json` aponta para `src/styles/index.css` — o caminho certo, ao contrário do repo de origem, onde esse path estava errado e documentado como pitfall conhecido. |
| **react-router 7** | react-router-dom | A v7 unificou os pacotes. O nome antigo ainda existe e é o erro mais frequente de um agente a arrancar. |
| **TanStack Query para estado de servidor** | `useState` + `useEffect` | Cache, invalidação e estados de loading/erro treatment vêm de graça. O plugin `@tanstack/eslint-plugin-query` está ligado ao ESLint só em `src/services/`, para apanhar query keys ad-hoc. |
| **ky** | axios, `fetch` | Menor, baseado em `fetch`, e os hooks (`beforeRequest`, `beforeError`) resolvem autenticação e normalização de erros num sítio. |
| **Alias `@/`** | Imports relativos | Resolvido pelo Vite, e o código lê-se melhor. |

## Backend

| Decisão | Alternativa rejeitada | Porquê |
|---|---|---|
| **Express 5** | Fastify, Hono, NestJS | O mais legível e o mais fácil de depurar. O 5 já encaminha erros de handlers `async` sozinho. |
| **REST com Zod** | tRPC | REST é legível por qualquer pessoa e por qualquer ferramenta. tRPC daria type-safety ponta a ponta ao custo de mover a definição para um único sítio — mais acoplamento do que pretendemos. |
| **Prisma 6 + Postgres** | TypeORM, Drizzle | Prisma gera tipos a partir do schema, que é a razão principal. `prisma.config.ts` em vez da chave `prisma` do `package.json`, que a Prisma 7 remove. |
| **Camadas route → controller → service** | Rotas com tudo junto | Só a `services/` toca no Prisma. É o que mantém a camada HTTP testável sem base de dados. |
| **Imports relativos com `.js`** | Alias `@/` como no frontend | O build do backend é `tsc` puro, sem resolver de aliases em runtime — o `dist/` não correria. A incoerência com o frontend é deliberada e está documentada no `backend/AGENTS.md`. |
| **Proxy do Vite para `/api`** | URL absoluta + CORS | O browser usa o mesmo caminho em dev e em produção, e o CORS deixa de ser um problema quotidiano. |

## Testes

**Vitest só no frontend.** O runner padrão do ecossistema Vite; o repositório
de origem usava Jest porque seguia o Create React App do curso, que já não é o
caminho. Os testes ficam colocados ao lado do ficheiro testado.

O backend ainda não tem framework. Introduzi-lo exige uma decisão à parte:
os testes de integração do Prisma precisam de uma base de dados real (ou um
container por execução), e isso tem custo. A regra está escrita no
`AGENTS.md` para ninguém introduzir sem perguntar.

## Repositório

| Decisão | Alternativa rejeitada | Porquê |
|---|---|---|
| **GitHub privado, remote HTTPS** | Gitea interno, SSH | Decisão do dono do template. O SSH está bloqueado neste ambiente; o Git Credential Manager autentica por HTTPS sem configuração. |
| **Skills versionadas** | Skills ignoradas pelo git | Este repo é um template: tem de ser autocontido. Num repo de produto seriam config local e ignoradas. |
| **`tmp/` na raiz** | Scratch espalhado | Um sítio só para o que não é resultado, e gitignored à partida. |
| **`.env.example` por pacote** | Um `.env.example` na raiz | O `.env` tem de estar ao lado de quem o lê. Duplicar as variáveis na raiz seria uma segunda fonte de verdade para as manter em sincronia. |

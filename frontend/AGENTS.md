# AGENTS.md — frontend

Regras do repositório: [../AGENTS.md](../AGENTS.md). Escopo: a SPA React, a
camada de serviços e a comunicação com o backend.

## Stack

React 19 · TypeScript 5.8 (strict, `verbatimModuleSyntax`) · Vite 6 · Tailwind
CSS v4 **CSS-first** (sem `tailwind.config.js`; os tokens vivem em
`src/styles/index.css`) · shadcn/ui (new-york, `neutral`, ícones lucide) —
**fonte padrão de módulos React/UI: [ui.shadcn.com](https://ui.shadcn.com)** ·
TanStack Query 5 · `ky` · **react-router v7 — pacote `react-router`, NUNCA
`react-router-dom`** · sonner · Radix · zod · Vitest.

## Comandos

Correm da raiz do repositório (`pnpm --filter @react-template/frontend <script>`)
ou de dentro de `frontend/`.

```bash
pnpm dev          # Vite em http://localhost:5173
pnpm lint         # ESLint flat
pnpm typecheck    # tsc -b
pnpm test         # Vitest (suite)
pnpm build        # tsc -b && vite build
pnpm format       # Prettier
```

## Ambiente

- `.env` (gitignored) obrigatório: `VITE_BASE_URL=/api`. Sem ele,
  `src/config/env.ts` lança no arranque.
- Variável nova: prefixo `VITE_` e adiciona-a ao schema Zod em
  `src/config/env.ts`. **Nunca ler `import.meta.env` fora daí.**
- Em dev o Vite faz proxy de `/api` para `http://localhost:3000`
  (`VITE_PROXY_TARGET`), por isso o browser usa o mesmo URL em dev e em
  produção e não há CORS.

## Estrutura — onde colocar as coisas

```
src/
├── main.tsx       # entrada; monta os providers e a App
├── config/        # env.ts (Zod), constants.ts (RouteEnum)
├── containers/    # App/ (rotas + providers), Layout/, Sidebar/
├── pages/         # ecrãs de rota — um default export por página
├── components/    # reutilizáveis e genéricos; ui/ é do shadcn
├── services/      # chamadas HTTP, hooks Query, tipos do domínio
├── hooks/         # useXxx, um hook por ficheiro
├── lib/           # funções puras (utils.ts com o cn)
├── helpers/       # utilitários transversais (logger)
├── styles/index.css  # tokens Tailwind v4 — única folha de estilo global
├── assets/        # imagens e ficheiros estáticos
└── test/setup.ts  # setup do Vitest
```

**Decisão rápida:** ecrã de rota → `pages/`; shell à volta das rotas →
`containers/`; componente reutilizável → `components/`; HTTP/estado de servidor
→ `services/`; estado de UI → hook ou contexto junto de quem o consome.

## Convenções

- **Nome do ficheiro = nome do export que contém.** `foo.tsx` exporta `Foo`.
  Páginas: uma pasta PascalCase com `index.tsx` (ex.: `pages/Home/index.tsx`).
- **Ficheiros kebab-case** (`lazy-component.tsx`, `use-mobile.ts`); pastas
  `PascalCase` em `pages/` e `containers/`.
- **Props de evento `onXxx`** (`onClick`, `onChange`, `onSubmit`); **handlers
  internos `handleXxx`** (`handleCreate`). O `on*` do pai liga-se ao `handle*`
  local.
- Hooks `useXxx` em `src/hooks/`, um por ficheiro. Funções de `lib/` são verbos
  em camelCase (`computeAxisScale`, `formatTick`).
- **Exports nomeados em tudo; default export só nas páginas** — o lazy loading
  depende disso.
- Componentes com `function`, props desestruturadas, `type Props` explícito.
- **Imports:** alias `@/` (→ `src/`); relativos só dentro da mesma pasta;
  tipos com `import type`.
- **Formatação:** sem ponto-e-vírgula, aspas duplas. O Prettier (`.prettierrc`)
  é a fonte da verdade — o ESLint tem as regras de estilo desligadas.
- **UI copy em português.** Notificações com `sonner`.

## shadcn/ui — importante

- É a **fonte padrão de módulos React**: antes de instalares uma dependência de
  UI ou escreveres um componente de raiz, procura primeiro no catálogo
  (componentes, blocos, hooks) e adiciona com
  `pnpm dlx shadcn@latest add <componente>`.
- `src/components/ui/` é **gerado**: adicionar só pelo CLI e **nunca editar à
  mão**. Precisas de customizar? Cria um wrapper teu em `src/components/`.
- **Excepção única e deliberada:** `ui/sonner.tsx` foi escrito à mão para usar o
  `useTheme` do `theme-provider` do projeto em vez do `next-themes`, para não
  haver dois mecanismos de tema. Não voltes ao `next-themes`.
- `components.json` aponta o CSS para `src/styles/index.css` — o caminho certo.

## Padrão canónico — um domínio em `services/`

Um domínio = uma pasta PascalCase com `<dominio>.ts` (hooks + query-key
factory) e `types.ts` (tipos, `export type`). Registar o domínio no barrel
`src/services/index.ts`; os consumidores importam de `@/services`.

```ts
// services/Users/users.ts
const usersKeys = {
  all: ["users"] as const,
  list: () => [...usersKeys.all, "list"] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
}

export const useFetchUsers = () =>
  useQuery({
    queryKey: usersKeys.list(),
    queryFn: async () => api.get("users").json<User[]>(),
  })
```

```ts
// ❌ queryKey ad-hoc, e estado de servidor dentro de useState
const data = useQuery({ queryKey: ["users"], ... })
const [users, setUsers] = useState<User[]>([])
```

Todas as chamadas HTTP passam pela instância `api` (`ky`, em
`services/api.ts`) — nunca `fetch` nem axios directos. Mutações: `onSuccess` →
`toast.success` + `invalidateQueries` da key afetada; `onError` → `toast.error`.

## Rotas

- react-router **v7**: importar de `react-router`, **nunca** `react-router-dom`.
- **Paths só via `RouteEnum`** (`src/config/constants.ts`) — ecrã novo = valor
  novo no enum.
- Páginas lazy **sempre fora do render**, com
  `Lazy(withRetry(() => import("@/pages/X")))` — evita `ChunkLoadError` depois
  de um deploy.

## Testes

Vitest, ficheiro colocado ao lado (`foo.test.tsx`), `jsdom`, Testing Library.
Globais e `@testing-library/jest-dom` já estão configurados em
`vite.config.ts` + `src/test/setup.ts`.

## Boundaries

- **Always:** `api` para HTTP; `RouteEnum` para paths; lazy para páginas;
  `cn()` para classes condicionais; `sr-only` em botões só-ícone; copy em
  português; actualizar este ficheiro quando a estrutura mudar.
- **Ask first:** dependência de UI nova; nova pasta de topo em `src/`; mudar
  `tsconfig`, `eslint.config.js`, `vite.config.ts` ou `components.json`;
  alterar `components/ui/`; renomear ficheiros existentes.
- **Never:** `fetch` directo; estado de servidor em `useState` ou contexto;
  `react-router-dom`; lazy criado dentro do render; componentes genéricos
  presos dentro de uma página (sobem para `components/`); hex ou valores de cor
  em vez dos tokens; ler `import.meta.env` fora de `config/env.ts`.

---
*Última atualização: 2026-10-02.*

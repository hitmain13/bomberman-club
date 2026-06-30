# Bomberman Club

Rede social para entusiastas automotivos: perfis, garagem multi-carro, peças/specs detalhadas, flagrados com mapa, feed e social. Mobile-first 375px, type-strict, performático.

> Spec Driven Development. Antes de implementar qualquer feature, ler a spec correspondente em `docs/specs/`.

## Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind v4, TanStack Query, Zustand, React Hook Form, Zod.
- **Backend**: Bun + Elysia, Prisma, PostgreSQL, Redis, S3 (MinIO em dev).
- **Tooling**: Bun Workspaces + Turborepo + Biome + Changesets + Lefthook + Commitlint.

## Estrutura

```
apps/
  web/             Next.js 15
  api/             Elysia
packages/
  ui/              atoms compartilhados
  design-tokens/   tokens (cor, spacing, typography)
  types/           Zod schemas + tipos + utils de cálculo
  sdk/             client tipado da API
  config/          tsconfig.* + biome compartilhados
docs/
  architecture/    ARCHITECTURE.md + ADRs
  domain/          glossário, bounded contexts, event storming
  specs/           001-auth, 002-profile, ...
.cursor/rules      regras operacionais para a IA
.cursor/skills     skills operacionais (nova-feature-sdd, ...)
.ai/rules          fonte canônica das regras
.progress/         tracking da IA (progress, todo, decisions, log)
```

## Setup

```bash
bun install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
bun run db:up                  # Postgres + Redis + MinIO via Docker
bun --cwd apps/api run db:migrate
bun --cwd apps/api run db:seed
bun run dev
```

## Comandos canônicos

| Comando                       | Ação                                  |
| ----------------------------- | ------------------------------------- |
| `bun install`                 | instala deps do monorepo              |
| `bun run dev`                 | sobe web + api                        |
| `bun run dev:web`             | só o front                            |
| `bun run dev:api`             | só o back                             |
| `bun run typecheck`           | typecheck em todos os pacotes         |
| `bun run lint`                | biome check                           |
| `bun run lint:fix`            | biome auto-fix                        |
| `bun run test`                | unit + integration                    |
| `bun run test:e2e`            | Playwright                            |
| `bun run db:migrate`          | aplica migrations Prisma              |
| `bun run db:seed`             | popula seeds (specs, parts, etc.)     |
| `bun run db:studio`           | Prisma Studio                         |

## Documentação chave

- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/adr/`
- `docs/specs/<feature>/`
- `wireframe.png` — fonte de verdade visual
- `implementation_execution.md` — guia da IA executora
- `execution_strategy.md` — milestones e limites

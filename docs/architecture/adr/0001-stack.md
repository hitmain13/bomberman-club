# ADR 0001 — Stack

## Contexto

Bomberman Club é uma plataforma social mobile-first para entusiastas automotivos com requisitos de qualidade nível especialista, type-safety total e escalabilidade.

## Decisão

- Frontend: Next.js 15 (App Router) + React 19 + Tailwind v4.
- Backend: Bun + Elysia + Prisma + Postgres.
- Cache: Redis.
- Storage: MinIO em dev / S3 em prod.
- Monorepo: Bun Workspaces + Turborepo.
- Lint/format: Biome.
- Versionamento: Changesets.
- Estado client: TanStack Query (server) + Zustand (efêmero) + Context (auth/theme).
- Validação: Zod ponta a ponta.

## Consequências

- Toda a stack roda em Bun (back e tooling), unificando runtime.
- Schemas Zod compartilhados em `packages/types` viram fonte única de verdade.
- TanStack Query elimina `useEffect` + `fetch` no front.

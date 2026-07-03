# Architecture (canonical)

## Topologia

```
Cloudflare
   ↓
Next.js 15 (apps/web)
   ↓
Elysia API (apps/api)
   ↓
Postgres • Redis • S3/MinIO
```

## Monorepo

- `apps/web` — Next.js 15, React 19, Tailwind v4.
- `apps/api` — Elysia (Bun), Prisma, Postgres, Redis.
- `packages/ui` — atoms compartilhados (escrito agnóstico ao Next).
- `packages/design-tokens` — tokens (cores, spacing, radius, typography).
- `packages/types` — Zod schemas + tipos compartilhados + utils de cálculo.
- `packages/sdk` — client tipado da API consumido por `apps/web`.
- `packages/config` — `tsconfig.*.json` compartilhados e Biome config.

## Domínios (bounded contexts)

- **Identity & Access** — auth, users, refresh tokens, RBAC.
- **Garage** — garages, cars (campos tipados), car images.
- **Configurability** — specifications (EAV), parts, part categories.
- **Sightings** — flagrados (foto + geo).
- **Social** — comments, likes, favorites, follows, notifications.
- **Discovery** — feed, search, ranking, explore (people/cars), estatísticas de perfil, itens curtidos. Camada de leitura/agregação cross-context (read-model layer) — ver ADR 0008.
- **Media** — uploads.

## Grafo de dependências entre módulos (ADR 0008)

```
auth ──────► users
social ────► users
cars ──────► catalog
discovery ─► cars, sightings, social, users
```

Módulos de domínio nunca importam de `discovery`. Qualquer service que precise agregar dados de 2+ módulos mora em `discovery`, mesmo que a rota HTTP fique sob o prefixo de outro módulo (ex.: `/users/:username/stats`).

## Tipo-segurança ponta a ponta

Schema Zod (canônico em `packages/types`) → DTO (`z.infer`) → entidade Prisma → mapper → resposta tipada → SDK tipado → consumidor no front com inferência total. Zero `as`, zero `any`.

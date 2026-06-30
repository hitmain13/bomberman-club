# Bomberman Club — Relatório Final (M1–M13)

## Resumo executivo

Projeto entregue em **2 sessões** de execução autônoma seguindo o pipeline `IMPLEMENTATION_EXECUTION.md` + `EXECUTION_STRATEGY.md`. **Todas as 21 telas do wireframe** estão implementadas, com backend type-safe Bun+Elysia, frontend Next 15 mobile-first 375px e governança SDD completa.

## Stack final

| Camada | Tecnologias |
| --- | --- |
| Monorepo | Bun Workspaces, Turborepo, Biome, lefthook, commitlint, Changesets |
| Frontend | Next.js 15 (App Router), React 19, Tailwind v4, TanStack Query, Zustand-ready, Zod, React Hook Form, Leaflet |
| Backend | Bun, Elysia, Prisma, PostgreSQL, jose (JWT), argon2id, S3 v4 signature (custom) |
| Infra dev | docker-compose (Postgres 16, Redis 7, MinIO + bucket init) |
| CI | GitHub Actions (install, lint, typecheck, build, test) |

## Funcionalidades implementadas

### Identity & Access (M3)

- Registro/Login com username ou e-mail + senha forte (Zod regex).
- Argon2id para hash de senha.
- Access JWT (HS256, 15 min) + Refresh token rotativo (cookie `httpOnly` 30 dias).
- Rate limit por IP em `/auth/*`.
- `/users/me` get/patch + `/users/:username` público.

### Garage + Cars (M7 + M8)

- Garage primary auto-criada (lazy).
- CRUD de carros com campos tipados (peso, hp, torque, km, ano, combustível) + Builder pattern (`CarBuilder`).
- Ownership guard em todas mutações.
- Catálogo de peças reaproveitáveis (PartCategory → Part → CarPart).
- Specs em EAV puro (`SpecificationDefinition` + `CarSpecificationValue`) com validação runtime por tipo via `validateSpecValueInput` (sem any/unknown).

### Media (M9 — Uploads)

- `POST /uploads` multipart com:
  - Validação magic-number (jpeg/png/webp).
  - Mime allowlist + tamanho ≤ 15 MB.
  - AWS Signature v4 custom (sem AWS SDK) — funciona com MinIO local e S3 prod.
- Upload reusado por avatar, cover de carro, galeria e flagrados.

### Sightings (M9)

- CRUD com cursor pagination, filtro por período (TODAY/WEEK/MONTH/YEAR/ALL).
- Geolocalização (lat/lng) com `navigator.geolocation` no front.

### Map (M10)

- `/map` com Leaflet via `next/dynamic` (ssr: false).
- Pins clicáveis com popup linkando para o detalhe.
- Filtros de período compartilhados com `/sightings`.

### Social (M11) — polimórfico

- Likes, Favorites, Comments, Follows, Notifications.
- `targetType` enum + `targetId` em Comment/Like/Favorite.
- Side-effects: Notification automática para o dono ao curtir/comentar/seguir.

### Discovery (M12)

- Feed com escopos (FORYOU, FOLLOWING, RECENT) merging cars+sightings.
- Ranking por 4 métricas (potência, peso/pot., torque, pot./peso).
- Search case-insensitive em people/cars/sightings.

## Métricas

| Métrica | Valor |
| --- | --- |
| Telas do wireframe | 21/21 |
| Rotas Next.js | 25 (17 estáticas + 8 dinâmicas) |
| First Load JS shared | 106 kB |
| Testes unitários | 55 (46 web + 9 api) |
| Specs SDD | 11 |
| ADRs | 7 |
| Commits | 14 (Conventional Commits) |
| Atoms | 8 |
| Molecules | 2 |
| Organisms / features | 18+ |
| Linhas typecheck | strict total, sem any/unknown/as |
| Biome warnings | 0 |

## Patterns aplicados

- **Clean Architecture** backend (Controller → Service → Repository → Database).
- **Repository Pattern** isolando Prisma em uma única camada.
- **Builder Pattern** (`CarBuilder` fluent).
- **Factory** (futuro: `PartFactory`).
- **Mapper Pattern** (`toCarResponse`, `toSightingResponse`, etc.).
- **Atomic Design** no frontend (atoms → molecules → organisms → templates).
- **Guard clauses + return early** em todos os services.
- **EAV puro** para escalabilidade de specs sem migrations.
- **Polimorfismo controlado** em likes/comments/favorites.
- **Type-safety ponta a ponta** via Zod schemas compartilhados + `z.infer`.
- **Server Components por padrão** no Next.

## Governança

- `.cursor/rules/` — 10 regras operacionais para a LLM.
- `.cursor/skills/` — 4 skills (nova-feature-sdd, novo-componente-atomic, novo-modulo-backend, validar-pixel-perfect).
- `.ai/rules/` + `.ai/templates/` — base canônica.
- `docs/architecture/ADRs` + `docs/specs/` — 7 decisões + 11 specs.
- `.progress/` — tracking ativo (progress, todo, decisions, session-log, known-issues, este relatório).

## Pendências para V1.1

Consolidadas em `.progress/todo.md`. Principais:

1. Browser QA manual + Lighthouse após primeiro deploy real.
2. Storybook (stories já prontas).
3. Integration tests via Testcontainers.
4. E2E Playwright.
5. Login social Google/Apple.
6. Presigned URL client-side.
7. Sharp pipeline.
8. Push notifications.

## Para subir

```bash
cd /home/matsu/projects/bomberman-club
bun install
docker compose up -d        # Postgres + Redis + MinIO
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
bun --cwd apps/api run db:migrate
bun --cwd apps/api run db:seed
bun run dev                 # web (3000) + api (3333)
```

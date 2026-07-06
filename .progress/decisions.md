# Decisions

Decisões arquiteturais detalhadas vivem em `docs/architecture/adr/`. Este arquivo é um índice cronológico para a IA recuperar contexto rapidamente.

| ADR  | Decisão                                                          |
| ---- | ---------------------------------------------------------------- |
| 0001 | Stack: Next 15 + Elysia + Prisma + Postgres + Redis + MinIO      |
| 0002 | Modelagem de specs do carro: EAV puro                            |
| 0003 | Monorepo Bun Workspaces + Turborepo + Biome                      |
| 0004 | Relações sociais polimórficas (Comment/Like/Favorite)            |
| 0005 | Bootstrap do `apps/web` via boilerplate Next 15                  |
| 0006 | LLM executora: composer-2.5-fast — regras maximamente explícitas |
| 0007 | Validação Zod + `z.infer` em todo boundary; proibido `as`/`any`  |
| 0008 | Explore Social: `discovery` como camada de leitura cross-context; correção de 3 violações de Prisma-fora-de-Repository; banner/último-acesso adiados (fora dos wireframes pixel) |
| 0009 | Keep-alive Render: GitHub Actions cron + `ApiHeartbeat` client-side |
| 0010 | `UploadCleanupService`: exclusão DB + S3 reutilizável (cars, sightings, admin, uploads) |
| 0011 | Sessão resiliente (`refreshSessionWithRetry` + snapshot) e filtros na URL (`useFilterParams`) |
| 0012 | Bootstrap de auth não bloqueante + proxy same-origin `/api` para cookies first-party |
| 0013 | Forward geocode search no `LocationPicker` (Nominatim, throttle, cache) |
| 0014 | Melhorias V2: reverse geocode frontend, pointer reorder, compressão WebP, RBAC carros admin, validação uploads sighting |
| 0015 | Sessão cookie-first (`bc_access` + `bc_refresh`), grace period refresh, bootstrap resiliente |

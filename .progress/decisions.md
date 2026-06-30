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

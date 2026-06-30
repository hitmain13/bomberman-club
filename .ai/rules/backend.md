# Backend (canonical)

Stack: Bun + Elysia + Prisma + Postgres + Redis.

## Camadas

`Controller → Service → Repository → Database`. Veja `.cursor/rules/20-clean-architecture.mdc`.

## Validação

- Zod schemas em `schemas/`.
- Elysia usa Standard Schema (`t.From(zSchema)` ou plugin equivalente).
- Toda entrada do boundary validada. Sem confiar em tipos do client.

## Erros

`common/errors/`:

- `AppError` (base, status + code).
- `NotFoundError`
- `ValidationError`
- `UnauthorizedError`
- `ForbiddenError`
- `ConflictError`
- `RateLimitError`

Handler central converte em resposta JSON `{ error: { code, message, details? } }`.

## Auth

- Access JWT (15 min) + Refresh rotativo (30 dias) com hash em DB.
- Cookies `httpOnly` `secure` `sameSite=lax`.
- Plugin `auth.plugin.ts` injeta `ctx.user`.
- Guard `requireAuth`, `requireRole('ADMIN')`.

## Cache

Redis com chaves `bc:<dominio>:<recurso>:<id>` e TTL apropriado:

- `profile:<userId>` 10 min
- `feed:<userId>:<scope>` 1 min
- `ranking:<scope>` 5 min

Invalidação por evento (publish/subscribe interno).

## OpenAPI

Swagger plugin do Elysia, exposto em `/docs` (apenas em dev). Spec gerada do schema Zod.

## Logs

`pino` JSON. Request-id em cada log. Nível por env.

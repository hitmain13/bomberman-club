# ADR 0007 — Validação Zod e proibição de `any`/`unknown`/`as`

## Contexto

Qualidade nível especialista exige type-safety real, não cosmético.

## Decisão

- Schemas Zod canônicos em `packages/types/src/schemas/`.
- Tipos derivados via `z.infer<typeof Schema>` — nunca duplicar manualmente.
- Toda fronteira (API request/response, formulários, parsing de env, parsing de payloads externos) é validada por Zod.
- Proibido: `any`, `unknown` solto, `as Foo` (exceto `as const`), `@ts-ignore`, `@ts-expect-error`.

## Consequências

- Erros de tipo capturados em compile-time + runtime.
- `composer-2.5-fast` segue um padrão previsível ao receber novos requisitos.

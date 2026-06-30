# Performance (canonical)

## Front

- Server Components por padrão; Client só quando necessário.
- `next/image` com `sizes` e `priority` na fold.
- Streaming + Suspense.
- Code split por rota e `dynamic()` para componentes pesados.
- Bundle ≤ 200 KB inicial (alvo).

## Back

- Queries Prisma com `select` explícito (evitar overfetch).
- Índices em FKs e filtros comuns.
- Redis para hot reads (`profile`, `feed`, `ranking`).
- Paginação cursor-based em listas grandes.

## Lighthouse alvo

- Performance ≥ 95
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Executar 2x no máximo conforme `execution_strategy.md`.

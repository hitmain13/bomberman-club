# ADR 0005 — Bootstrap de `apps/web` via boilerplate oficial

## Contexto

Criar Next.js 15 + Tailwind + TS do zero gera muita variabilidade. Para reduzir incertezas e economizar tokens do `composer-2.5-fast`, partir de um boilerplate previsível.

## Decisão

Usar `bun create next-app apps/web --ts --tailwind --app --src-dir --import-alias "@/*"`.

Pós-pull (determinístico):

1. Renomear `name` para `@bomberman/web`.
2. Remover ESLint do boilerplate (usamos Biome).
3. Estender `@bomberman/config/tsconfig.web.json`.
4. Atualizar para Tailwind v4 se necessário.
5. Plugar `@bomberman/design-tokens`.
6. Estruturar `src/{components,features,shared}`.

## Consequências

- Reduz superfície de erro inicial.
- Trade-off: ainda exigimos passos de "limpeza pós-pull" no roteiro.

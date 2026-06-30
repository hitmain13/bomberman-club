# ADR 0003 — Monorepo (Bun Workspaces + Turborepo + Biome)

## Contexto

Front, back e pacotes compartilhados devem coexistir com type-safety ponta a ponta e tooling unificado.

## Decisão

- **Bun Workspaces** como gerenciador de pacotes (single runtime).
- **Turborepo** para pipeline (`dev`, `build`, `lint`, `typecheck`, `test`).
- **Biome** como linter+formatter (substitui ESLint+Prettier).
- **Changesets** para versionamento dos pacotes internos.
- **commitlint + lefthook** para Conventional Commits.

## Consequências

- Setup mais rápido e cache do Turbo entre apps.
- Biome é mais rápido e tem regras mais previsíveis para a LLM seguir.
- Não usamos ESLint config compartilhada (substituída por Biome).

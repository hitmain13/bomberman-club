# Testing (canonical)

Detalhado em `.cursor/rules/80-testing.mdc`.

## Estratégia

- Unit: Vitest. Cobertura mínima 90% nas regras de negócio.
- Integration: Vitest + Postgres efêmero.
- E2E: Playwright, fluxos críticos.

## Convenções

- AAA (Arrange/Act/Assert).
- Fixtures tipadas (`makeUser`, `makeCar`).
- Sem mocks de Prisma quando há valor em integration test real.
- Cada bug corrigido → teste de regressão.

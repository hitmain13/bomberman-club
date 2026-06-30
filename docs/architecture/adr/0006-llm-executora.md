# ADR 0006 — LLM executora: composer-2.5-fast

## Contexto

A implementação será conduzida principalmente pelo modelo `composer-2.5-fast`. Modelos rápidos exigem instruções mais explícitas, determinísticas e à prova de ambiguidade.

## Decisão

- Regras em `.cursor/rules/*` e `.ai/rules/*` devem listar **proibições explícitas** (não só recomendações).
- Skills em `.cursor/skills/*` devem trazer **passo a passo numerado**.
- Templates copy-paste em `.ai/templates/*` para componentes e specs.
- Definition of Done com checklist por componente e por módulo.
- Comandos canônicos sempre os mesmos (`bun run dev`, `bun run typecheck`, `bun run lint`, `bun run test`).

## Consequências

- Documentação mais verbosa que o usual, intencionalmente.
- Maior previsibilidade de saída do modelo.

# Prompt: gerar spec de feature

Use este prompt para gerar/atualizar uma spec em `docs/specs/<numero>-<slug>/`.

```
Você é um Tech Lead.
Vamos especificar a feature "<NUMERO>-<SLUG>" do Bomberman Club seguindo SDD.

Considere:
- ARCHITECTURE.md
- .ai/rules/*
- wireframe.png (telas correspondentes)
- bounded contexts em docs/domain/bounded-contexts/

Entregue os 6 arquivos da spec:
1. specification.md (visão, escopo, fora de escopo, dependências)
2. acceptance-criteria.md (Gherkin)
3. api-contract.yaml (OpenAPI mínimo)
4. database.md (modelos, índices, migrations)
5. ui.md (telas envolvidas, estados, eventos)
6. test-plan.md (unit / integration / e2e)

Sem código de implementação. Apenas spec.
```

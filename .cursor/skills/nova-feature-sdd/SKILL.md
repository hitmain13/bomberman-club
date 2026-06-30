---
name: nova-feature-sdd
description: Inicia uma nova feature seguindo SDD. Use quando o usuário ou o roadmap pedir para começar uma feature numerada (ex.: "iniciar 005-specs-parts").
---

# Skill: nova-feature-sdd

## Quando usar

Iniciar qualquer feature do roadmap (`001-auth` até `013-search`). Não pular nenhum passo.

## Passo a passo

1. Abrir `docs/specs/<numero>-<slug>/specification.md`. Se não existir, criar a partir do template `.ai/templates/spec/`.
2. Preencher os 6 arquivos da spec:
   - `specification.md`
   - `acceptance-criteria.md`
   - `api-contract.yaml`
   - `database.md`
   - `ui.md` (referenciando telas do `wireframe.png`)
   - `test-plan.md`
3. Apresentar a spec ao usuário para aprovação. **NÃO** codar antes da aprovação.
4. Após aprovação seguir o pipeline da feature:
   - Criar testes (red).
   - Implementar backend (módulo seguindo `.cursor/rules/20-clean-architecture.mdc`).
   - Rodar testes do backend até verde.
   - Adicionar endpoints no `packages/sdk`.
   - Implementar telas no `apps/web` (atomic, pixel-perfect).
   - Stories no Storybook (Default/Loading/Empty/Error/Variants).
   - Testes faltantes (component + e2e crítico).
   - Browser QA da feature.
   - Refatorar uma única vez se houver duplicação/violação SOLID.
5. Atualizar `.progress/progress.md`, `.progress/session-log.md`.
6. Se emergiu padrão novo: atualizar `.ai/rules/*` + ADR (skill auxiliar: registrar padrão).
7. Commit `feat(<escopo>): implement <feature>`.

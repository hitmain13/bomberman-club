# ADR 0002 — Modelagem de specs do carro com EAV puro

## Contexto

O domínio automotivo tem alta variabilidade: stage, boost, ECU, injetor, launch control RPM, compressão, tipo de transmissão, drivetrain, etc. Adicionar coluna nova por spec gera migration constante e acopla a aplicação a decisões antecipadas.

## Decisão

Modelo EAV puro:

- `SpecificationDefinition(id, key UNIQUE, name, type, unit?, category?, enumOptions?)` — define a "chave" da spec.
- `CarSpecificationValue(carId, definitionId, valueString?, valueNumber?, valueBoolean?)` com `@@unique([carId, definitionId])` — guarda o valor.

A coluna preenchida (`valueString` | `valueNumber` | `valueBoolean`) é determinada por `definition.type` em runtime. Validação por Zod no service (sem `any`/`unknown`).

Adicionar nova spec = inserir linha em `SpecificationDefinition` — sem migration.

## Exceções (campos tipados em `Car`)

Para suportar cálculo e ranking ordenável diretamente no Postgres, os campos a seguir permanecem **tipados** em `Car`:

- `weight`, `horsepower`, `torque`, `currentKm`, `year`, `brand`, `model`, `generation`, `fuel`, `engine`, `plate?`.

## Consequências

- Escalabilidade alta de domínio.
- Required: validação por Zod conforme `definition.type` (evita stringly-typed solto).
- Required: índice em `CarSpecificationValue(carId, definitionId)` para joins eficientes.

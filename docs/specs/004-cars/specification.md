# 004-cars + 005-specs-parts — Specification

## Visão

Permitir CRUD completo de carros (tela 12), visualização rica do carro (tela 10) com peças instaladas (tela 13) e especificações EAV (tela 14).

## Escopo

- POST/PATCH/DELETE /cars com Builder + ownership guard.
- GET /cars/:id.
- GET/POST/DELETE /cars/:id/parts (CarPart) + reuse de Part globais.
- GET/PUT /cars/:id/specs (CarSpecificationValue) com validação EAV por type.
- Catalog: GET /catalog/part-categories, GET /catalog/part-categories/:id/parts, GET /catalog/spec-definitions.
- Telas: 10 (detalhe), 12 (criar/editar), 13 (peças), 14 (especificações).

## Fora de escopo

- Comentários/likes/follow (M9–M11).
- Upload real de cover (M9 Uploads).

## Dependências

- M2 schema (já criado).
- Seed de PartCategory e SpecificationDefinition.

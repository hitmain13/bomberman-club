---
name: novo-modulo-backend
description: Cria a estrutura completa de um módulo backend Elysia seguindo Clean Architecture.
---

# Skill: novo-modulo-backend

## Quando usar

Criar um novo módulo de domínio em `apps/api/src/modules/`.

## Estrutura obrigatória

```
src/modules/<modulo>/
  controllers/<modulo>.controller.ts
  services/<modulo>.service.ts
  repositories/<modulo>.repository.ts
  entities/<modulo>.entity.ts
  dto/<modulo>.dto.ts
  schemas/<modulo>.schema.ts
  mappers/<modulo>.mapper.ts
  factories/<modulo>.factory.ts          # opcional
  builders/<modulo>.builder.ts           # opcional
  tests/<modulo>.service.test.ts
  index.ts
```

## Passos

1. Criar schema Zod em `schemas/`.
2. Derivar tipos via `z.infer` em `dto/`.
3. Modelar `entity/` (tipo de domínio puro).
4. Implementar `repository/` (único lugar que toca Prisma).
5. Implementar `service/` (regra de negócio, guard clauses).
6. Implementar `controller/` (Elysia, valida com schema, chama service).
7. Implementar `mapper/` (`toEntity`, `toDTO`).
8. Testes unitários do service.
9. Registrar controller no app principal via `index.ts` do módulo.
10. Adicionar endpoints no `packages/sdk` se for consumido pelo front.

## Patterns lembretes

- Guard clause no topo. Return early.
- Sem `any`/`unknown`/`as`.
- Controller nunca importa Prisma.
- Service nunca monta HTTP.
- Repository nunca contém regra de negócio.

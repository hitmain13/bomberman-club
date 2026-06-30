# ADR 0004 — Relações sociais polimórficas

## Contexto

Like, Comment e Favorite precisam atuar sobre múltiplas entidades (perfil, carro, flagrado). Criar tabelas separadas (`ProfileLike`, `CarLike`, `SightingLike`) explode a complexidade.

## Decisão

Modelar como polimórficas:

- `targetType` enum `PROFILE | CAR | SIGHTING`.
- `targetId` string.
- `@@index([targetType, targetId])`.
- `Like` e `Favorite` com `@@unique([userId, targetType, targetId])`.

Sem FK nativa de `targetId` — limitação conhecida do Prisma. Integridade é assegurada na camada de service.

## Consequências

- Reuso máximo de código (services genéricos).
- Necessidade de validação explícita do `targetType` em cada operação.
- Migration única quando adicionar novo alvo (basta estender o enum).

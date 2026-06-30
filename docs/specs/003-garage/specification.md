# 003-garage — Specification

## Visão

Permitir ao Bomberman organizar múltiplos carros em uma ou mais Garagens. Cada usuário recebe uma "Garagem principal" automaticamente ao criar a conta — neste milestone tratamos a criação implícita via primeiro acesso ao recurso (lazy).

## Escopo

- Listagem dos carros do usuário corrente: `GET /cars/mine`.
- Listagem dos carros de outro usuário público: `GET /users/:username/cars`.
- Tela 09 "Meus carros" — lista vertical de CarCard com KPIs (HP/peso/peso-pot.).
- CTA "Adicionar carro" (target da M8).

## Fora de escopo

- CRUD multi-garagem na UI (uma única garage "Principal" é suficiente em V1).
- Detalhe de carro / peças / specs (M8).

## Dependências

- Tabelas existentes: `Garage`, `Car`, `Upload` (cover via uploadId).
- M8 substituirá os placeholders por dados reais.

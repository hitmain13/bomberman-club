# 012-discovery — Feed, Ranking, Search, Explore

## Visão

Endpoints e telas de descoberta:

- **Feed** (`GET /feed?scope=foryou|following|recent`) — agrega sightings + cars + members em ordem cronológica/relevância.
- **Ranking** (`GET /ranking?metric=power|weightToPower|torque|powerToWeight`) — top cars por métrica.
- **Search** (`GET /search?q=...&type=people|cars|sightings|all`) — busca multi-recurso por substring case-insensitive.
- **Explore** já existe no wireframe (tela 06) — agora consome o search.

## Fora de escopo

- Ranking baseado em likes/popularity (V1.1).
- Full-text Postgres tsvector (V1.1).

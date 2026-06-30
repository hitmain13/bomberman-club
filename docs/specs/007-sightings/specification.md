# 007-sightings — Specification

## Visão

Permitir que membros publiquem "flagrados" — fotos avistadas na rua com descrição, geolocalização (lat/lng) e data/hora do flagra. Visível para todos os autenticados.

## Escopo

- `POST /sightings` cria flagrado (uploadId, title, description?, latitude, longitude, occurredAt).
- `GET /sightings` lista global paginada (cursor + period filter).
- `GET /sightings/:id` detalhe.
- `DELETE /sightings/:id` (somente owner).
- Telas: 15 Lista, 16 Detalhe, 17 Novo.

## Fora de escopo

- Comments/likes em flagrados (M11).
- Mapa (M10 consome listagem com query geo).

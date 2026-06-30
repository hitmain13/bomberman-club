# 008-map — Specification

## Visão

Página `/map` que renderiza um mapa Leaflet com pins dos flagrados filtrados por período.

## Escopo

- Tela 07 Mapa: filtros Hoje/Semana/Mês/Ano, pins clicáveis (popup com título + link).
- Carregamento client-side via `dynamic(import, { ssr: false })` para não onerar bundle do server.

## Fora de escopo

- Cluster de markers (V1.1).
- Heatmap.

## Dependências

- `useSightings` (M9) já retorna lat/lng e título.

# ADR 0013 — Busca textual de endereços (forward geocode)

## Status

Aceito

## Contexto

O `LocationPicker` só permitia escolher localização via mapa ou GPS. Usuários precisavam poder buscar por rua/avenida/bairro/cidade.

## Decisão

- Reutilizar a infraestrutura de geocodificação existente (Nominatim, throttle global, cache, retry).
- Novo endpoint `GET /geo/search?q=` em `geo.controller.ts`.
- Novo `GeoSearchService` em `shared/geo/geo-search.ts` com mesma política de cache/throttle da reverse geocode.
- Frontend: campo de busca com debounce 400ms, lista de sugestões, seleção move pin e preenche coords.

## Consequências

- Custo zero adicional (mesmo rate limit e cache).
- UX consistente com o restante da plataforma.
- Não afeta o fluxo de submit de flagrados.

# Geocodificação reversa — campo `street`

Flagrados (`Sighting`) armazenam coordenadas (`latitude`, `longitude`) e um rótulo legível em `street` (nome da rua + bairro quando disponível). A geocodificação reversa roda **somente no backend**, no momento do `POST /sightings`, evitando requests duplicados do cliente.

## Serviço

- **Provider:** [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org/) (gratuito)
- **Rate limit:** fila global ~1 req/s + retry com backoff exponencial
- **Cache:** Redis (`REDIS_URL`) quando configurado; fallback in-memory LRU
- **Deduplicação:** coordenadas arredondadas em 5 casas decimais antes do cache
- **TTL do cache:** 30 dias (`bc:geo:reverse:{lat}:{lon}`)

## Migration

```bash
cd apps/api
bun run db:migrate
```

A migration `20260704120000_add_sighting_street` adiciona a coluna `street` e copia valores existentes de `locationLabel`.

## Backfill (registros antigos)

Percorre flagrados sem `street`, respeitando 1,1 s entre geocodificações externas. Progresso salvo em `apps/api/scripts/.backfill-street-checkpoint.json` (retomável).

```bash
cd apps/api
DATABASE_URL='postgresql://...' bun run db:backfill:street
```

Ordem de resolução por registro:

1. Copia `locationLabel` → `street` se existir
2. Caso contrário, chama Nominatim via util compartilhado (com cache)

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `REDIS_URL` | Não | Cache distribuído; omitir usa memória local |
| `DATABASE_URL` | Sim | Postgres |

## Observabilidade

Logs `geocode_resolved`, `geocode_retry`, `geocode_failed` (pino). Métricas em memória via `getReverseGeocodeService().getMetrics()`:

- `cacheHits` / `cacheMisses`
- `externalRequests` / `externalErrors`
- `throttledWaits`

Após deploy, comparar `cacheHits` vs `externalRequests` — hits altos indicam deduplicação efetiva.

## API

**Request** (`POST /sightings`): `street` opcional. Se ausente, o backend geocodifica e persiste.

**Response:** inclui `street` (preferir na UI) e `locationLabel` (legado, espelha `street` em novos registros).

## Rollback

1. Reverter deploy da API
2. A coluna `street` é nullable — registros antigos continuam funcionando com `locationLabel`/coords
3. Não é necessário reverter migration para rollback de código; apenas se quiser remover a coluna manualmente

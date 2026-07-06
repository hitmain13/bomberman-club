# ADR 0014 — Melhorias incrementais V2 (geo UX, uploads, RBAC carros)

## Status

Aceito

## Contexto

A sprint `FEATURE_PLATFORM_IMPROVEMENTS_V2` consolidou seis melhorias: UX de endereço, reordenação de fotos, compressão, permissões admin em carros, estabilidade na publicação de flagrados e UX do painel admin.

## Decisão

### Geo UX

- Novo endpoint `GET /geo/reverse?lat=&lng=` reutilizando `getReverseGeocodeService()` (cache Redis, throttle Nominatim).
- Frontend: hook `useReverseGeocode`, endereço amigável em `LocationPicker`, `NewSightingForm` e `formatSightingLocation` (fallback `"Endereço indisponível"` em vez de coordenadas).
- Seleção de sugestão preenche input, fecha lista e envia `street` no payload de criação.

### Reordenação de fotos

- Substituir HTML5 DnD nativo por **Pointer Events** com long-press (350ms) no touch e drag imediato no desktop.
- Ordem sincronizada via `syncUploadIds` existente no formulário.

### Compressão

- Pipeline client-side: `MAX_EDGE=1400`, `quality=0.72`, saída sempre WebP.
- Aceitar compressão quando tamanho reduz **ou** dimensões reduzem ≥10%, evitando descarte prematuro.

### RBAC carros

- Nova política `car.policy.ts` espelhando `sighting.policy.ts`.
- `CarsService`, `CarPartsService` e `CarSpecsService` recebem `viewer: { id, role }` e usam `canManageCar`.
- Frontend: `CarOwnerGuard` e `isOwner` em `/cars/[id]` permitem `role === "ADMIN"`.

### Publicação de flagrados

- `validateUploadIds` no service: deduplica IDs, valida existência, ownership e capa não reutilizada.
- `occurredAt` normalizado via transform Zod + `parseOccurredAt`.
- Erros de validação retornam 422 em vez de 500 Prisma.

### Admin uploads

- Miniatura abre URL original do Cloudflare em nova aba (`target="_blank"`).

## Consequências

- Sem migrations novas.
- Mesma infraestrutura de geocodificação; requests adicionais de reverse geocode são cacheados.
- Administradores gerenciam carros de terceiros sem rotas novas.

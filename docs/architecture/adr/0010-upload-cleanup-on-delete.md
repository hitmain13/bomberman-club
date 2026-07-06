# ADR 0010 — Exclusão de uploads com limpeza de objeto e FKs

## Status

Aceito

## Contexto

Exclusões de carros, flagrados e uploads (admin) removiam apenas registros no Postgres. Objetos permaneciam no bucket S3/R2, gerando inconsistência e consumo desnecessário de quota.

A lógica de cleanup de FKs já existia em `admin.repository.deleteUpload`, mas não era reutilizada.

## Decisão

Extrair serviço compartilhado `UploadCleanupService` + `UploadsCleanupRepository`:

- `deleteUploadRecord(id)` — transação Prisma com cleanup de FKs (avatar, cover, car images, sighting primary/extra).
- `removeUpload(id)` — DB + `deleteObject(bucketKey)`.
- `removeUploads(ids)` — batch para exclusão de entidades compostas.
- `collectCarUploadIds` / `collectSightingUploadIds` — coleta antes do delete da entidade pai.

Consumidores: `AdminService`, `CarsService.remove`, `SightingsService.remove`, `UploadsService.remove`.

## Consequências

- Consistência entre banco e armazenamento.
- Novas entidades com upload reutilizam o mesmo serviço.
- Ordem: coletar IDs → remover entidade pai → remover uploads (evita FK violations).

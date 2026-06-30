# 006-uploads — Specification

## Visão

Centralizar mídia em uma única tabela `Upload` reusada por avatar, cover de carro, galeria e flagrados. Em V1 implementamos upload server-side direto (o cliente faz `POST /uploads` multipart) com armazenamento em S3-compatível (MinIO em dev / S3 em prod) e validação por magic number.

## Escopo

- `POST /uploads` (multipart `file`) — valida mime allowlist e magic-number, gera `bucketKey` único, sobe via S3 REST (PUT) e persiste `Upload`.
- `GET /uploads/:id` — lookup público.
- `DELETE /uploads/:id` — apenas owner.

## Fora de escopo

- Presigned URL client-side direto (V1.1).
- Pipeline de redimensionamento (sharp). Stub no V1.

## Dependências

- Tabela `Upload` (M2).
- Variáveis S3 em `.env`.

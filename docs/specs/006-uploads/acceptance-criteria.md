# Acceptance Criteria

## Upload feliz

```gherkin
Given um usuário autenticado
When envia POST /uploads com um arquivo image/jpeg de 2 MB
Then a API responde 200 com { id, url, mime, size, width?, height? }
And o objeto fica acessível em S3_PUBLIC_BASE_URL/<bucketKey>
```

## Mime não permitido

```gherkin
Given um usuário autenticado
When envia POST /uploads com application/zip
Then a API retorna 422 validation_error "mime not allowed"
```

## Magic number divergente

```gherkin
Given um arquivo com extensão .jpg mas magic number incompatível
When o usuário envia
Then a API retorna 422 "file content mismatch"
```

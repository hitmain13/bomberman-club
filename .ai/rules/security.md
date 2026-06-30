# Security (canonical)

Detalhado em `.cursor/rules/60-security.mdc`. Resumo:

- Helmet / headers seguros.
- Rate limit em `auth/*` e endpoints sensíveis.
- JWT access curto + refresh rotativo + hash em DB.
- Password com argon2id.
- Validação Zod em toda entrada.
- Cookies `httpOnly` `secure` `sameSite=lax`.
- Sanitização de HTML em conteúdo de usuário.
- Upload: presigned URL + magic-number + mime allowlist + tamanho.
- CORS por origem.
- Erros de auth genéricos (não vazam existência).

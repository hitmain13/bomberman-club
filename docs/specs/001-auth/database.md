# Database

Tabelas usadas (já existentes no schema):

- `User` (id, username unique, email unique, passwordHash, role)
- `RefreshToken` (id, userId FK, tokenHash unique, expiresAt, revokedAt, userAgent, ip)
- `PasswordReset` (id, userId FK, tokenHash, expiresAt, usedAt) — implementação real fica para V1.1.

Sem novas migrations.

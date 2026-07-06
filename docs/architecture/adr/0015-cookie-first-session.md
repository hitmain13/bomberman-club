# ADR 0015 — Sessão cookie-first e refresh resiliente

## Status

Aceito

## Contexto

Usuários ainda eram deslogados esporadicamente, mesmo após ADR 0012 (proxy same-origin e bootstrap não bloqueante). Causas identificadas:

1. **Access token em `sessionStorage`** — expirava sem refresh agendado (bug no bootstrap com sessão “válida”).
2. **Rotação de refresh token** — requisições concorrentes (abas, timer proativo + 401) invalidavam o token recém-revogado → 401 → logout.
3. **Logout agressivo** — falha de rede no bootstrap era tratada como sessão inválida.
4. **`SameSite=None` desnecessário** — com proxy `/api` same-origin, `Lax` é mais confiável.

## Decisão

### Cookies HttpOnly (persistência real)

- `bc_access` — JWT de acesso (15 min), HttpOnly, Secure, SameSite=Lax (same-origin).
- `bc_refresh` — refresh rotativo (30 dias), mesmas flags.
- Tokens **não** são mais persistidos em `sessionStorage`.
- Cache de UI: apenas `user` em `localStorage` (`bc_user_cache`) para exibição instantânea.

### Backend

- `GET /auth/session` — valida cookie de access sem rotacionar refresh (bootstrap leve).
- `POST /auth/refresh` — rotaciona refresh; **grace period de 60s** para token recém-revogado (race entre abas).
- `authPlugin` lê `bc_access` do cookie (fallback: header Bearer).
- Rate limit dedicado em refresh: **20 req/min/IP** (anti-abuso).

### Frontend

- Bootstrap: `GET /auth/session` → se 401, `POST /auth/refresh`; retry com backoff em erro de rede.
- **Nunca desloga** por falha de rede — retry em background (30s) e ao retornar à aba (`visibilitychange`).
- Refresh proativo **2 min antes** da expiração; se falhar, agenda retry em vez de abandonar.
- Logout explícito apenas em **401 irrecuperável** (`onUnauthorized`).

## Consequências

- Sessão persiste entre reloads, abas e fechamento do browser (até expirar refresh cookie).
- Menor superfície XSS (access token fora do JS).
- Refresh tokens mantidos (mais seguro que JWT longo único); rotação com grace evita logout acidental.
- Compatível com proxy Vercel `/api` existente.

## Alternativa descartada

Remover refresh tokens e usar JWT longo (7d) no cookie — rejeitado por janela de exposição maior se cookie vazar.

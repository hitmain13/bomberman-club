# ADR 0012 — Bootstrap de auth não bloqueante e proxy same-origin

## Status

Aceito

## Contexto

A página levava ~18s para carregar após refresh e emitia até 4 POST `/auth/refresh` 401. A causa era:

1. `refreshSessionWithRetry` com backoff de 17s (`[0, 2s, 5s, 10s]`) bloqueando `isLoading`.
2. Cookie `bc_refresh` HttpOnly não chegava cross-origin (Vercel → Render), fazendo refresh retornar 401.
3. Snapshot em `sessionStorage` restaurava usuário mesmo com access token expirado.

## Decisão

1. **Bootstrap não bloqueante**
   - Se `readPersistedSession()` é válido (access token não expirou): mostrar UI imediatamente.
   - Se expirou: mostrar snapshot e executar refresh **em background** (retry só para erros de rede; 401 não é retentado).
   - `isLoading` vira `false` rapidamente em todos os casos.
2. **Refresh proativo**
   - Timer agendado 60s antes da expiração do access token para renovar silenciosamente.
3. **Proxy same-origin na Vercel**
   - Rewrites `/api/*` → API Render.
   - `apiClient` no browser usa `/api` quando `NEXT_PUBLIC_API_URL` é absoluta; cookies passam a ser first-party.
4. **HttpClient robusto**
   - `tryRefreshAccessToken` não chama `onUnauthorized` em erro de rede; só em 401 irrecuperável.

## Consequências

- Refresh da página: <1s de loading em vez de ~18s.
- Sessão persistente e confiável em produção cross-origin.
- Sem polling; refresh baseado em eventos (bootstrap, expiração, 401).

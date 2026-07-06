# ADR 0011 — Sessão resiliente e filtros na URL

## Status

Aceito

## Contexto

1. Após cold start do Render, o refresh podia falhar na primeira tentativa e `readPersistedSession` descartava o snapshot quando o access token (15 min) expirava — mesmo com refresh cookie válido (30 dias).
2. Filtros em feed, mapa, flagrados e ranking viviam apenas em `useState`, impedindo compartilhamento e restauração via URL.

## Decisão

**Sessão**

- `readPersistedUserSnapshot()` — mantém user/accessToken no `sessionStorage` independentemente da expiração do access token.
- `refreshSessionWithRetry()` — backoff [0, 2s, 5s, 10s] no bootstrap.
- Bootstrap: retry refresh → fallback snapshot → clear apenas se ambos falharem.

**Query strings**

- Hook `useFilterParams` + `parseEnumParam` com schemas Zod de `@bomberman/types`.
- Parâmetros: `scope` (feed), `period` (mapa/flagrados), `metric` (ranking); explore já usava `type`, `q`, filtros.

## Consequências

- Usuário não percebe reinício do backend quando refresh cookie é válido.
- Links filtrados são compartilháveis e compatíveis com histórico do navegador.

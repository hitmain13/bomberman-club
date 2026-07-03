# Test Plan

## Unit — Backend

- `explore.mapper.test.ts`: `toExplorePerson` (com/sem avatar, contadores, isFollowedByMe) e `toExploreCar` (owner leve). ✅ 3 testes.

## Unit — Frontend

- `BottomSheet.test.tsx`: fechado não renderiza; aberto mostra título/conteúdo e chama onClose.
- `FollowButton.test.tsx`: estado inicial via prop `initialFollowing` (regressão do bug corrigido).
- `ProfileStats.test.tsx`: grid se adapta a 4 colunas.
- `CarCard.test.tsx`: renderiza (ou não) a linha de proprietário conforme prop `owner`.
- `PersonListItem.test.tsx`, `FeaturedPeopleRail.test.tsx`: renderização de dados mock.
- `PeopleFiltersSheet.test.tsx` (+ `memberSinceToIso` util): aplica draft editado; conversão de período para ISO.
- `CarsFiltersSheet.test.tsx`: aplica mudança de ordenação.
- `ProfileAboutTab.test.tsx`: bio/cidade presentes vs fallback vazio.
- `ProfileLikesTab.test.tsx`: smoke test de export (dados via hook, sem mock de rede neste nível).

## Integration / E2E

Não executado nesta rodada — ambiente sem Postgres acessível (Docker Desktop com integração WSL indisponível na sessão). Ver `.progress/known-issues.md`.

## Browser QA

Não executado ao vivo pelo mesmo motivo. Compensado por: typecheck estrito limpo (`apps/api` + `apps/web` + `packages/types` + `packages/sdk`), Biome limpo, 75 testes unitários verdes (12 backend + 63 frontend), `next build` verde com 26 rotas.

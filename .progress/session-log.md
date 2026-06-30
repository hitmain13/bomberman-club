# Session Log

## 2026-06-30 — Sessão 2 (continuação após troca de git user)

### Objetivo

Reescrever autoria dos commits para o user pessoal e finalizar M9 → M13.

### Concluído

- `git rebase --root --exec "git commit --amend --no-edit --reset-author"` reaplicou os 9 commits anteriores com `Fabio Matsumoto <fabio.matsumoto.dev@gmail.com>`.
- M9 Uploads + Sightings (backend + SDK + frontend completo).
- M10 Map com Leaflet via `next/dynamic` (ssr: false), mantendo bundle compartilhado em 106 kB.
- M11 Social polimórfico (likes, favorites, comments, follows, notifications) com side-effects automáticos de Notification.
- M12 Discovery (feed scoped, ranking 4 métricas, search/explore multi-recurso).
- M13 Settings (tela 20 do wireframe) + QA final.

### Resultado

- 25 rotas no Next, 55 testes verdes, typecheck/biome/build limpos.
- Todas as 21 telas do wireframe implementadas.
- 14 commits Conventional Commits.

### Decisões emergentes

- S3 client implementado via AWS Signature v4 + `fetch` direto (sem AWS SDK) para manter o bundle do backend leve.
- `Like`/`Favorite`/`Comment` reutilizam o mesmo modelo polimórfico (TargetType: PROFILE | CAR | SIGHTING).
- Feed merge é feito em runtime (sem tabela materializada); cache pode ser adicionado em V1.1.

### Próximos passos

- Subir docker compose, rodar `prisma migrate deploy` e `prisma db seed`.
- Smoke test manual no browser (não foi possível nesta sessão por falta de Docker no ambiente).
- Lighthouse após primeiro deploy.

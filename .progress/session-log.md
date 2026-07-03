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

## 2026-07-03 — Sessão 3 (feature 013: Explore Social)

### Objetivo

Expandir o módulo Explorar para navegação social entre membros e carros, seguindo pipeline SDD completo (análise arquitetural → spec → database → backend → SDK → frontend → stories → testes → QA → docs).

### Análise arquitetural (antes de codar)

- Auditoria de reuso: `CarCard`, `SightingCard`, `StatePanel`, `FollowButton`, `ProfileHeader`, `ProfileTabs`, `paginatedResponseSchema`, `DiscoveryResource`, hooks de padrão similar (`useSearch`/`useFeed`) — todos reaproveitados/estendidos, nada duplicado.
- Auditoria de violação de arquitetura via `grep "@/database/prisma"`: encontradas 3 violações fora de `discovery` (`follows.service.ts`, `target-owner.service.ts`, `auth.service.ts`) além das 3 já conhecidas em `discovery`. Todas as 6 corrigidas nesta sessão.
- Decisão de colocar `ProfileStatsService`/`LikedItemsService` em `discovery` (não em `users`/`social`) para evitar dependência circular — documentado em ADR 0008 com grafo de dependências.

### Concluído

- **Backend**: `DiscoveryRepository` novo (consolida acesso Prisma de feed/ranking/search/explore); `ExplorePeopleService`, `ExploreCarsService`, `ProfileStatsService`, `LikedItemsService` novos; `GET /explore/people`, `GET /explore/cars`, `GET /users/:username/stats`, `GET /users/:username/likes`. Zero migrations (100% agregação Prisma: `_count`, join EAV para stage, polimorfismo para likes).
- **SDK**: `DiscoveryResource.explorePeople/exploreCars`, `UsersResource.stats/likedItems`.
- **Frontend**: `BottomSheet` extraído (refatorando `LocationPicker`); `PersonListItem`, `FeaturedPeopleRail`, `PeopleFiltersSheet`, `CarsFiltersSheet` (novos); `CarCard` estendido com `owner`; `FollowButton` corrigido (bug: sempre mostrava "Seguir"); `ProfileStats` generalizado para 2-4 colunas; `ProfileAboutTab`, `ProfileLikesTab` novos; ícone `filter` adicionado ao átomo `Icon`; `/explore` reescrito (4 abas + modo busca + modo navegação); `/u/[username]` e `/me` com estatísticas reais e abas Sobre/Carros/Flagrados/Curtidas.
- **Docs**: `docs/specs/013-explore-social/` completo, ADR 0008, `.cursor/rules/20-clean-architecture.mdc` e `.ai/rules/architecture.md` atualizados com o grafo de dependências entre módulos.

### Resultado

- 75 testes unitários verdes (63 web + 12 api), typecheck limpo em 4 pacotes, Biome limpo (540 arquivos), `next build` verde (26 rotas).
- Browser QA ao vivo **não realizado** (Docker indisponível nesta sessão de shell) — registrado em known-issues.md com checklist para a próxima sessão com Postgres acessível.

### Decisões emergentes

- Módulo `discovery` formalizado como "read-model layer" cross-context — nenhum módulo de domínio pode importar dele, mas ele pode importar de todos.
- Banner de perfil e "último acesso" avaliados e conscientemente adiados por ausência nos wireframes pixel (regra hard do projeto) — evita migration especulativa.
- Ordenação de Pessoas por "mais carros" descartada por inviabilidade de paginação por cursor sem SQL raw/coluna desnormalizada.

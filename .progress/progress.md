# Progress

## Concluído (M0–M13 + Feature 013)

- **M0** Governança: regras (.cursor/rules, .ai/rules), skills, docs SDD, 7 ADRs.
- **M1** Infra: Bun + Turborepo + Biome + docker-compose + lefthook + commitlint + CI Actions.
- **M2** Banco: Prisma schema completo (16 models + 5 enums), seed (12 part categories + 13 spec definitions), migration init.
- **M3** Backend core: Elysia + plugins (cors, security-headers, rate-limit, jwt, swagger, error-handler, logger) + módulos auth (JWT + refresh rotativo + argon2id) e users.
- **M4** Frontend foundation: Next 15 + Tailwind v4 (@theme tokens) + providers TanStack/Auth + atoms (Button, Spinner, Input, Avatar, Logo, Text, Icon 15 ícones, Badge) + molecules (FormField, MetricItem) + organisms (BottomNav, StatePanel) + AppShell.
- **M5** Feature 001-auth: Splash, Login, Registro, Recuperar senha + AuthLayout + SocialButtons placeholder.
- **M6** Feature 002-profile: /me, /me/edit, /u/[username] + ProfileHeader/Stats/Tabs/EditForm.
- **M7** Feature 003-garage: backend Garages + Cars CRUD com CarBuilder + CarCard/CarList + páginas /me/cars e /u/[username]/cars.
- **M8** Features 004-cars + 005-specs-parts: catalog module + EAV runtime validation + CarDetailHeader/MetricsGrid/PartsList/SpecsList/CarForm/AddCarPartForm/SetCarSpecForm + /cars/[id], /me/cars/new, /me/cars/[id]/{edit,parts,specs}.
- **M9** Features 006-uploads + 007-sightings: magic-number + S3 v4 signature (sem AWS SDK) + período (TODAY/WEEK/MONTH/YEAR/ALL) + SightingCard/PeriodTabs/NewSightingForm + /sightings, /sightings/[id], /sightings/new.
- **M10** Feature 008-map: Leaflet via dynamic import + /map com filtros.
- **M11** Feature 010-social: comments/likes/favorites/follows/notifications polimórficos + LikeButton/CommentsThread/FollowButton/NotificationsList + /notifications.
- **M12** Feature 012-discovery: feed scoped (FORYOU/FOLLOWING/RECENT), ranking (4 métricas), search/explore (people/cars/sightings) + páginas /feed, /ranking, /explore.
- **M13** Settings (tela 20) + QA final.
- **Feature 013** Explore Social: navegação social completa (Pessoas/Carros/Flagrados) no Explorar, perfil público enriquecido (estatísticas reais + abas Sobre/Carros/Flagrados/Curtidas). Ver `docs/specs/013-explore-social/` e ADR 0008.
- **Platform Improvements V1**: persistência de sessão (retry + snapshot), keep-alive Render, filtros na URL, cleanup S3 em deletes, compressão otimizada, Explorar "Tudo" agregado, fix upload múltiplo. ADRs 0009–0011.

## Métricas finais

- **TypeScript strict total**: zero `any`/`unknown`/`as`. `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`.
- **Biome**: 540 arquivos sem warnings.
- **Testes**: 75 unitários (63 web + 12 api).
- **Build**: 26 rotas (18 estáticas + 8 dinâmicas), First Load JS shared 106 kB.
- **Commits**: 14 (Conventional Commits) autoria Fabio Matsumoto) + 1 pendente desta feature.
- **Specs SDD**: 12 (001-auth, 002-profile, 003-garage, 004-cars, 006-uploads, 007-sightings, 008-map, 010-social, 012-discovery, 013-explore-social).
- **Bounded contexts implementados**: Identity & Access, Garage, Configurability (EAV), Sightings, Media (Uploads), Social, Discovery (agora também read-model layer cross-context — ADR 0008).
- **Telas do wireframe**: 21/21 (wireframe original) + 10/10 (wireframe suplementar Pessoas & Carros) implementadas pixel-perfect.
- **Dívida técnica de layering zerada**: nenhum service no backend acessa Prisma fora de um Repository (auditoria completa via grep).

## Tabelas finais

User, RefreshToken, PasswordReset, Garage, Car, CarImage, Upload, SpecificationDefinition, CarSpecificationValue, PartCategory, Part, CarPart, Sighting, Follow, Comment (polimórfico), Like (polimórfico), Favorite (polimórfico), Notification. Nenhuma tabela nova na feature 013 (100% agregação sobre o schema existente).

## APIs

- `/auth/*` (register, login, refresh, logout)
- `/users/*` (me, byUsername, patch me, **stats**, **likes**)
- `/garages/mine`
- `/cars/*` (mine, get, create, patch, delete, parts CRUD, specs upsert)
- `/users/:username/cars`, `/users/:username/sightings`
- `/catalog/*` (part categories, parts by category, spec definitions)
- `/uploads/*` (multipart upload, get, delete owner)
- `/sightings/*` (list paginated com period, get, create, delete owner)
- `/likes/:type/:id/toggle`, `/favorites/:type/:id/toggle`
- `/comments/*`, `/follows/:username/toggle`
- `/notifications`, `/notifications/:id/read`
- `/feed`, `/ranking`, `/search`, **`/explore/people`**, **`/explore/cars`**
- `/health`
- `/docs` (Swagger em dev)

## Pendências para V1.1

- Storybook ainda não instalado (stories prontas em todas pastas).
- Lighthouse target ≥ 95 (a executar após deploy real).
- Integration tests com Testcontainers/Postgres.
- Browser QA ao vivo da feature 013 (ambiente sem Docker nesta sessão — ver known-issues.md).
- Login social Google/Apple real.
- Presigned URL client-side direct upload (atualmente server-side via multipart).
- Image processing pipeline (sharp resize/thumbnails).
- Push notifications real-time.
- Full-text search Postgres (atualmente substring `ilike`).
- Cluster de markers no mapa.
- Banner de perfil e "último acesso" (avaliados e adiados — ver ADR 0008).

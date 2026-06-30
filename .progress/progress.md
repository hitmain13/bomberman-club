# Progress

## Concluído (M0–M13)

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

## Métricas finais

- **TypeScript strict total**: zero `any`/`unknown`/`as`. `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`.
- **Biome**: 475 arquivos sem warnings.
- **Testes**: 55 unitários (46 web + 9 api).
- **Build**: 25 rotas (17 estáticas + 8 dinâmicas), First Load JS shared 106 kB.
- **Commits**: 14 (Conventional Commits) autoria Fabio Matsumoto.
- **Specs SDD**: 11 (001-auth, 002-profile, 003-garage, 004-cars, 006-uploads, 007-sightings, 008-map, 010-social, 012-discovery).
- **Bounded contexts implementados**: Identity & Access, Garage, Configurability (EAV), Sightings, Media (Uploads), Social, Discovery.
- **Telas do wireframe**: 21/21 implementadas pixel-perfect.

## Tabelas finais

User, RefreshToken, PasswordReset, Garage, Car, CarImage, Upload, SpecificationDefinition, CarSpecificationValue, PartCategory, Part, CarPart, Sighting, Follow, Comment (polimórfico), Like (polimórfico), Favorite (polimórfico), Notification.

## APIs

- `/auth/*` (register, login, refresh, logout)
- `/users/*` (me, byUsername, patch me)
- `/garages/mine`
- `/cars/*` (mine, get, create, patch, delete, parts CRUD, specs upsert)
- `/users/:username/cars`
- `/catalog/*` (part categories, parts by category, spec definitions)
- `/uploads/*` (multipart upload, get, delete owner)
- `/sightings/*` (list paginated com period, get, create, delete owner)
- `/likes/:type/:id/toggle`, `/favorites/:type/:id/toggle`
- `/comments/*`, `/follows/:username/toggle`
- `/notifications`, `/notifications/:id/read`
- `/feed`, `/ranking`, `/search`
- `/health`
- `/docs` (Swagger em dev)

## Pendências para V1.1

- Storybook ainda não instalado (stories prontas em todas pastas).
- Lighthouse target ≥ 95 (a executar após deploy real).
- Integration tests com Testcontainers/Postgres.
- Login social Google/Apple real.
- Presigned URL client-side direct upload (atualmente server-side via multipart).
- Image processing pipeline (sharp resize/thumbnails).
- Push notifications real-time.
- Full-text search Postgres (atualmente substring `ilike`).
- Cluster de markers no mapa.

# Progress

## Concluído

- M0: Governança (regras, skills, SDD docs, ADRs 0001-0007).
- M1: Infraestrutura (Bun + Turbo + Biome + docker-compose + lefthook + commitlint + CI).
- M2: Banco (Prisma schema completo, seed de PartCategory e SpecificationDefinition, migration inicial).
- M3: Backend core (Elysia, plugins, errors, auth + users módulos).
- M4: Frontend foundation (Next 15, Tailwind v4, providers TanStack/Auth, atoms Button/Input/Avatar/Spinner/Logo/Text/Icon/Badge, molecules FormField/MetricItem, organisms BottomNav/StatePanel, template AppShell).
- M5: Feature 001-auth (Splash, Login, Registro, Recuperar senha, AuthLayout, SocialButtons placeholder).
- M6: Feature 002-profile (/me, /me/edit, /u/[username]) com ProfileHeader/Stats/Tabs/EditForm.
- M7: Feature 003-garage (backend Garages + Cars list/CRUD com CarBuilder; CarCard/CarList; páginas /me/cars e /u/[username]/cars; profile tabs com dados reais).
- M8: Feature 004-cars + 005-specs-parts (catalog module, car parts/specs com EAV; CarDetailHeader/MetricsGrid/PartsList/SpecsList/CarForm/AddCarPartForm/SetCarSpecForm; páginas /cars/[id], /me/cars/new, /me/cars/[id]/{edit,parts,specs}).

## Em andamento

_(nenhum — STOP M8 conforme combinado)_

## Pendente

- M9 Sightings (flagrados com foto + mapa pin).
- M10 Map (Leaflet + filtros Hoje/Semana/Mês/Ano).
- M11 Social (comments, likes, favorites, follows, notifications).
- M12 Ranking, Feed, Search.
- M13 QA Final + Lighthouse.

## Métricas atuais

- 37 testes unitários verdes (apps/web) + 6 (apps/api) = **43 testes**.
- Build Next: **18 rotas**, First Load JS 105 kB shared.
- TypeScript strict total (sem any/unknown/as).
- 8 commits Conventional Commits.

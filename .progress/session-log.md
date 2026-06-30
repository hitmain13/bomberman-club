# Session Log

## 2026-06-25 — Sessão 1

### Objetivo

Executar Milestones 1 a 8 sequencialmente (Infra → Database → Backend Core → Frontend Foundation → Auth → Profile → Garage → Cars). STOP após M8.

### Concluído

- M0 governança completa (.cursor/rules, .cursor/skills, .ai/rules, .ai/templates, docs/architecture + ADRs 0001-0007, docs/specs/001-005, .progress).
- M1 monorepo (Bun + Turbo + Biome + docker-compose + lefthook + commitlint + CI Actions).
- M2 packages compartilhados (design-tokens, types com Zod + enums + utils, sdk tipado) + Prisma schema completo + seed.
- M3 Elysia core (plugins error-handler, logger, cors, security-headers, rate-limit, swagger, auth) + módulos auth (JWT access + refresh rotativo + argon2id) e users.
- M4 Next 15 + Tailwind v4 (@tailwindcss/postcss + @theme) + atoms (Button, Spinner, Input, Avatar, Logo, Text, Icon, Badge) + molecules (FormField, MetricItem) + organisms (BottomNav, StatePanel) + template (AppShell) + providers (TanStack Query, Auth, RequireAuth).
- M5 Feature 001-auth (AuthLayout + LoginForm + RegisterForm + RecoverForm + SocialButtons placeholder) com pixel-perfect aproximação do wireframe; páginas /splash, /login, /register, /recover.
- M6 Feature 002-profile (ProfileHeader, ProfileStats, ProfileTabs, EditProfileForm) + páginas /me, /me/edit, /u/[username].
- M7 Feature 003-garage (backend Garages, Cars list/CRUD com CarBuilder pattern; CarCard + CarList; páginas /me/cars e /u/[username]/cars; tabs Carros nos perfis com dados reais).
- M8 Feature 004-cars + 005-specs-parts (Catalog module, CarParts/CarSpecs services com EAV validation runtime; CarDetailHeader, CarMetricsGrid, CarPartsList, CarSpecsList, CarForm, AddCarPartForm, SetCarSpecForm; páginas /cars/[id], /me/cars/new, /me/cars/[id]/edit, /me/cars/[id]/parts, /me/cars/[id]/specs).

### Próximos passos

- M9 Sightings (flagrados): backend module Sighting + Upload; frontend feature/sightings com /sightings, /sightings/[id], /me/sightings/new.
- M10 Map: Leaflet (dynamic import) com filtros Hoje/Semana/Mês/Ano.
- M11 Social: módulos comments, likes, favorites, follows, notifications (polimórficos) + UI.
- Implementar upload real S3/MinIO (cover de carro, avatar, foto de flagrado).

### Dificuldades / decisões

- React 19 removeu o namespace global JSX → criado polyfill em `src/types/jsx.d.ts`.
- `exactOptionalPropertyTypes: true` exige `string | undefined` explícito em props opcionais; alguns componentes foram ajustados.
- Storybook ainda não instalado nesta sessão; stories foram criadas no formato correto e excluídas do typecheck via `tsconfig.json`. Adicionar `@storybook/react` em M+ quando necessário.
- Login social (Google/Apple) entregue apenas como placeholder visual conforme wireframe — implementação real fica fora do escopo de V1.

### Decisões

Ver `decisions.md` e `docs/architecture/adr/`.

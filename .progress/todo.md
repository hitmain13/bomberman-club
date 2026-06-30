# TODO (próximas tarefas — V1.1)

## Operacional

- Subir docker compose (Postgres + Redis + MinIO).
- `bun run db:migrate && bun run db:seed`.
- Configurar `apps/api/.env` e `apps/web/.env.local` reais.
- Browser QA manual (testar todos fluxos do wireframe).
- Lighthouse `>= 95` em performance/a11y/best-practices/SEO.

## Hardening

- Storybook (todas as stories já estão prontas, basta `bun add -D` no `apps/web` e adicionar config).
- Integration tests via Testcontainers/Postgres real.
- E2E Playwright para fluxos críticos (login → criar carro → criar flagrado → curtir/comentar).
- Sentry/Datadog para observabilidade.

## Tooling

- Reativar `next dev --turbo` quando Turbopack passar a suportar o layout symlinked do Bun workspaces (issue tracker da Vercel). Webpack funcionando enquanto isso.

## V1.1 (produto)

- Login social Google/Apple real.
- Presigned URL client-side direct upload.
- Sharp pipeline (resize, thumbnails, blur placeholder).
- Push notifications real-time (WebPush/SSE).
- Comments threading.
- Full-text search Postgres (tsvector) e/ou OpenSearch.
- Cluster de markers no mapa.
- Ranking por likes/popularidade.
- Dark/Light theme switch.
- i18n (en-US além de pt-BR).

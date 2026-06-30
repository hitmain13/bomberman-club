# Deploy — Bomberman Club

Stack 100% gratuita (free tier perene, sem trial):

| Camada | Provider | Limite free |
| --- | --- | --- |
| Frontend (Next.js) | Vercel Hobby | ilimitado para uso pessoal |
| Backend (Elysia/Bun) | Fly.io | 3 VMs `shared-cpu-1x 256MB` grátis |
| Postgres | Neon | 3 GB storage, auto-suspend |
| Storage S3 | Cloudflare R2 | 10 GB + 0 custo de egress |

> Alternativa ao Fly: **Render Free** (`render.yaml` já incluído; hiberna após 15 min ocioso). Não recomendado para produção real, mas serve para validar.

---

## 1. Cloudflare R2 — bucket para uploads

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Sign up (grátis, sem cartão).
2. **R2 Object Storage** → enable (não cobra até 10 GB).
3. **Create bucket** → name `bomberman-uploads`, location automatic.
4. No bucket → **Settings** → **Public access** → **Allow Access** → copia a URL pública (`https://pub-<hash>.r2.dev`).
5. **Manage R2 API Tokens** → **Create API token**:
   - Permissions: **Object Read & Write**
   - Specify bucket: `bomberman-uploads`
   - TTL: forever
   - Copia `Access Key ID` e `Secret Access Key`.
6. Anota o **Account ID** (canto superior direito do dashboard).

Resultado — você tem:

```
S3_ENDPOINT=https://<accountId>.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=<token-key>
S3_SECRET_ACCESS_KEY=<token-secret>
S3_BUCKET=bomberman-uploads
S3_PUBLIC_BASE_URL=https://pub-<hash>.r2.dev
```

---

## 2. Neon — Postgres

1. [neon.tech](https://neon.tech) → Sign up com GitHub.
2. **New Project** → name `bomberman-club`, region São Paulo (sa-east-1) ou Ohio (us-east-2), Postgres 16.
3. Copia a **Connection string** (formato `postgresql://user:pass@ep-...neon.tech/neondb?sslmode=require`).
4. Cola em `DATABASE_URL`.

---

## 3. Backend — Fly.io

### 3.1 Instalar `flyctl`

```bash
curl -L https://fly.io/install.sh | sh
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
fly version
```

### 3.2 Login e criar app

```bash
fly auth login                                  # abre o navegador
cd /home/matsu/projects/bomberman-club/apps/api
fly launch --no-deploy --copy-config            # respeita o fly.toml já versionado
```

Quando perguntar:

- App name: `bomberman-api` (ou outro disponível).
- Region: `gru` (Brasil).
- Postgres: **No** (usamos Neon).
- Redis: **No**.
- Deploy now: **No** (precisamos setar secrets antes).

### 3.3 Setar secrets

```bash
# gera secrets fortes
ACCESS=$(openssl rand -hex 48)
REFRESH=$(openssl rand -hex 48)

fly secrets set \
  API_BASE_URL=https://bomberman-api.fly.dev \
  WEB_ORIGIN=https://bomberman-club.vercel.app \
  DATABASE_URL='postgresql://...neon...?sslmode=require' \
  JWT_ACCESS_SECRET=$ACCESS \
  JWT_REFRESH_SECRET=$REFRESH \
  COOKIE_DOMAIN=bomberman-api.fly.dev \
  S3_ENDPOINT=https://<accountId>.r2.cloudflarestorage.com \
  S3_REGION=auto \
  S3_ACCESS_KEY_ID=<r2 key> \
  S3_SECRET_ACCESS_KEY=<r2 secret> \
  S3_BUCKET=bomberman-uploads \
  S3_PUBLIC_BASE_URL=https://pub-<hash>.r2.dev
```

### 3.4 Deploy

```bash
fly deploy
fly logs                            # acompanhar
curl https://bomberman-api.fly.dev/health
# → {"ok":true,"service":"bomberman-api"}
```

O `CMD` do Dockerfile já roda `prisma migrate deploy` antes de levantar a API, então o schema é aplicado automaticamente em cada deploy.

### 3.5 Seed do catálogo (uma vez só)

```bash
fly ssh console -C "bun run prisma/seed.ts"
```

---

## 4. Frontend — Vercel

### 4.1 Instalar `vercel` CLI (opcional, dá pra fazer pela UI também)

```bash
bun add -g vercel
vercel login
```

### 4.2 Deploy via CLI

```bash
cd /home/matsu/projects/bomberman-club
vercel link                         # vincula projeto (root do monorepo)
vercel env add NEXT_PUBLIC_API_URL production
# valor: https://bomberman-api.fly.dev
vercel --prod
```

### 4.3 Deploy via UI (alternativa)

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository (faz push do projeto no GitHub primeiro).
2. **Root Directory**: `apps/web`.
3. **Framework Preset**: Next.js (auto).
4. **Environment Variables**: `NEXT_PUBLIC_API_URL=https://bomberman-api.fly.dev`.
5. Deploy.

Após o primeiro deploy, anota a URL final (`https://bomberman-club.vercel.app` ou seu domínio custom) e atualiza o secret `WEB_ORIGIN` na Fly:

```bash
fly secrets set WEB_ORIGIN=https://bomberman-club.vercel.app -a bomberman-api
fly deploy
```

---

## 5. Verificação final

```bash
# health
curl https://bomberman-api.fly.dev/health

# CORS pré-flight
curl -i -X OPTIONS https://bomberman-api.fly.dev/auth/register \
  -H "Origin: https://bomberman-club.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

Abre a URL da Vercel no celular e testa:

1. Splash → Criar conta → Login.
2. /me → Editar perfil.
3. Adicionar carro → Adicionar peça → Definir spec.
4. Criar flagrado (com permissão de localização).
5. Curtir / comentar / seguir.
6. /map mostra os pins.

---

## Custos esperados

- **R$ 0,00/mês** com tráfego típico de hobby (até 100 MAU).
- Cresceu? Os 3 limites para ficar de olho:
  - Neon: 3 GB de Postgres.
  - R2: 10 GB de mídia + Class A operations grátis até 1M/mês.
  - Fly: 3 VMs × 256 MB grátis (passou disso, ~US$ 2/mês por VM extra).

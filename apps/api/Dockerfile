FROM oven/bun:1.3.9-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

# ───── deps stage ──────────────────────────────────────────────
FROM base AS deps
COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY packages/sdk/package.json packages/sdk/
COPY packages/design-tokens/package.json packages/design-tokens/
RUN bun install --frozen-lockfile --ignore-scripts

# ───── build stage ─────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun install --frozen-lockfile --ignore-scripts
RUN cd apps/api && bun run db:generate && bun run build

# ───── runtime stage ───────────────────────────────────────────
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/packages ./packages
COPY --from=build /app/package.json ./package.json

WORKDIR /app/apps/api
EXPOSE 3333
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3333/health || exit 1

CMD ["sh", "-c", "bun x prisma@5.22.0 migrate deploy --schema prisma/schema.prisma && bun run dist/main.js"]

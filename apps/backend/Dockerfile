FROM node:24-alpine AS base
RUN apk upgrade --no-cache
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY tsconfig.base.json ./
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/drizzle.config.ts ./apps/backend/
COPY apps/backend/src ./apps/backend/src
COPY apps/backend/tsconfig*.json ./apps/backend/

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter @node-monorepo/backend build
RUN pnpm deploy --filter @node-monorepo/backend --prod --legacy /deploy

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /deploy
USER nodejs
WORKDIR /deploy

FROM base AS api
EXPOSE 5000
CMD ["node", "dist/index.js"]

FROM base AS migrator
CMD ["node", "--import", "tsx/esm", "./node_modules/drizzle-kit/bin.cjs", "migrate"]

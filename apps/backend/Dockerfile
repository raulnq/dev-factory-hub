FROM node:24-alpine AS base
WORKDIR /app

COPY tsconfig.base.json ./

COPY apps/backend/package*.json apps/backend/drizzle.config.ts ./
COPY apps/backend/src ./src

# Copy all tsconfig files
COPY apps/backend/tsconfig*.json ./
RUN sed -i 's|"extends": "../../tsconfig.base.json"|"extends": "./tsconfig.base.json"|g' tsconfig.app.json

RUN npm install --ignore-scripts && npm run build && npm prune --omit=dev && npm cache clean --force
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

FROM base AS api
EXPOSE 3000
CMD ["node", "/app/dist/index.js"]

FROM base AS migrator
CMD ["npx", "tsx", "node_modules/drizzle-kit/bin.cjs", "migrate"]
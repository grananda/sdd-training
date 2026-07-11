# Backend Express — build TS -> dist y ejecución con Node (ESM).
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
# Manifiestos primero (mejor cacheo de capas)
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN pnpm install
# Código
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN pnpm --filter @aidd/shared build && pnpm --filter @aidd/api build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /app ./
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]

# Frontend React + Vite — build estático servido por Nginx.
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/
RUN pnpm install
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
RUN pnpm --filter @aidd/shared build && pnpm --filter @aidd/web build

FROM nginx:alpine AS runtime
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80

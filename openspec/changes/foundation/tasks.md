# Tareas — foundation

Orden por dependencia: raíz del monorepo → paquete compartido → apps → Docker → verificación. `node`/`pnpm` solo vía nvm: exportar el PATH antes de cada comando.

## 1. Raíz del monorepo

- [x] 1.1 Crear `package.json` raíz con workspaces pnpm y `engines` (node >=22), y `pnpm-workspace.yaml` con `apps/*` y `packages/*`
- [x] 1.2 Crear `turbo.json` con el pipeline `dev` (persistente, sin caché), `build`, `lint`, `test`; añadir el script raíz `pnpm dev` = `turbo run dev` (web+api en paralelo)
- [x] 1.3 Configurar TypeScript base compartido (`tsconfig` base en la raíz) y `.gitignore` (node_modules, dist, .env)
- [x] 1.4 Crear `.env.example` con `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAX_ATTACHMENT_SIZE_MB`, `PORT`, `WEB_ORIGIN` (sin secretos), con valores por defecto del modo nativo (`SMTP_HOST=localhost`, `SMTP_PORT=1025`, `WEB_ORIGIN=http://localhost:5173`) y comentarios del modo full Docker (`SMTP_HOST=mailpit`)
- [x] 1.5 Crear `README.md` del skeleton con las dos vías de arranque: (a) nativo — `docker compose up -d mailpit` + `pnpm dev`; (b) full — `docker compose up`. Nota: node/pnpm solo vía nvm

## 2. packages/shared

- [x] 2.1 Crear `packages/shared/package.json` y `tsconfig.json` del workspace
- [x] 2.2 Crear `src/index.ts` con export placeholder (sin contrato de email todavía) resoluble desde web y api

## 3. apps/api (Express + TypeScript)

- [x] 3.1 Inicializar `apps/api` con Express + TypeScript, `app.ts` y `server.ts` (arranque por `PORT`)
- [x] 3.2 Implementar `config/env.ts`: cargar `.env` con `dotenv` (sin pisar el entorno del proceso) y validar las variables con Zod
- [x] 3.3 Configurar `logger.ts` (pino) y middleware CORS restringido a `WEB_ORIGIN`
- [x] 3.4 Implementar la ruta `GET /api/health` → `200 { status: "ok" }`
- [x] 3.5 Configurar Vitest + Supertest con un test de integración de `/api/health` en verde

## 4. apps/web (React + Vite + TS + Tailwind v3)

- [x] 4.1 Inicializar `apps/web` con Vite + React + TypeScript
- [x] 4.2 Configurar Tailwind v3 (`tailwind.config.ts`) y `src/styles/tokens.css` con los design tokens base de la guía de estilos
- [x] 4.3 Crear `App.tsx`/`main.tsx` con una página placeholder en español, sin componentes de negocio
- [x] 4.4 Configurar Vitest + React Testing Library con un test trivial de render en verde

## 5. Docker y orquestación local

- [x] 5.1 Crear `apps/api/Dockerfile` y `apps/web/Dockerfile` basados en `node:22-alpine`
- [x] 5.2 Crear `docker-compose.yml` con servicios `web`, `api` y `mailpit` (`axllent/mailpit`, puertos 1025/8025); `api` con `depends_on: mailpit`, `environment: SMTP_HOST=mailpit` (override del `.env` de dev) y health-check sobre `/api/health`. Verificar que `docker compose up -d mailpit` arranca solo la infra

## 6. Verificación (criterios de cierre)

- [x] 6.1 `pnpm install` en la raíz instala todos los workspaces sin error
- [x] 6.2 `pnpm build` y `pnpm test` pasan en verde vía Turborepo
- [x] 6.3 Modo full: `docker compose up` levanta web + api + Mailpit; `curl http://localhost:<PORT>/api/health` devuelve `{ "status": "ok" }`
- [x] 6.4 Modo nativo: `docker compose up -d mailpit` + `pnpm dev` levanta web+api nativos; `curl http://localhost:<PORT>/api/health` devuelve `{ "status": "ok" }` y Mailpit responde en `localhost:8025`
- [x] 6.5 Revisar que `.env.example` no contiene secretos y que `apps/api` no hardcodea configuración

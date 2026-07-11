# Propuesta — foundation

> Historias: HU-01, HU-02 (F0). Fase 1 del `docs/roadmap.md`. Sprint 1 (10–14 ago 2026).
> Jira: Stories `AT-1` (HU-01, principal) y `AT-2` (HU-02).

## Why

El repositorio solo contiene documentación AIDD aprobada; no existe código de aplicación. Antes de construir cualquier funcionalidad del remitente (formulario, envío SMTP, validaciones) hace falta el **walking skeleton**: un monorepo ejecutable y un entorno local reproducible con Docker. Sin esta base técnica, ninguna HU de F1–F4 puede arrancar.

## What Changes

- Se crea el **monorepo Turborepo + pnpm** con tres workspaces: `apps/web` (React + Vite + TypeScript + Tailwind v3), `apps/api` (Express + TypeScript) y `packages/shared` (tipos/validaciones compartidas, con estructura mínima; el contrato de email se rellena en fases posteriores).
- Se añade el **pipeline de tareas de Turborepo** (`dev`, `build`, `lint`, `test`) y la configuración de workspaces de pnpm.
- Se configura el **harness de tests** como parte del esqueleto: Vitest + React Testing Library en `apps/web` y Vitest + Supertest en `apps/api`, cada uno con un test trivial en verde (sin lógica de negocio todavía).
- Se expone en `apps/api` un endpoint **`GET /api/health`** que responde `200 { status: "ok" }`, para verificar el skeleton y orquestar en Docker.
- Se añade **Docker Compose** para levantar en local `web` + `api` + **Mailpit** (`axllent/mailpit`, SMTP `1025`, UI `8025`), con un **Dockerfile** por app basado en `node:22-alpine`.
- Se habilita un **modo de desarrollo híbrido**: `docker compose up` levanta todo (modo full, verificación de HU-02), y el inner-loop rápido se hace con `docker compose up -d mailpit` (solo la infra) + **`pnpm dev`** (turbo `dev` de `web`+`api` en paralelo, nativo). Mailpit y cualquier dependencia futura (BD, etc.) corren **siempre en Docker**; solo el código de la app se itera nativo. (Ver `decisions.md` → `ejecucion-hibrida-dev`.)
- Se añade la **configuración por variables de entorno**: carga (`dotenv`) y validación de env en `apps/api` (Zod) y un **`.env.example`** que documenta `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAX_ATTACHMENT_SIZE_MB`, `PORT` y `WEB_ORIGIN` **sin secretos reales**, con valores por defecto válidos para el modo nativo (`SMTP_HOST=localhost`, `WEB_ORIGIN=http://localhost:5173`).
- Se añade un **README** del skeleton que documenta los dos modos de arranque (nativo con `pnpm dev` + Mailpit en Docker; y full con `docker compose up`).
- Se configura **CORS** en `apps/api` restringido a `WEB_ORIGIN`, de modo que la web pueda invocar al backend en local.
- Se añaden los **design tokens base** (`apps/web/src/styles/tokens.css` + `tailwind.config.ts`) de `docs/guia-estilos.md`, sin construir aún componentes de negocio.

**Sin lógica de negocio en esta fase:** no hay formulario funcional, ni endpoint de envío (`POST /api/send`), ni Nodemailer, ni saneamiento, ni validaciones de dominio. Eso llega en fases 2+.

## Capabilities

### New Capabilities

- `monorepo-scaffolding`: estructura del monorepo Turborepo + pnpm con los workspaces `apps/web`, `apps/api` y `packages/shared`; toolchain de TypeScript, Tailwind v3 y el harness de tests. Cubre HU-01.
- `local-dev-environment`: orquestación local con Docker Compose (`web` + `api` + Mailpit), configuración por variables de entorno con `.env.example` sin secretos, y CORS restringido a `WEB_ORIGIN`. Cubre HU-02.
- `api-health-check`: endpoint `GET /api/health` que confirma que el backend está vivo y sirve para el health-check de Docker y la verificación del skeleton.

### Modified Capabilities

Ninguna. `openspec/specs/` está vacío (es el primer change del proyecto).

## Impact

- **Código nuevo (todo el esqueleto):** `apps/web/`, `apps/api/`, `packages/shared/`, `docker-compose.yml`, `turbo.json`, `package.json` raíz, `pnpm-workspace.yaml`, `.env.example`, Dockerfiles.
- **Dependencias nuevas:** pnpm, Turborepo, React + Vite, Express, Tailwind v3, Vitest, React Testing Library, Supertest, Zod (para `env.ts`), pino. Imagen `axllent/mailpit` y `node:22-alpine` en Docker.
- **Sin persistencia, sin auth, sin CI** en este change.
- **Prerrequisito operativo:** `node`/`pnpm` disponibles vía nvm (exportar el PATH antes de `pnpm`/`turbo`). Docker + Docker Compose instalados tanto para el modo full (`docker compose up`) como para la infra del modo nativo (`docker compose up -d mailpit`).
- **Modo de ejecución:** el **despliegue** sigue siendo solo Docker (NFR-08); el modo nativo es exclusivamente el **inner-loop de desarrollo** de `web`+`api`. La infraestructura nunca se ejecuta fuera de Docker.
- **Desbloquea:** todas las fases siguientes del roadmap (2–7) construyen sobre esta base.

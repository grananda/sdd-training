# Diseño técnico — foundation

## Context

Primer change del proyecto: no hay código previo, solo documentación AIDD aprobada. La arquitectura definitiva (`docs/arquitectura-base.md`) ya fija el árbol de carpetas, el stack y las decisiones estructurales; este diseño no las reabre, solo concreta cómo se materializa el esqueleto y registra las preferencias resueltas en el pre-flight (`decisions.md`).

Restricciones no negociables (de `docs/requisitos.md` §5 y `CLAUDE.md`): TypeScript en front y back, Tailwind CSS, monorepo Turborepo + pnpm, despliegue solo local con Docker Compose, sin persistencia, credenciales SMTP solo por variables de entorno, UI en español. El entorno de desarrollo tiene `node`/`pnpm` únicamente vía nvm (hay que exportar el PATH antes de cualquier `pnpm`/`turbo`).

## Goals / Non-Goals

**Goals:**
- Monorepo ejecutable con `apps/web`, `apps/api` y `packages/shared` reconocidos por pnpm y Turborepo.
- `docker compose up` levanta `web` + `api` + Mailpit en local (modo full / verificación de HU-02).
- Inner-loop de desarrollo híbrido: `pnpm dev` arranca `web`+`api` nativos contra Mailpit corriendo en Docker (`docker compose up -d mailpit`).
- `GET /api/health` responde `200 { status: "ok" }` en ambos modos.
- `.env.example` documenta todas las variables sin secretos; `apps/api` lee la config del entorno (validada con Zod), nunca del código.
- Harness de tests configurado (Vitest + RTL en web, Vitest + Supertest en api) con al menos un test en verde.
- Design tokens base de la guía de estilos cableados en Tailwind, sin componentes de negocio.

**Non-Goals:**
- Cualquier lógica de negocio: formulario funcional, `POST /api/send`, Nodemailer, saneamiento, validaciones de dominio (fases 2+).
- Contrato de email en `packages/shared` (solo estructura mínima ahora; el `email.schema.ts` real llega en fases 3/5/6).
- CI/CD, despliegue cloud, persistencia, auth, anti-abuso (fuera de alcance del producto).

## Decisions

- **Tailwind v3 con `tailwind.config.ts`** (no v4). *Alternativa:* v4 CSS-first. *Por qué:* coincide con el árbol de `arquitectura-base.md` §3 y es la vía estable con Vite y React Quill. Los tokens se cablean en `theme.extend` a partir de `styles/tokens.css`. (Ver `decisions.md`.)
- **Vite como bundler/dev-server de `apps/web`.** *Alternativa:* CRA (obsoleto), Next.js (SSR innecesario para una sola pantalla). *Por qué:* SPA ligera, arranque rápido, es lo que fija la arquitectura (§11, §3 `vite.config.ts`).
- **Harness de tests montado en foundation** (Vitest + RTL en web, Vitest + Supertest en api), con un test trivial (`/api/health`) en verde. *Alternativa:* diferir a cada fase. *Por qué:* el DoD del Sprint 1 exige esos tres tipos de test; montar la infraestructura una vez evita re-trabajo. (Ver `decisions.md`.)
- **`node:22-alpine`** como imagen base de ambos Dockerfiles. *Alternativa:* 24 (no LTS) o 20 (más cerca del EOL). *Por qué:* LTS estable y ligera. (Ver `decisions.md`.)
- **Validación de env con Zod + carga con `dotenv` en `apps/api/config/env.ts`.** *Alternativa:* leer `process.env` sin validar / sin dotenv. *Por qué:* fallar rápido y claro si falta una variable; `dotenv` permite el arranque nativo (`pnpm dev`) leyendo `.env`, y como **no pisa** variables ya presentes en el entorno, es seguro también dentro de Docker (donde las vars vienen del `environment:` del compose).
- **Ejecución híbrida en desarrollo (app nativa, infra en Docker).** *Alternativa:* solo Docker (inner-loop lento, rebuild de imagen por cambio) o todo nativo (obligaría a instalar Mailpit fuera de Docker). *Por qué:* el usuario itera `web`+`api` con `pnpm dev` y deja Mailpit —y cualquier dependencia futura— en Docker. **No se usan Compose profiles para `web`/`api`**: quedarían fuera de `docker compose up` y romperían el criterio [IMPRESCINDIBLE] de HU-02. En su lugar, `docker compose up` levanta todo (full) y el modo nativo arranca solo la infra nombrando el servicio (`docker compose up -d mailpit`). El servicio `api` del compose full fija `environment: SMTP_HOST=mailpit` para sobreescribir el `localhost` que usa el `.env` de dev. Puertos: Vite en `5173` (nativo), `WEB_ORIGIN` por defecto `http://localhost:5173`. (Ver `decisions.md` → `ejecucion-hibrida-dev`.)
- **Mailpit en Compose** (`axllent/mailpit`, 1025/8025), arrancable de forma aislada. *Por qué:* permite el criterio de envío de fases posteriores sin proveedor real —tanto en full como en el inner-loop nativo—; decisión ya tomada en `arquitectura-base.md` §10 (decisión 6).
- **`packages/shared` con estructura mínima ahora** (`src/index.ts` con export placeholder + `package.json`), sin reglas de dominio. *Por qué:* deja el workspace resoluble por web/api desde ya, sin adelantar el contrato de email de fases futuras.

## Risks / Trade-offs

- **node/pnpm solo vía nvm** → si se ejecuta `pnpm`/`turbo` sin exportar el PATH, falla. *Mitigación:* documentarlo en el README del skeleton y exportar el PATH en cada comando (ya recogido en la memoria del proyecto).
- **Deriva entre Node local (v24) y la imagen Docker (22)** → comportamientos sutilmente distintos. *Mitigación:* ambos ≥22; fijar `engines` en `package.json` y usar la imagen LTS como referencia de CI futura.
- **Divergencia de `.env` entre modo nativo y full Docker** (p. ej. `SMTP_HOST` = `localhost` vs `mailpit`) → confusión al cambiar de modo. *Mitigación:* `.env.example` documenta ambos con comentarios; el compose full sobreescribe `SMTP_HOST=mailpit` en el servicio `api`, de modo que un único `.env` de dev sirve para el inner-loop y el compose no depende de él para ese valor.
- **Olvido de arrancar Mailpit antes de `pnpm dev`** → el envío (fases 2+) fallaría en local. *Mitigación:* README con la secuencia (`docker compose up -d mailpit` → `pnpm dev`); en foundation es inocuo porque `/api/health` no depende del SMTP.
- **Tailwind v3 quedará por detrás de v4** → deuda menor a futuro. *Mitigación:* aislar los tokens en `tokens.css`/`theme.extend`; una migración a v4 sería local a la capa de estilos.
- **Montar el harness de tests sin casos reales** → riesgo de tests triviales que no aportan. *Mitigación:* el único test de foundation es el de `/api/health`, que sí verifica el skeleton; las fases añaden cobertura real.

## Migration Plan

No aplica migración (proyecto nuevo, sin datos ni despliegue previo). Rollback = descartar el árbol creado. El change se valida ejecutando `pnpm install`, `pnpm build`, `pnpm test` y `docker compose up` + `curl /api/health`.

## Open Questions

- **Proveedor y credenciales SMTP de producción**: pendiente y **no bloqueante** para foundation (en dev se usa Mailpit). Heredado de `arquitectura-base.md` §13.

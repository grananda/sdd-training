# Decisiones — change `foundation`

Decisiones del pre-flight de apertura (`aisdd open change`). El resto del alcance está fijado por `docs/roadmap.md` (Fase 1), `docs/arquitectura-base.md` y `docs/detalle-historias-usuario.md` (HU-01, HU-02); aquí solo se registran las preferencias que no estaban cerradas.

## tailwind-v3

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: `docs/arquitectura-base.md` §3 lista `apps/web/tailwind.config.ts`; la guía de estilos aporta design tokens que hay que cablear.
- **Pregunta**: ¿Tailwind v3 o v4 en `apps/web`?
- **Opciones evaluadas**:
  - a) Tailwind v3 (config en `tailwind.config.ts`, tokens vía `theme.extend`)
  - b) Tailwind v4 (config CSS-first `@theme`, sin `tailwind.config.ts`)
- **Decisión**: a) Tailwind v3
- **Justificación**: coincide con el `tailwind.config.ts` del árbol de la arquitectura; estable y compatible con el ecosistema React/Vite y React Quill.

## test-harness-en-foundation

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: el `sprint-plan.md` (DoD Sprint 1) exige tests unit (shared), de componentes (RTL) e integración (Supertest); en foundation aún no hay lógica de negocio.
- **Pregunta**: ¿Montar el harness de tests ya en `foundation` (sin tests de negocio)?
- **Opciones evaluadas**:
  - a) Sí, configurar Vitest + React Testing Library (web) y Vitest + Supertest (api) ahora, con un test trivial en verde
  - b) No, diferir a cada fase
- **Decisión**: a) Configurar ahora
- **Justificación**: forma parte del walking skeleton; las fases siguientes solo añaden casos, sin re-montar infraestructura.

## node-base-image-22-alpine

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: los Dockerfiles de `apps/web` y `apps/api` necesitan una imagen base de Node.
- **Pregunta**: ¿Qué imagen base de Node en los Dockerfiles?
- **Opciones evaluadas**:
  - a) `node:22-alpine` (LTS)
  - b) `node:24-alpine`
  - c) `node:20-alpine` (LTS)
- **Decisión**: a) `node:22-alpine`
- **Justificación**: LTS estable y soportada durante toda la vida del proyecto de formación; alpine ligera.

## ejecucion-hibrida-dev

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: NFR-08 / `requisitos.md` §72 fijan el **despliegue** solo con Docker, pero no dicen nada del inner-loop de **desarrollo**. El usuario quiere iterar el código de la app de forma nativa dejando la infraestructura (Mailpit y cualquier dependencia futura tipo BD) siempre en Docker.
- **Pregunta**: ¿Cómo se ejecuta el sistema en desarrollo local sin containerizar la app?
- **Opciones evaluadas**:
  - a) Solo Docker (también en desarrollo)
  - b) Ejecución híbrida: `pnpm dev` para `web`+`api` nativos; Mailpit/infra siempre en Docker
  - c) Solo documentar un README best-effort
- **Decisión**: b) Ejecución híbrida (app nativa, infra en Docker)
- **Justificación**: inner-loop rápido sin contradecir NFR-08 (que es *despliegue*, no *desarrollo*). Mailpit y futuras dependencias corren en Docker; la app se itera con `pnpm dev`.
- **Cómo se materializa (sin romper HU-02)**:
  - `docker compose up` sigue levantando **web + api + mailpit** → cumple el criterio **[IMPRESCINDIBLE]** de HU-02 (modo full / verificación).
  - Inner-loop nativo: `docker compose up -d mailpit` (solo la infra) + `pnpm dev` (turbo `dev` de web+api en paralelo). **No** se ponen `web`/`api` tras un profile (romperían HU-02); se arranca solo el servicio de infra nombrándolo.
  - `apps/api/config/env.ts` carga `dotenv` antes de validar con Zod; dotenv **no pisa** variables ya presentes en el entorno, así que es seguro también en Docker.
  - `.env.example` trae por defecto valores del modo nativo (`SMTP_HOST=localhost`, `SMTP_PORT=1025`, `WEB_ORIGIN=http://localhost:5173`); el servicio `api` del compose full sobreescribe `SMTP_HOST=mailpit` vía `environment:`.

## preflight-implement-sin-dudas

- **Fecha**: 2026-07-11
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: pre-flight de `aisdd implement change foundation`; artefactos (proposal/design/specs/tasks/decisions) completos y validados `--strict`.
- **Pregunta**: No se detectaron dudas bloqueantes durante el pre-flight de implementación.
- **Decision**: continuar
- **Justificación**: las decisiones restantes son de implementación, reversibles y ya implícitas en el stack decidido. Se registran como auto-default: **ESM** (`"type": "module"`) en los tres workspaces (coherente con Vite); **`tsx`** para el arranque en desarrollo de `apps/api` y **`tsc`** para el build; **pnpm** fijado con `packageManager` (corepack); Vitest con entorno `node` en api y `jsdom` en web.

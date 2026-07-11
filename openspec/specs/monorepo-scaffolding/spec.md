# monorepo-scaffolding Specification

## Purpose
TBD - created by archiving change foundation. Update Purpose after archive.
## Requirements
### Requirement: Instalación de dependencias del monorepo
El sistema SHALL estar organizado como un monorepo pnpm con workspaces, de modo que una única instalación en la raíz resuelva las dependencias de todos los paquetes.

#### Scenario: Instalación en la raíz
- **WHEN** se ejecuta `pnpm install` en la raíz del repositorio
- **THEN** se instalan las dependencias de todos los workspaces sin error

#### Scenario: Resolución del paquete compartido vía workspace
- **WHEN** `apps/web` o `apps/api` importan desde `packages/shared`
- **THEN** la importación se resuelve a través del workspace, sin publicar el paquete

### Requirement: Workspaces reconocidos por pnpm y Turborepo
El monorepo SHALL declarar los workspaces `apps/web`, `apps/api` y `packages/shared`, reconocidos tanto por pnpm (`pnpm-workspace.yaml`) como por Turborepo (`turbo.json`).

#### Scenario: Listado de workspaces
- **WHEN** se listan los workspaces del proyecto
- **THEN** existen `apps/web`, `apps/api` y `packages/shared` reconocidos por pnpm y Turborepo

#### Scenario: Pipeline de tareas de Turborepo
- **WHEN** se ejecuta una tarea de Turborepo (`dev`, `build`, `lint` o `test`) desde la raíz
- **THEN** Turborepo la orquesta sobre los workspaces que la definen

#### Scenario: Arranque nativo de la app en paralelo
- **WHEN** se ejecuta `pnpm dev` en la raíz
- **THEN** Turborepo levanta los servidores de desarrollo de `apps/web` y `apps/api` en paralelo, sin containerizar la app

### Requirement: Frontend React + TypeScript + Tailwind operativo
El workspace `apps/web` SHALL ser una aplicación React con TypeScript y Tailwind CSS v3, servida en desarrollo por Vite.

#### Scenario: Arranque del frontend en desarrollo
- **WHEN** se arranca `apps/web` en modo desarrollo
- **THEN** sirve una página React con TypeScript y Tailwind v3 operativos

#### Scenario: Design tokens base cableados
- **WHEN** se inspecciona la configuración de Tailwind de `apps/web`
- **THEN** `tailwind.config.ts` expone los design tokens base de la guía de estilos a partir de `src/styles/tokens.css`

### Requirement: Backend Express + TypeScript operativo
El workspace `apps/api` SHALL ser un servidor Express escrito en TypeScript que arranca y atiende peticiones HTTP.

#### Scenario: Arranque del backend
- **WHEN** se arranca `apps/api`
- **THEN** levanta un servidor Express en TypeScript escuchando en el puerto configurado por `PORT`

### Requirement: Harness de tests configurado
El monorepo SHALL incluir el harness de tests listo para usar: Vitest + React Testing Library en `apps/web` y Vitest + Supertest en `apps/api`, cada uno con al menos un test en verde.

#### Scenario: Ejecución de la suite de tests
- **WHEN** se ejecuta `pnpm test` desde la raíz
- **THEN** las suites de `apps/web` y `apps/api` se ejecutan y pasan (incluido el test del health-check)


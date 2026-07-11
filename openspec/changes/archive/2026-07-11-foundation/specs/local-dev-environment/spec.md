# local-dev-environment

Orquestación local con Docker Compose y configuración por entorno. Cubre HU-02.

## ADDED Requirements

### Requirement: Levantar la aplicación con Docker Compose
El sistema SHALL proporcionar un `docker-compose.yml` que levante en local los servicios `web`, `api` y un capturador SMTP de desarrollo (Mailpit), cada app con su propio Dockerfile basado en `node:22-alpine`.

#### Scenario: docker compose up
- **WHEN** se ejecuta `docker compose up`
- **THEN** se levantan los servicios `web`, `api` y `mailpit` en local

#### Scenario: La web puede invocar al backend
- **WHEN** los servicios están arrancados y se accede a la URL del frontend
- **THEN** la web carga y puede invocar al backend, con CORS restringido a `WEB_ORIGIN`

#### Scenario: Mailpit disponible para desarrollo
- **WHEN** Docker Compose está arrancado
- **THEN** Mailpit expone el puerto SMTP `1025` y su UI web en el puerto `8025`

### Requirement: Modo de desarrollo híbrido (app nativa, infra en Docker)
El sistema SHALL permitir iterar el código de `web` y `api` de forma nativa con `pnpm dev` mientras la infraestructura (Mailpit y cualquier dependencia futura) se ejecuta en Docker, sin containerizar la app y sin comentar servicios del compose.

#### Scenario: Arranque de solo la infraestructura
- **WHEN** se ejecuta `docker compose up -d mailpit`
- **THEN** se levanta únicamente el servicio `mailpit` (sin `web` ni `api`), quedando disponible en `localhost:1025`/`8025` para el inner-loop nativo

#### Scenario: Inner-loop nativo contra la infra en Docker
- **WHEN** Mailpit está corriendo en Docker y se ejecuta `pnpm dev`
- **THEN** `web` y `api` arrancan nativos, `api` lee su configuración del `.env` y `GET /api/health` responde `200 { status: "ok" }`

#### Scenario: El despliegue no se ejecuta fuera de Docker
- **WHEN** se despliega la aplicación (no el inner-loop de desarrollo)
- **THEN** se usa exclusivamente Docker Compose (NFR-08); la ejecución nativa queda restringida al desarrollo de `web`/`api`

### Requirement: Configuración por variables de entorno
El backend SHALL leer toda su configuración de variables de entorno, nunca del código, y validarla al arrancar.

#### Scenario: Lectura de la configuración SMTP del entorno
- **WHEN** arranca `apps/api` con variables SMTP definidas en el entorno (`.env`)
- **THEN** las lee del entorno y no de valores hardcodeados en el código

#### Scenario: Carga de .env en arranque nativo
- **WHEN** se arranca `apps/api` de forma nativa (`pnpm dev`) con un fichero `.env` presente
- **THEN** `config/env.ts` carga las variables del `.env` con `dotenv` sin pisar las ya definidas en el entorno del proceso (p. ej. las inyectadas por Docker)

#### Scenario: Validación de la configuración al arrancar
- **WHEN** arranca `apps/api` y falta una variable de entorno requerida
- **THEN** la validación de configuración (Zod) falla de forma clara e impide un arranque en estado inconsistente

### Requirement: .env.example sin secretos
El repositorio SHALL incluir un `.env.example` que documente todas las variables de entorno (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAX_ATTACHMENT_SIZE_MB`, `PORT`, `WEB_ORIGIN`) sin valores secretos reales.

#### Scenario: Revisión del .env.example
- **WHEN** se revisa el `.env.example` del repositorio
- **THEN** documenta todas las variables requeridas sin incluir secretos reales

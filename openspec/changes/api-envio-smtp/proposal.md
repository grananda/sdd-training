# Propuesta — api-envio-smtp

> Historias: HU-03 (endpoint de envío con Nodemailer, M) y HU-04 (registro en logs del resultado, XS), fase F0.
> Fase 2 del `docs/roadmap.md`. Sprint 1 · MVP (10–14 ago 2026).
> Construye sobre el walking skeleton de `foundation` (specs `api-health-check`, `local-dev-environment`, `monorepo-scaffolding`).

## Why

El skeleton (`foundation`) deja `apps/api` con Express, carga y validación de env (`config/env.ts`), `logger` (pino), CORS y el health-check, pero **no envía correo**: no hay endpoint de envío ni transporter de Nodemailer. Esta fase añade el **núcleo del backend del remitente** — recibir una petición de envío y entregarla al servidor SMTP — que es la base sobre la que se apoyan el envío desde la UI (HU-15/HU-16, fase 4), la validación autoritativa (HU-18, fase 5), el adjunto (HU-11–13, fase 6) y el saneamiento (HU-17, fase 7).

## What Changes

- Se expone en `apps/api` el endpoint **`POST /api/send`** que acepta **`application/json`** con el contrato del correo: `to[]`, `cc[]?`, `bcc[]?`, `subject`, `body` (HTML). En esta fase **no** acepta adjunto ni `multipart/form-data` (el adjunto es la fase 6, HU-11–13).
- Se crea el **servicio `mailer`** (`services/mailer/mailer.ts`) con un **transporter de Nodemailer** construido **una sola vez** a partir de las variables de entorno ya validadas (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`) y reutilizado en cada envío. El correo se construye como **HTML** (`html`, a partir de `body`) desde `MAIL_FROM`.
- Se añade el **controlador** (`controllers/send.controller.ts`) y la **ruta** (`routes/send.route.ts`) que orquestan: leer el payload → enviar con el `mailer` → registrar en logs → responder.
- **Respuesta uniforme**: éxito → `200 { ok: true, message }`; fallo del SMTP → error controlado `5xx { ok: false, code, message }` **sin filtrar credenciales** ni datos sensibles, a través de un **error handler** de Express.
- **Logging del resultado (HU-04)**: en cada envío (éxito o error) `pino` registra **resultado, destinatarios (to/cc/bcc), asunto y timestamp**. **No** se registra el cuerpo del correo, ni datos de adjunto, ni las credenciales SMTP en claro (NFR-06).
- **Cambio de configuración sin recompilar (NFR-09)**: al reiniciar el servicio con nuevas variables SMTP, el envío usa la nueva configuración (el transporter se construye en el arranque a partir de env).
- **Tests** con el transporter de Nodemailer **stubbeado**: unitarios del `mailer` (éxito y error mapeado a respuesta controlada) e integración de la ruta con Supertest (200 en éxito, 5xx controlado en fallo, y aserción de que el log no contiene cuerpo ni secretos).

**Fuera de alcance de esta fase (llega en fases posteriores):**
- **Validación de dominio / autoritativa** (obligatorios, formato de direcciones, tipo/tamaño): **no** se implementa aquí. Se hace formalmente en sus HU — cliente en HU-08/HU-14 (fase... UI/validación) y autoritativa en servidor en **HU-18 (fase 5)**. En esta fase el endpoint consume el payload y lo entrega al mailer.
- **Saneamiento del HTML del cuerpo** (HU-17): fase 7. En esta fase el `body` se envía tal cual como `html`.
- **Adjunto** (HU-11–13) y `multipart/form-data`: fase 6.
- **Integración con la UI** (`useSendEmail`, `apiClient`, feedback): fase 4.

## Capabilities

### New Capabilities

- `email-sending`: endpoint `POST /api/send` que recibe el correo en JSON y lo entrega al servidor SMTP con Nodemailer (transporter construido desde env y reutilizado), con respuesta de éxito/error controlada sin filtrar secretos. Cubre HU-03.
- `send-logging`: registro operativo en logs (pino) del resultado de cada envío — resultado, destinatarios, asunto y timestamp — sin persistir el cuerpo del correo, datos de adjunto ni credenciales. Cubre HU-04.

### Modified Capabilities

Ninguna. Las capabilities de `foundation` (`api-health-check`, `local-dev-environment`, `monorepo-scaffolding`) no cambian su comportamiento; esta fase solo añade código nuevo sobre esa base.

## Impact

- **Código nuevo:** `apps/api/src/routes/send.route.ts`, `apps/api/src/controllers/send.controller.ts`, `apps/api/src/services/mailer/mailer.ts`, un error handler y el tipo del contrato de envío (en `packages/shared` o local si aún no procede compartirlo). Tests nuevos del `mailer` y de la ruta.
- **Dependencias nuevas:** `nodemailer` (y `@types/nodemailer`) en `apps/api`. El resto (Express, pino, Zod para env, Vitest, Supertest) ya está del skeleton.
- **Configuración:** reutiliza `SMTP_*` y `MAIL_FROM` de `.env.example`. En dev el envío entrega a **Mailpit** (`SMTP_HOST=mailpit`/`localhost`, `1025`), verificable en su UI (`8025`). Proveedor SMTP real: pendiente y configurable por env (no bloqueante).
- **Sin persistencia, sin auth, sin validación de dominio, sin adjunto** en este change.
- **Desbloquea:** el envío desde la UI (fase 4) y el endurecimiento del endpoint (validación fase 5, adjunto fase 6, saneamiento fase 7).

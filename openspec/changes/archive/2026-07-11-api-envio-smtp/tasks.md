# Tareas — api-envio-smtp

Orden por dependencia: dependencia y tipos → mailer → controlador/ruta → error handler y logging → wiring → verificación. `node`/`pnpm` solo vía nvm: exportar el PATH antes de cada comando.

## 1. Dependencias y contrato

- [x] 1.1 Añadir `nodemailer` y `@types/nodemailer` a `apps/api` (`pnpm --filter api add ...`)
- [x] 1.2 Definir el tipo `SendEmailRequest` (`to[]`, `cc[]?`, `bcc[]?`, `subject`, `body`) — local en `apps/api` (se promueve a `packages/shared` en la fase de UI si procede)

## 2. Servicio mailer (Nodemailer)

- [x] 2.1 Crear `services/mailer/mailer.ts`: construir el transporter **una vez** desde `env` (`host/port/secure/auth`), omitiendo `auth` si `SMTP_USER`/`SMTP_PASSWORD` están vacíos
- [x] 2.2 Implementar `send({ to, cc, bcc, subject, html })`: mensaje con `from: MAIL_FROM` y `html`; devolver resultado o propagar el error del transporter

## 3. Controlador, ruta y error handler

- [x] 3.1 Crear `controllers/send.controller.ts`: leer el payload del `req.body`, llamar a `mailer.send`, registrar el log de resultado y responder `200 { ok:true, message }`; en error, `next(err)`
- [x] 3.2 Crear `routes/send.route.ts`: `POST /api/send` con `express.json()` + controlador
- [x] 3.3 Crear el error handler de Express: responde `5xx { ok:false, code, message }` con mensaje genérico (sin filtrar credenciales); loggea el detalle técnico sin secretos
- [x] 3.4 Montar la ruta y el error handler en `app.ts` (junto al health-check)

## 4. Logging del resultado (HU-04)

- [x] 4.1 Registrar por envío (éxito o error) un log estructurado con allow-list de campos: `result`, `to`, `cc`, `bcc`, `subject`, timestamp — **sin** `body`, sin datos de adjunto, sin credenciales

## 5. Tests (transporter mockeado)

- [x] 5.1 Unit de `mailer`: stub de `nodemailer.createTransport`/transporter fake; verificar `from/to/cc/bcc/subject/html` y la propagación del error
- [x] 5.2 Integración de la ruta (Supertest): `200 { ok:true }` en éxito; `5xx { ok:false, code }` controlado en fallo del SMTP; spy del logger que asegura que el log lleva destinatarios/asunto y **no** el `body` ni credenciales

## 6. Verificación (criterios de cierre)

- [x] 6.1 `pnpm build` y `pnpm test` en verde vía Turborepo (sin depender de Mailpit)
- [x] 6.2 Prueba manual con Mailpit: `docker compose up -d mailpit` + `pnpm dev`; `POST /api/send` con payload válido → `200`; el correo aparece en la UI de Mailpit (`localhost:8025`) con el cuerpo como HTML
- [x] 6.3 Fallo controlado: con SMTP inaccesible, `POST /api/send` → `5xx { ok:false }` sin filtrar credenciales
- [x] 6.4 Revisar un log de envío: contiene resultado/destinatarios/asunto/timestamp y **no** el cuerpo ni secretos

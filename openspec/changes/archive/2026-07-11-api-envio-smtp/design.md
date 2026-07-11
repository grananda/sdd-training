# Diseño técnico — api-envio-smtp

> Alineado con `docs/arquitectura-base.md` §3–§11 (pipeline de `POST /api/send`, mailer, observabilidad). Solo la parte de esta fase: ruta + controlador + mailer + logging + error handler. Sin adjunto, sin validación de dominio, sin saneamiento.

## 1. Contexto y punto de partida

`foundation` dejó en `apps/api`:
- `config/env.ts` — carga `.env` con `dotenv` y valida con Zod las variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `PORT`, `WEB_ORIGIN`, `MAX_ATTACHMENT_SIZE_MB`).
- `logger.ts` — instancia de `pino`.
- CORS restringido a `WEB_ORIGIN`, `app.ts`/`server.ts` y `GET /api/health`.
- Harness Vitest + Supertest con un test de `/api/health` en verde.

Esta fase añade el primer endpoint con lógica de negocio: el envío.

## 2. Contrato del endpoint

`POST /api/send` — `Content-Type: application/json`.

Petición (cuerpo JSON):

```jsonc
{
  "to":  ["dest@ejemplo.com"],   // string[], destinatarios principales
  "cc":  [],                      // string[] opcional
  "bcc": [],                      // string[] opcional
  "subject": "Asunto",            // string
  "body": "<p>Hola <strong>mundo</strong></p>"  // string, HTML del cuerpo
}
```

Respuestas:

| Caso | Estado | Cuerpo |
|------|--------|--------|
| Envío entregado al SMTP | `200` | `{ "ok": true, "message": "Correo enviado" }` |
| Fallo del SMTP / error controlado | `5xx` | `{ "ok": false, "code": "SEND_FAILED", "message": "<mensaje genérico>" }` |

- **Decisión de fase**: no hay validación de dominio (obligatorios, formato de direcciones). El endpoint consume el payload tal cual y lo entrega al `mailer`. La validación autoritativa se añade en HU-18 (fase 5); la de cliente en HU-08/HU-14. Un JSON mal formado lo rechaza el parser de Express (`400`) sin lógica propia.
- El `body` se pasa como `html` **sin sanear** (el saneamiento es HU-17, fase 7).
- No se acepta adjunto ni `multipart/form-data` en esta fase (fase 6).

## 3. Pipeline (subconjunto de arquitectura §5)

```
send.route (POST /api/send)
  → express.json() (parser)
  → send.controller
      → mailer.send({ to, cc, bcc, subject, html })   // Nodemailer
      → logger (resultado, destinatarios, asunto, timestamp)   // pino
  → respuesta 200 { ok:true }
  → errorHandler → 5xx { ok:false, code, message } (sin secretos)
```

## 4. Módulos

### 4.1 `services/mailer/mailer.ts`
- Crea el **transporter** de Nodemailer **una vez** en la carga del módulo (o vía factory memoizada) a partir de `env`: `host`, `port`, `secure`, `auth: { user, pass }`. `auth` se omite si `SMTP_USER`/`SMTP_PASSWORD` están vacíos (Mailpit no requiere auth).
- Expone `send(mail)`: construye el mensaje (`from: MAIL_FROM`, `to`, `cc`, `bcc`, `subject`, `html`) y llama a `transporter.sendMail`. Devuelve el resultado (o lanza para que el controlador lo mapee a error controlado).
- **No** loggea secretos. **No** conoce Express (testeable en aislamiento).

### 4.2 `controllers/send.controller.ts`
- Handler async: extrae `to/cc/bcc/subject/body` del `req.body`, llama a `mailer.send`, registra el log de resultado y responde `200 { ok:true }`. En error, delega al `errorHandler` (`next(err)`).

### 4.3 `routes/send.route.ts`
- Registra `POST /api/send` con `express.json()` y el controlador. Se monta en `app.ts` junto al health-check.

### 4.4 Error handler
- Middleware de error de Express que responde `{ ok:false, code, message }` con un mensaje **genérico** (sin `err.message` crudo del SMTP si pudiera filtrar host/usuario). Loggea el detalle técnico por `pino` (nivel error) pero **nunca** credenciales.

### 4.5 Contrato de tipos
- Tipo `SendEmailRequest` (`to/cc/bcc/subject/body`). Se ubica en `packages/shared` si se quiere reutilizar desde `web` en fases posteriores; si no aporta aún, se define local en `apps/api` y se promueve en la fase de UI. Decisión registrada en `decisions.md`.

## 5. Logging (HU-04)

Por cada envío, un único log estructurado con:
- `result`: `"success" | "error"`
- `to`, `cc`, `bcc`: direcciones (metadato de enrutado, no contenido del mensaje)
- `subject`
- `timestamp` (lo añade pino)

**Prohibido** en el log: `body`/HTML del correo, cualquier dato de adjunto (aún no existe), y credenciales SMTP (`SMTP_PASSWORD`, `auth`). El objeto que se pasa a `pino` se construye explícitamente con esos campos (allow-list), no se vuelca el request entero.

## 6. Configuración y NFR-09

El transporter se construye desde `env` en el arranque. Reiniciar el proceso con nuevas `SMTP_*` hace que el siguiente envío use la nueva configuración **sin recompilar**. En dev, `SMTP_HOST=mailpit` (Docker) o `localhost` (nativo) en `1025`, sin auth ni TLS; el correo se inspecciona en la UI de Mailpit (`8025`).

## 7. Estrategia de test (transporter mockeado)

- **Unit `mailer`**: se stubbea `nodemailer.createTransport` (o se inyecta un transporter fake) para (a) verificar que `sendMail` recibe `from/to/cc/bcc/subject/html` correctos, y (b) que un rechazo del transporter se propaga para mapearse a error controlado. Sin red.
- **Integración ruta (Supertest)**: con el `mailer` stubbeado, `POST /api/send` con payload válido → `200 { ok:true }`; con el transporter fallando → `5xx { ok:false, code }` y **sin** filtrar secretos. Aserción de que el log emitido contiene destinatarios/asunto y **no** el `body` ni credenciales (spy sobre el logger).
- Los tests corren en verde vía `pnpm test` (Turborepo), sin depender de Mailpit.

## 8. Fuera de alcance (trazabilidad de fronteras)

| Preocupación | HU | Fase |
|--------------|----|----|
| Validación autoritativa en servidor | HU-18 | 5 |
| Adjunto (multipart, Multer, MIME real, tamaño) | HU-11–13 | 6 |
| Saneamiento del HTML del cuerpo | HU-17 | 7 |
| Validación de cliente (formato, obligatorios) | HU-08/HU-14 | UI |
| Envío desde la UI y feedback | HU-15/HU-16 | 4 |

# email-sending Specification

## ADDED Requirements

### Requirement: Endpoint de envío de correo
El backend SHALL exponer un endpoint `POST /api/send` que acepte `application/json` con el contrato del correo (`to[]`, `cc[]?`, `bcc[]?`, `subject`, `body` HTML) y realice el envío real vía SMTP con Nodemailer. En esta capacidad no se acepta adjunto ni `multipart/form-data`.

#### Scenario: Envío con datos válidos
- **WHEN** se hace `POST /api/send` con un cuerpo JSON válido (al menos un destinatario en `to`, `subject` y `body`) y el SMTP está configurado
- **THEN** Nodemailer entrega el correo al servidor SMTP y el endpoint responde `200` con `{ "ok": true, "message": <texto> }`

#### Scenario: El cuerpo se envía como HTML
- **WHEN** se envía un `body` con formato HTML
- **THEN** el correo se construye con ese contenido en el campo `html` y con remitente `MAIL_FROM`

#### Scenario: CC y CCO opcionales
- **WHEN** se envía sin `cc` ni `bcc` (ausentes o listas vacías)
- **THEN** el envío procede con solo los destinatarios de `to`, y las direcciones de `bcc` viajan como copia oculta cuando se incluyen

### Requirement: Error de envío controlado sin filtrar secretos
Ante un fallo del servidor SMTP, el endpoint SHALL responder un error controlado con estado y estructura definidos, sin filtrar credenciales ni datos sensibles del entorno.

#### Scenario: Fallo del SMTP
- **WHEN** el servidor SMTP rechaza o no está disponible durante el envío
- **THEN** el endpoint responde `5xx` con `{ "ok": false, "code": <código>, "message": <mensaje genérico> }` y **no** incluye credenciales, host de auth ni trazas internas en la respuesta

### Requirement: Configuración SMTP por variables de entorno
El envío SHALL configurarse exclusivamente por variables de entorno (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`), sin credenciales hardcodeadas, y el transporter de Nodemailer se construye una vez y se reutiliza.

#### Scenario: Cambio de configuración sin recompilar
- **WHEN** se cambian las variables de entorno SMTP y se reinicia el servicio
- **THEN** el siguiente envío usa la nueva configuración sin necesidad de recompilar el código

#### Scenario: Sin credenciales en el código
- **WHEN** se inspecciona el código del servicio de envío
- **THEN** ninguna credencial SMTP aparece hardcodeada; todas provienen del entorno

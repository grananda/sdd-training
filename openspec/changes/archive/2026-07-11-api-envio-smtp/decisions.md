# Decisiones — api-envio-smtp

Pre-flight de apertura (`aisdd open change`). La arquitectura (`docs/arquitectura-base.md`) ya resolvía el contrato del endpoint, el pipeline, el uso de Nodemailer y Mailpit en dev; el pre-flight se centró en las fronteras de esta fase respecto a las fases posteriores.

## contrato-sin-adjunto

- **Fecha**: 2026-07-11
- **Tipo**: bloqueante
- **Origen**: usuario
- **Contexto**: HU-03 (criterio "incluye el adjunto si existe") vs. roadmap fase 2 (objetivo "POST /api/send con Nodemailer + logging") y fase 6 `adjunto` (HU-11–13).
- **Pregunta**: ¿Qué acepta `POST /api/send` en esta fase: JSON sin adjunto, o multipart con adjunto passthrough?
- **Opciones evaluadas**:
  - a) `application/json` sin adjunto; el multipart/adjunto llega en la fase 6
  - b) `multipart/form-data` ya, con el adjunto en passthrough sin validar
- **Decision**: a) JSON sin adjunto
- **Justificación**: alinea con el objetivo del roadmap para la fase 2 y no solapa alcance con la fase 6.

## sin-validacion-de-dominio

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: saneamiento (HU-17, fase 7) y validación autoritativa (HU-18, fase 5) están planificados después de esta fase.
- **Pregunta**: ¿Qué validación lleva el endpoint en esta fase 2?
- **Opciones evaluadas**:
  - a) Validación mínima de forma del payload
  - b) Adelantar saneamiento básico
  - c) (respuesta del usuario) Nada: la validación se hace luego formalmente en sus HU
- **Decision**: c) Sin validación de dominio en esta fase; el endpoint consume el payload y lo entrega al mailer. La validación autoritativa se implementa en HU-18 (fase 5) y la de cliente en HU-08/HU-14; el saneamiento en HU-17 (fase 7).
- **Justificación**: respeta el faseado del roadmap y evita duplicar/anticipar trabajo que sus HU especifican formalmente. Un JSON mal formado lo rechaza el parser de Express (`400`) sin lógica propia.

## tests-transporter-mockeado

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: el skeleton dejó Vitest + Supertest; el envío toca un servicio externo (SMTP).
- **Pregunta**: ¿Cómo probar el camino de envío en los tests de esta fase?
- **Opciones evaluadas**:
  - a) Mock/stub del transporter de Nodemailer (rápido, determinista, sin red)
  - b) Integración real contra Mailpit
- **Decision**: a) Transporter mockeado en unit + integración de ruta (Supertest)
- **Justificación**: tests deterministas y sin dependencia de infra; la verificación contra Mailpit queda como prueba manual en los criterios de cierre.

## preflight-implementacion-sin-dudas

- **Fecha**: 2026-07-11
- **Tipo**: confirmacion
- **Origen**: usuario
- **Contexto**: pre-flight de `aisdd implement change`. `design.md` y las decisiones del open ya fijan contrato, fronteras, logging y estrategia de test; el código base de `foundation` (`app.ts`, `config/env.ts`, `logger.ts`, patrón de routers y Vitest+Supertest) está claro.
- **Pregunta**: No se detectaron dudas bloqueantes durante el pre-flight de implementación.
- **Opciones evaluadas**:
  - a) Continuar con la implementación según design.md
- **Decision**: continuar. Detalles menores resueltos por defecto: el tipo `SendEmailRequest` se define **local** en `apps/api` (se promueve a `packages/shared` en la fase de UI); código de error `SEND_FAILED`; el mailer se hace mockeable con `vi.mock("nodemailer")`.
- **Justificación**: alcance y patrón ya cerrados; no procede forzar preguntas.

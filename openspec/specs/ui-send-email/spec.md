# ui-send-email Specification

## Purpose
TBD - created by archiving change ui-envio-feedback. Update Purpose after archive.
## Requirements
### Requirement: Envío directo desde la UI
Al pulsar Enviar, la aplicación SHALL enviar el correo directamente al backend (`POST /api/send`) sin diálogo de confirmación ni vista previa.

#### Scenario: Envío sin confirmación
- **WHEN** el usuario pulsa Enviar
- **THEN** el envío se dispara directamente, sin diálogo de confirmación ni vista previa

#### Scenario: Petición al backend
- **WHEN** se dispara el envío
- **THEN** se hace `POST /api/send` con el correo (destinatarios, asunto y cuerpo) en formato JSON

### Requirement: Prevención de envíos duplicados durante el envío
Mientras un envío está en curso, la aplicación SHALL deshabilitar el botón Enviar e indicar progreso, para evitar envíos duplicados.

#### Scenario: Botón deshabilitado durante el envío
- **WHEN** un envío está en curso
- **THEN** el botón Enviar aparece deshabilitado y con indicación de progreso hasta que el envío termina


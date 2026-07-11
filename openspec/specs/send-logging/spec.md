# send-logging Specification

## Purpose
TBD - created by archiving change api-envio-smtp. Update Purpose after archive.
## Requirements
### Requirement: Registro del resultado del envío
El backend SHALL registrar en los logs del servidor el resultado de cada intento de envío (éxito o error), con trazabilidad operativa mínima y sin persistencia en base de datos.

#### Scenario: Log de un envío
- **WHEN** un envío termina (éxito o error)
- **THEN** se registra en el log: el resultado, los destinatarios (`to`, `cc`, `bcc`), el asunto y un timestamp

### Requirement: El log no expone contenido ni secretos
Los logs de envío SHALL excluir el contenido del correo y cualquier dato sensible del entorno.

#### Scenario: Sin cuerpo del correo en el log
- **WHEN** se inspecciona el log de un envío
- **THEN** el log **no** contiene el cuerpo (HTML) del correo ni contenido de adjunto

#### Scenario: Sin credenciales en el log
- **WHEN** se registra la traza de un envío
- **THEN** las credenciales SMTP (usuario, contraseña) **no** aparecen en claro en el log


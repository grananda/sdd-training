# send-feedback Specification

## Purpose
TBD - created by archiving change ui-envio-feedback. Update Purpose after archive.
## Requirements
### Requirement: Feedback de resultado del envío
Tras un envío, la aplicación SHALL mostrar un mensaje claro de éxito o de error, sin exponer detalles técnicos sensibles, de forma accesible.

#### Scenario: Éxito
- **WHEN** el backend responde que el envío fue correcto
- **THEN** la UI muestra un mensaje de éxito claro en una región accesible (`aria-live`)

#### Scenario: Error
- **WHEN** el backend responde con error o falla la conexión
- **THEN** la UI muestra un mensaje de error claro, en español y sin detalles técnicos sensibles

### Requirement: Limpieza al éxito y conservación al error
Tras un envío con éxito, el formulario SHALL limpiarse; tras un envío con error, SHALL conservar los datos introducidos para poder reintentar.

#### Scenario: Formulario limpio tras éxito
- **WHEN** un envío se confirma con éxito
- **THEN** todos los campos del formulario quedan vacíos y listos para uno nuevo

#### Scenario: Datos conservados tras error
- **WHEN** un envío termina en error
- **THEN** los datos introducidos se conservan en el formulario para reintentar


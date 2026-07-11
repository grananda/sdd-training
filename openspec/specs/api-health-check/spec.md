# api-health-check Specification

## Purpose
TBD - created by archiving change foundation. Update Purpose after archive.
## Requirements
### Requirement: Endpoint de health-check
El backend SHALL exponer un endpoint `GET /api/health` que confirme que el servicio está vivo, sin depender de configuración SMTP ni de ningún servicio externo.

#### Scenario: Petición al health-check
- **WHEN** se hace `GET /api/health`
- **THEN** el backend responde `200` con cuerpo JSON `{ "status": "ok" }`

#### Scenario: Salud independiente del SMTP
- **WHEN** se consulta `GET /api/health` sin haber configurado un servidor SMTP real
- **THEN** el endpoint responde `200` igualmente, porque no depende del envío de correo


# subject-field Specification

## Purpose
TBD - created by archiving change ui-composicion. Update Purpose after archive.
## Requirements
### Requirement: Asunto de una sola línea
El campo Asunto SHALL aceptar texto de una sola línea y normalizar a una sola línea el texto con saltos de línea que se introduzca.

#### Scenario: Texto de una línea
- **WHEN** el usuario escribe en el campo Asunto
- **THEN** el campo acepta el texto en una sola línea

#### Scenario: Normalización de saltos de línea al pegar
- **WHEN** el usuario pega en Asunto un texto que contiene saltos de línea
- **THEN** el valor resultante se normaliza a una sola línea, sin saltos


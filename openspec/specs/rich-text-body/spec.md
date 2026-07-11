# rich-text-body Specification

## Purpose
TBD - created by archiving change ui-composicion. Update Purpose after archive.
## Requirements
### Requirement: Editor de cuerpo con formato acotado
El cuerpo SHALL disponer de un editor enriquecido React Quill cuyo toolbar ofrezca únicamente negrita, cursiva y listas (ordenada y no ordenada), y cuya salida sea HTML.

#### Scenario: Set de formato del toolbar
- **WHEN** el usuario redacta el cuerpo
- **THEN** el editor ofrece negrita, cursiva y listas ordenada y no ordenada, y ninguna otra opción de formato

#### Scenario: Sin opciones fuera del set
- **WHEN** se inspecciona el toolbar del editor
- **THEN** no ofrece enlaces, imágenes ni encabezados

#### Scenario: Salida en HTML
- **WHEN** el usuario da formato al contenido
- **THEN** el cuerpo se representa como HTML en el valor del formulario (el saneamiento se realiza en el backend en una fase posterior)


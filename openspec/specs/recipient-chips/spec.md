# recipient-chips Specification

## Purpose
TBD - created by archiving change ui-composicion. Update Purpose after archive.
## Requirements
### Requirement: Destinatarios como chips en Para
El campo Para SHALL admitir una o varias direcciones introducidas como etiquetas (chips) eliminables, e incluirlas todas como destinatarios principales.

#### Scenario: Añadir una dirección como chip
- **WHEN** el usuario escribe una dirección en Para y pulsa Enter o coma
- **THEN** la dirección se añade como un chip eliminable y el campo de entrada se limpia

#### Scenario: Eliminar un chip
- **WHEN** el usuario elimina un chip existente
- **THEN** el chip desaparece de la lista de destinatarios

#### Scenario: Varias direcciones
- **WHEN** el usuario añade varias direcciones en Para
- **THEN** todas quedan como chips y forman la lista de destinatarios principales

### Requirement: Copias CC y CCO opcionales con chips
Los campos CC y CCO SHALL comportarse como Para (chips, varias direcciones) y ser opcionales; CCO se presenta como copia oculta.

#### Scenario: CC y CCO con el mismo comportamiento que Para
- **WHEN** el usuario añade direcciones en CC o en CCO
- **THEN** se comportan como chips y admiten varias direcciones cada uno

#### Scenario: CC y CCO vacíos son válidos en la UI
- **WHEN** CC y CCO se dejan vacíos
- **THEN** el formulario no exige rellenarlos (son opcionales)

#### Scenario: CCO indicado como copia oculta
- **WHEN** se muestra el campo CCO
- **THEN** se etiqueta como copia oculta; la entrega efectiva como BCC la realiza el backend


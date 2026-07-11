# email-composition-form Specification

## ADDED Requirements

### Requirement: Pantalla única de composición
La aplicación web SHALL presentar una pantalla única con un formulario de composición que muestre los campos Para, CC, CCO, Asunto y Cuerpo y un botón Enviar, con la interfaz en español y la identidad visual corporativa NTT DATA.

#### Scenario: Formulario visible al cargar
- **WHEN** el usuario carga la página
- **THEN** ve un formulario con los campos Para, CC, CCO, Asunto y Cuerpo y un botón Enviar

#### Scenario: Interfaz en español
- **WHEN** se muestra el formulario
- **THEN** las etiquetas, textos de ayuda y el botón están en español

#### Scenario: Campos opcionales indicados
- **WHEN** se muestran los campos CC y CCO
- **THEN** se indican como opcionales

### Requirement: Botón Enviar presente pero sin envío en esta fase
El formulario SHALL renderizar el botón Enviar, pero el envío real al backend no forma parte de esta capacidad (se añade en la fase de envío desde la UI).

#### Scenario: El botón Enviar es visible
- **WHEN** se muestra la barra de acción del formulario
- **THEN** el botón Enviar está presente y habilitado para la interacción

#### Scenario: El envío aún no está cableado
- **WHEN** el usuario pulsa Enviar en esta fase
- **THEN** no se realiza ninguna petición de envío al backend (el cableado llega en la fase de envío desde la UI)

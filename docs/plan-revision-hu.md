# Plan de revisión de Historias de Usuario — Servicio Web de Envío de Email (aidd-training)

> **Versión 4** · **Generado:** 2026-07-09 10:55 CEST
> Documento de planificación de la revisión de HU (AIDD). Generado por `aidd hu-review-plan`.
> Fuentes: docs/mapa-historias-usuario.md, docs/detalle-historias-usuario.md.
> **Modelo entrelazado:** la revisión de cada HU se hace al inicio del sprint que la construye (ver §3 y `docs/sprint-plan.md`).
> El Excel docs/xlsx/plan-revision-hu.xlsx es la vista rica de este plan. **Aprobado (2026-07-09).**

## 1. Parámetros de planificación

| Parámetro | Valor |
|-----------|-------|
| Kickoff | **lunes 3-ago-2026** |
| Modelo de revisión | **Entrelazado con los sprints**: el refinamiento/validación de cada HU ocurre **al inicio del sprint que la construye** (just-in-time), no como campaña previa. |
| Periodo | **3-ago → 21-ago-2026** (semana de arranque + 2 sprints de 1 semana) |
| Reuniones de revisión | **4** (2 por sprint) + 1 de revisión de documentación de cliente en el arranque |
| Agrupación por reunión | Todas las HU de la fase del sprint agrupadas por tipo (varias HU relacionadas por sesión) |
| Separación de revisión | **Funcional (negocio) / Técnica (TI)**, activada: cada sprint tiene 1 sesión de cada |

**Por qué entrelazado (y no una campaña previa):** el build real con IA es **~6,1 días-persona**; una campaña de revisión monolítica de 4 semanas antes de construir sería waterfall encubierto y eclipsaría el desarrollo. Con 18 HU pequeñas y muy relacionadas se revisa **lo que se va a construir, justo antes de construirlo**: F0+F1 al inicio del Sprint 1 y F2+F3+F4 al inicio del Sprint 2. Así el desarrollo arranca el **10-ago** (no el 24-ago) y todo cierra el **21-ago**.

## 2. Consolidado de HU

| HU | Fase | Persona | Épica | Historia (Como / quiero / para) | Prior. | MoSCoW | Est. | Estado | Bloq. | RF | Tipo rev. | Dependencias |
|----|------|---------|-------|---------------------------------|--------|--------|------|--------|-------|----|-----------|--------------|
| HU-01 | F0 | Equipo de desarrollo | Foundation | Como equipo de desarrollo, quiero un monorepo Turborepo + pnpm con apps web y api, para tener la base del proyecto. | Alta | Must | S | Pendiente | No | enabler (RF-01, RF-06) | técnica | — |
| HU-02 | F0 | Equipo de desarrollo | Foundation | Como equipo de desarrollo, quiero levantar la aplicación en local con Docker Compose, para poder ejecutar y probar el servicio. | Alta | Must | S | Pendiente | No | enabler (NFR-08) | técnica | HU-01 |
| HU-03 | F0 | Equipo de desarrollo | Envío (soporte) | Como equipo de desarrollo, quiero un endpoint de envío con Nodemailer y SMTP configurable por env, para poder enviar correos. | Alta | Must | M | Pendiente | No | RF-13 | técnica | HU-01, HU-02 |
| HU-04 | F0 | Equipo de desarrollo | Envío (soporte) | Como equipo de desarrollo, quiero registrar en logs el resultado de cada envío (sin persistir contenido), para tener trazabilidad operativa. | Media | Should | XS | Pendiente | No | RF-15 | técnica | HU-03 |
| HU-05 | F1 | Remitente | Acceder al formulario | Como remitente, quiero ver un formulario con Para, CC, CCO, Asunto, Cuerpo y Adjunto, para redactar un email. | Alta | Must | S | Pendiente | No | RF-01 | funcional | HU-01 |
| HU-06 | F1 | Remitente | Definir destinatarios | Como remitente, quiero indicar una o varias direcciones en Para, para enviar a los destinatarios que necesite. | Alta | Must | M | Pendiente | No | RF-02 | funcional | HU-05 |
| HU-07 | F1 | Remitente | Definir destinatarios | Como remitente, quiero añadir una o varias direcciones en CC y CCO (opcionales), para incluir copias visibles y ocultas. | Alta | Must | XS | Pendiente | No | RF-03 | funcional | HU-05, HU-06 |
| HU-09 | F1 | Remitente | Redactar mensaje | Como remitente, quiero escribir el asunto en una línea, para titular el correo. | Alta | Must | XS | Pendiente | No | RF-05 | funcional | HU-05 |
| HU-10 | F1 | Remitente | Redactar mensaje | Como remitente, quiero redactar el cuerpo con un editor minimalista (negrita, cursiva, listas), para dar formato al mensaje. | Alta | Must | S | Pendiente | No | RF-06 | funcional | HU-05 |
| HU-15 | F1 | Remitente | Enviar y ver resultado | Como remitente, quiero enviar directamente al pulsar Enviar (sin confirmación ni vista previa), para un flujo ágil. | Baja | Could | XS | Pendiente | No | RF-11 | funcional | HU-05, HU-03 |
| HU-16 | F1 | Remitente | Enviar y ver resultado | Como remitente, quiero feedback claro de éxito o error tras enviar, para saber si el correo salió. | Alta | Must | S | Pendiente | No | RF-14 | funcional | HU-03, HU-15 |
| HU-08 | F2 | Remitente | Definir destinatarios | Como remitente, quiero que se valide el formato de cada dirección, para evitar envíos a direcciones inválidas. | Alta | Must | XS | Pendiente | No | RF-04 | ambas | HU-06, HU-07 |
| HU-14 | F2 | Remitente | Validación de entradas | Como remitente, quiero que el sistema exija Para, Asunto y Cuerpo antes de enviar, para no mandar correos incompletos. | Alta | Must | XS | Pendiente | No | RF-10 | funcional | HU-05, HU-06, HU-09, HU-10 |
| HU-11 | F3 | Remitente | Adjuntar documento | Como remitente, quiero adjuntar un único documento (opcional) al email. | Alta | Must | S | Pendiente | No | RF-07 | ambas | HU-05, HU-03 |
| HU-12 | F3 | Remitente | Adjuntar documento | Como remitente, quiero que se valide el tipo del adjunto (JPG, GIF, PDF, Word, Excel, PowerPoint), para no enviar formatos no permitidos. | Alta | Must | S | Pendiente | No | RF-08 | ambas | HU-11 |
| HU-13 | F3 | Remitente | Adjuntar documento | Como remitente, quiero que se valide el tamaño del adjunto (máx. 10 MB), para no exceder el límite. | Alta | Must | XS | Pendiente | No | RF-09 | ambas | HU-11 |
| HU-17 | F4 | Responsable de seguridad | Seguridad y endurecimiento | Como responsable de seguridad, quiero que el backend sanee el HTML del cuerpo antes de enviar, para prevenir XSS/inyección. | Alta | Must | M | Pendiente | No | RF-12 | técnica | HU-03, HU-10 |
| HU-18 | F4 | Responsable de seguridad | Seguridad y endurecimiento | Como responsable de seguridad, quiero que el backend valide en servidor (obligatorios, formato, tipo/tamaño), para no fiar la validación al cliente. | Alta | Must | S | Pendiente | No | RF-16 | técnica | HU-03, HU-11 |

**18 HU consolidadas** · 0 bloqueadas · todas en estado *Pendiente* (sin revisión previa registrada).

## 3. Calendario de revisión (entrelazado con los sprints)

**Semana del 3-ago — Arranque** (no es sprint de desarrollo): kickoff, **revisión de documentación de cliente**, setup de entornos (monorepo/Docker/Mailpit) y refinamiento inicial del backlog.

**Sprints con revisión al inicio** (2 reuniones por sprint: 1 funcional + 1 técnica). Se revisa el lunes/martes y se construye el resto de la semana:

| Sprint | Fecha reunión | Tipo | HU revisadas | Enfoque |
|--------|---------------|------|--------------|---------|
| **Sprint 1** — F0+F1 (MVP)<br>10–14 ago | lun 10-ago | Técnica | HU-01, HU-02, HU-03, HU-04 | Foundation: monorepo, Docker/Mailpit, endpoint SMTP (Nodemailer), logs |
| | mar 11-ago | Funcional | HU-05, HU-06, HU-07, HU-09, HU-10, HU-15, HU-16 | Formulario, destinatarios (Para/CC/CCO), asunto, cuerpo enriquecido, envío directo y feedback |
| **Sprint 2** — F2+F3+F4 (endurecimiento)<br>17–21 ago | lun 17-ago | Funcional | HU-14, HU-08, HU-11, HU-12, HU-13 | Validación de entradas (obligatorios, formato) y adjunto, de cara al usuario |
| | mar 18-ago | Técnica | HU-08, HU-11, HU-12, HU-13, HU-18, HU-17 | Adjunto (multipart/MIME real), validación autoritativa en servidor y saneamiento del HTML |

**Build:** Sprint 1 construye de mié–vie (11–14 ago) con demo del MVP el vie 14-ago; Sprint 2, de mié–vie (18–21 ago) con cierre el vie 21-ago.

**Reparto:** 2 reuniones funcionales (negocio) + 2 técnicas (TI). Las HU **ambas** (HU-08, HU-11, HU-12, HU-13) se revisan una vez con negocio (lun) y otra con TI (mar) **dentro de su sprint**. El orden respeta fases y dependencias (F0 → F1 → F2/F3 → F4). Cada sprint cierra sus HU al arrancar la semana, no antes de empezar el proyecto.

## 4. Leyenda de campos

**Persona / rol**
| Valor | Significado |
|-------|-------------|
| Remitente | Usuario final que compone y envía el correo desde la web (rol único, sin login). |
| Equipo de desarrollo | Rol técnico de los habilitadores de F0 (monorepo, envío, Docker). No es usuario del producto. |
| Responsable de seguridad | Perspectiva de seguridad materializada en F4 (saneamiento y validación en servidor). |

**Estado**
| Valor | Significado |
|-------|-------------|
| Pendiente | HU aún no revisada ni cerrada con negocio/TI. |
| En revisión | HU en proceso de validación en una reunión. |
| Cerrada | HU validada y lista para construir. |

**Tipo de revisión**
| Valor | Significado |
|-------|-------------|
| funcional | Revisión con negocio (reglas de negocio, UX, criterios de aceptación de cara al remitente). |
| técnica | Revisión con TI (habilitadores, integraciones, seguridad de servidor, NFR). |
| ambas | La HU se revisa en una reunión funcional y en una técnica. |

**Estimación (talla)** — escala de puntos fijos; 1 d = jornada de 8 h (métrica del detalle de historias)
| Valor | Significado |
|-------|-------------|
| XS | 0,5 días-persona |
| S | 1,5 días-persona |
| M | 3 días-persona |
| L | 5 días-persona |
| XL | 8 días-persona |

> No hay campos codificados propios del cliente (Persona P1/P5, GAP) en los documentos fuente; las personas se nombran por rol. No queda ningún significado por completar.

## 5. Riesgos y supuestos

- **Supuesto (kickoff/modelo):** kickoff 3-ago y modelo entrelazado (revisión al inicio de cada sprint), a confirmar por el usuario.
- **Concentración de reuniones al inicio del sprint (riesgo de agenda):** revisar lunes/martes y construir de miércoles a viernes exige disponibilidad de negocio y TI **al arranque de cada sprint**. Hay que blindar el 10–11 ago (Sprint 1) y el 17–18 ago (Sprint 2).
- **Retraso de una revisión = retraso solo de ese sprint:** al estar entrelazado, si la sesión de inicio se cae, se retrasa el build de ese sprint, no toda una campaña previa.
- **Dependencia de configuración (no bloqueante):** proveedor y credenciales SMTP (`requisitos.md` §7/§8) afectan a la **puesta en marcha** de HU-03, no a su revisión; dev usa Mailpit.
- **Dependencia de diseño (no bloqueante):** identidad visual pendiente (NFR-12); no bloquea la revisión de HU-05 ni del resto de la UI.
- **Vacaciones de agosto (riesgo de agenda):** la ventana es más corta (3–21 ago) pero más densa; conviene confirmar disponibilidad de negocio y TI en esas fechas concretas. Ninguna HU está marcada como bloqueada.

## 6. Decisiones tomadas

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Periodo objetivo y kickoff | Jul kickoff 13 / Jul kickoff 08 / Jul–ago / **3-ago** | **Kickoff 3-ago-2026** | usuario | Respuesta directa del usuario en el pre-flight. |
| 2 | Modelo de revisión | Campaña previa a los sprints / **Entrelazado con los sprints** | **Entrelazado: revisión al inicio de cada sprint** | usuario | Para un build de ~6 días, una campaña previa de 4 semanas es waterfall; se revisa just-in-time lo que cada sprint construye. |
| 3 | Reuniones por sprint | 1 mixta / **1 funcional + 1 técnica** | **2 por sprint (funcional + técnica)** | usuario | Mantiene la separación negocio/TI dentro de cada iteración. |
| 4 | Separación funcional/técnica | **Sí** / No | **Sí (funcional + técnica)** | usuario | Separa validación con negocio de la de TI; las HU mixtas se revisan en ambas dentro de su sprint. |
| 5 | Tipo de revisión por HU | Derivar del contenido / Preguntar una a una | **Derivado del contenido** | default | F0 y F4 → técnica; F1/F2 de cara al remitente → funcional; adjunto y formato → ambas. |
| 6 | Agrupación de HU por reunión | Una por reunión / **Varias relacionadas (por fase del sprint)** | **Varias HU por sesión** | default | Minimiza sesiones; agrupa por fase/épica/dependencia dentro del sprint. |

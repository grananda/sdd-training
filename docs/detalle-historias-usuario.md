# Detalle de historias de usuario — Servicio Web de Envío de Email (aidd-training)

> **Versión 3** · **Generado:** 2026-07-09 08:17 CEST
> Documento de Fase 1 (AIDD · paso 1.3). Generado por `aidd user-story-details`.
> Entradas: docs/requisitos.md, docs/mapa-historias-usuario.md. Cierra la Fase 1.
> **Aprobado (2026-07-09).**
>
> Escala de estimación (tallas de puntos fijos; 1 d = jornada de 8 h): **XS** = 0,5 d · **S** = 1,5 d · **M** = 3 d · **L** = 5 d · **XL** = 8 d. Cada historia toma la talla más cercana a su esfuerzo humano; es la fuente de la doble estimación (humano vs IA) del plan de proyecto.
> Los criterios marcados con **[IMPRESCINDIBLE]** son los que hay que cumplir para dar por cerrada su fase (condicionan su criterio de salida). No indican un impedimento: el resto de criterios son deseables pero no frenan el cierre de la fase.

## Historias detalladas

### F0 — Foundation (base técnica)

#### HU-01 — Monorepo Turborepo + pnpm con apps `web` y `api`
- **Fase**: F0   **RF cubierto(s)**: enabler (soporte RF-01, RF-06)   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: estructura de monorepo con Turborepo y pnpm (workspaces), con `apps/web` (React + TypeScript + Tailwind) y `apps/api` (Express + TypeScript), y un paquete compartido opcional para tipos/validaciones.
- **Criterios de aceptación**:
  - Dado el repositorio, cuando se ejecuta `pnpm install` en la raíz, entonces se instalan las dependencias de todos los workspaces sin error. **[IMPRESCINDIBLE]**
  - Dado el monorepo, cuando se listan los workspaces, entonces existen `apps/web` y `apps/api` reconocidos por Turborepo y pnpm. **[IMPRESCINDIBLE]**
  - Dado `apps/web`, cuando se arranca en desarrollo, entonces sirve una página React con TypeScript y Tailwind operativos.
  - Dado `apps/api`, cuando se arranca, entonces levanta un servidor Express en TypeScript que responde a un health-check.
  - Dado un paquete compartido (si se crea), cuando `web`/`api` importan tipos o validaciones, entonces se resuelven vía workspace.
- **Notas técnicas y dependencias**: base de HU-05 (web) y HU-03 (api). Restricciones §5 de `requisitos.md`: TypeScript, Tailwind, Turborepo + pnpm. Sin dependencias previas.

#### HU-02 — Ejecución local con Docker Compose
- **Fase**: F0   **RF cubierto(s)**: enabler (NFR-08)   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: orquestación local de `web` + `api` con Docker Compose, con configuración por variables de entorno y sin secretos en el repo.
- **Criterios de aceptación**:
  - Dado `docker-compose.yml`, cuando se ejecuta `docker compose up`, entonces se levantan los servicios `web` y `api` en local. **[IMPRESCINDIBLE]**
  - Dado los servicios arrancados, cuando se accede a la URL del frontend, entonces la web carga y puede invocar al backend (CORS configurado con `WEB_ORIGIN`).
  - Dado variables SMTP en el entorno (`.env`), cuando arranca `api`, entonces las lee del entorno y no del código.
  - Dado `.env.example`, cuando se revisa el repo, entonces documenta las variables **sin secretos reales**. **[IMPRESCINDIBLE]** (NFR-03)
- **Notas técnicas y dependencias**: depende de HU-01. Variables de entorno §7 de `requisitos.md`. Configura CORS local.

#### HU-03 — Endpoint de envío con Nodemailer y SMTP configurable
- **Fase**: F0   **RF cubierto(s)**: RF-13 (NFR-03, NFR-09)   **Prioridad**: Alta
- **Estimación**: M
- **Descripción**: endpoint HTTP en el backend que recibe los datos del email y realiza el envío real vía SMTP con Nodemailer, usando configuración por variables de entorno.
- **Criterios de aceptación**:
  - Dado el backend con SMTP configurado, cuando se hace `POST` al endpoint de envío con datos válidos, entonces Nodemailer entrega el correo al servidor SMTP y responde éxito. **[IMPRESCINDIBLE]**
  - Dado un fallo del SMTP, cuando se envía, entonces el endpoint responde un error controlado (estado/estructura definidos) **sin filtrar credenciales** ni datos sensibles. **[IMPRESCINDIBLE]**
  - Dado un cambio en las variables de entorno (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`), cuando se reinicia el servicio, entonces el envío usa la nueva configuración sin recompilar. (NFR-09)
  - Dado un cuerpo con formato y/o un adjunto, cuando se envía, entonces el correo se construye como HTML e incluye el adjunto si existe.
- **Notas técnicas y dependencias**: depende de HU-01/HU-02. Es la base de HU-16 (feedback) y del envío de F1–F3. El saneamiento (HU-17) y la validación en servidor (HU-18) se añaden en F4 sobre este endpoint.

#### HU-04 — Registro en logs del resultado del envío
- **Fase**: F0   **RF cubierto(s)**: RF-15 (NFR-06)   **Prioridad**: Media
- **Estimación**: XS
- **Descripción**: trazabilidad operativa mínima en logs del servidor, sin persistir el contenido del correo.
- **Criterios de aceptación**:
  - Dado un envío (éxito o error), cuando termina, entonces se registra en logs: resultado, destinatarios, asunto y timestamp. **[IMPRESCINDIBLE]**
  - Dado el log de un envío, cuando se inspecciona, entonces **no** contiene el cuerpo del correo ni el contenido del adjunto. **[IMPRESCINDIBLE]** (NFR-06)
  - Dado datos sensibles (credenciales SMTP), cuando se registra la traza, entonces no aparecen en claro.
- **Notas técnicas y dependencias**: depende de HU-03. Sin base de datos (NFR-06). Prioridad Should en el mapa: el envío funciona sin logging.

### F1 — Composición y envío del email (núcleo, happy path)

#### HU-05 — Formulario de composición
- **Fase**: F1   **RF cubierto(s)**: RF-01   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: pantalla única con el formulario de composición y el botón Enviar; contenedor del resto de historias de F1–F3.
- **Criterios de aceptación**:
  - Dado el usuario en la web, cuando carga la página, entonces ve un formulario con los campos Para, CC, CCO, Asunto, Cuerpo y Adjunto, y un botón Enviar. **[IMPRESCINDIBLE]**
  - Dado el formulario, cuando se muestra, entonces la interfaz está en español. (NFR-01)
  - Dado los campos CC, CCO y Adjunto, cuando se muestran, entonces se indican como opcionales.
- **Notas técnicas y dependencias**: depende de HU-01. Contenedor de HU-06…HU-16. La identidad visual es la corporativa **NTT DATA** (NFR-12), con los design tokens de `docs/guia-estilos.md`.

#### HU-06 — Destinatarios en Para (una o varias, chips)
- **Fase**: F1   **RF cubierto(s)**: RF-02   **Prioridad**: Alta
- **Estimación**: M
- **Descripción**: el campo Para admite una o varias direcciones introducidas como etiquetas (chips).
- **Criterios de aceptación**:
  - Dado el campo Para, cuando el usuario escribe una dirección y pulsa Enter o coma, entonces se añade como chip eliminable. **[IMPRESCINDIBLE]**
  - Dado varios chips en Para, cuando se envía, entonces todas las direcciones se incluyen como destinatarios principales (To).
  - Dado un chip existente, cuando el usuario lo elimina, entonces desaparece de la lista de destinatarios.
- **Notas técnicas y dependencias**: decisión de entrada = **chips/etiquetas** (paso 1.3). El mecanismo de entrada es esta historia; la **validación de formato** es HU-08 (F2). Depende de HU-05.

#### HU-07 — Copias CC y CCO (opcionales, chips)
- **Fase**: F1   **RF cubierto(s)**: RF-03   **Prioridad**: Alta
- **Estimación**: XS
- **Descripción**: campos CC y CCO con el mismo comportamiento de chips que Para, opcionales, admitiendo varias direcciones cada uno.
- **Criterios de aceptación**:
  - Dado los campos CC y CCO, cuando el usuario añade direcciones, entonces se comportan como Para (chips) y admiten varias cada uno.
  - Dado CC y CCO vacíos, cuando se envía, entonces el envío procede (son opcionales). **[IMPRESCINDIBLE]**
  - Dado direcciones en CCO, cuando se entrega el correo, entonces van como copia oculta (no visibles para el resto de destinatarios).
- **Notas técnicas y dependencias**: reutiliza el componente de chips de HU-06. Depende de HU-05/HU-06.

#### HU-09 — Asunto
- **Fase**: F1   **RF cubierto(s)**: RF-05   **Prioridad**: Alta
- **Estimación**: XS
- **Descripción**: campo de asunto de una sola línea.
- **Criterios de aceptación**:
  - Dado el campo Asunto, cuando el usuario escribe, entonces acepta texto de una sola línea. **[IMPRESCINDIBLE]**
  - Dado un texto con saltos de línea pegado, cuando se introduce en Asunto, entonces se normaliza a una sola línea.
- **Notas técnicas y dependencias**: la obligatoriedad se cubre en HU-14 (F2). Depende de HU-05.

#### HU-10 — Cuerpo con editor enriquecido minimalista (React Quill)
- **Fase**: F1   **RF cubierto(s)**: RF-06   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: editor React Quill con un conjunto acotado de formato: negrita, cursiva y listas (ordenada y no ordenada), con salida HTML.
- **Criterios de aceptación**:
  - Dado el cuerpo, cuando el usuario redacta, entonces dispone de un editor React Quill con **negrita, cursiva y listas** (ordenada y no ordenada), y nada más. **[IMPRESCINDIBLE]**
  - Dado el contenido redactado, cuando se envía, entonces el cuerpo se transmite como HTML.
  - Dado el toolbar, cuando se revisa, entonces no ofrece opciones fuera del set (ni enlaces, ni imágenes, ni encabezados).
- **Notas técnicas y dependencias**: la salida HTML se **sanea en backend** (HU-17, F4) con un whitelist coherente con este toolbar. Depende de HU-05.

#### HU-15 — Envío directo
- **Fase**: F1   **RF cubierto(s)**: RF-11   **Prioridad**: Baja
- **Estimación**: XS
- **Descripción**: al pulsar Enviar el correo se manda directamente, sin diálogo de confirmación ni vista previa.
- **Criterios de aceptación**:
  - Dado el formulario, cuando el usuario pulsa Enviar, entonces el envío se dispara sin diálogo de confirmación ni vista previa. **[IMPRESCINDIBLE]**
  - Dado un envío en curso, cuando se está procesando, entonces el botón Enviar se deshabilita e indica progreso para evitar envíos duplicados.
- **Notas técnicas y dependencias**: es el comportamiento por defecto (Could en el mapa). El feedback de resultado es HU-16. Depende de HU-05/HU-03.

#### HU-16 — Feedback de resultado y limpieza del formulario
- **Fase**: F1   **RF cubierto(s)**: RF-14   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: tras enviar, la UI muestra éxito o error; tras un éxito, el formulario se limpia.
- **Criterios de aceptación**:
  - Dado un envío con éxito, cuando el backend responde OK, entonces la UI muestra un mensaje de éxito claro. **[IMPRESCINDIBLE]**
  - Dado un envío con error, cuando el backend responde error, entonces la UI muestra un mensaje de error claro, sin exponer detalles técnicos sensibles. **[IMPRESCINDIBLE]**
  - Dado un envío con éxito, cuando se confirma, entonces el formulario se **limpia** (todos los campos vacíos) y queda listo para uno nuevo. (decisión 1.3)
  - Dado un envío con error, cuando ocurre, entonces se conservan los datos introducidos para poder reintentar.
- **Notas técnicas y dependencias**: depende de HU-03/HU-15. (NFR-10 usabilidad.)

### F2 — Validación de entradas del formulario

#### HU-08 — Validación de formato de las direcciones
- **Fase**: F2   **RF cubierto(s)**: RF-04   **Prioridad**: Alta
- **Estimación**: XS
- **Descripción**: validación en cliente del formato de cada dirección de Para, CC y CCO.
- **Criterios de aceptación**:
  - Dado una dirección introducida en Para/CC/CCO, cuando el usuario la confirma (chip), entonces se valida su formato y, si es inválida, se señala y no se acepta como chip válido. **[IMPRESCINDIBLE]**
  - Dado alguna dirección inválida presente, cuando se intenta enviar, entonces no se permite el envío y se indica el campo afectado. **[IMPRESCINDIBLE]**
  - Dado direcciones con formato válido, cuando se validan, entonces se aceptan según la regla de formato de email documentada.
- **Notas técnicas y dependencias**: aplica a los tres campos de destinatarios. Validación de **cliente**; la autoritativa en servidor es HU-18 (F4). Depende de HU-06/HU-07.

#### HU-14 — Campos obligatorios antes de enviar
- **Fase**: F2   **RF cubierto(s)**: RF-10   **Prioridad**: Alta
- **Estimación**: XS
- **Descripción**: exigir Para, Asunto y Cuerpo no vacíos antes de permitir el envío.
- **Criterios de aceptación**:
  - Dado Para sin ninguna dirección, cuando se intenta enviar, entonces se bloquea el envío y se indica que Para es obligatorio. **[IMPRESCINDIBLE]**
  - Dado Asunto vacío, cuando se intenta enviar, entonces se bloquea y se indica obligatorio. **[IMPRESCINDIBLE]**
  - Dado Cuerpo vacío, cuando se intenta enviar, entonces se bloquea y se indica obligatorio. **[IMPRESCINDIBLE]**
  - Dado Para, Asunto y Cuerpo válidos y CC/CCO/adjunto vacíos, cuando se envía, entonces el envío procede.
- **Notas técnicas y dependencias**: "Cuerpo vacío" = sin texto real (se ignora HTML vacío tipo `<p><br></p>`). Validación de **cliente**; refuerzo en servidor en HU-18. Depende de HU-05/HU-06/HU-09/HU-10.

### F3 — Adjunto

#### HU-11 — Adjuntar un único documento
- **Fase**: F3   **RF cubierto(s)**: RF-07   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: adjuntar un único fichero opcional al correo.
- **Criterios de aceptación**:
  - Dado el campo Adjunto, cuando el usuario selecciona un fichero, entonces se muestra su nombre y tamaño, y puede quitarse. **[IMPRESCINDIBLE]**
  - Dado un adjunto ya seleccionado, cuando el usuario elige otro, entonces se reemplaza (solo uno permitido). **[IMPRESCINDIBLE]**
  - Dado un adjunto válido, cuando se envía, entonces se transmite al backend y se incluye en el correo.
  - Dado ningún adjunto, cuando se envía, entonces el envío procede (es opcional).
- **Notas técnicas y dependencias**: envío `multipart/form-data`. Las validaciones de tipo/tamaño son HU-12/HU-13. Depende de HU-05/HU-03.

#### HU-12 — Validación del tipo de adjunto
- **Fase**: F3   **RF cubierto(s)**: RF-08   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: permitir solo tipos de la lista blanca: JPG, GIF, PDF, Word (doc/docx), Excel (xls/xlsx), PowerPoint (ppt/pptx).
- **Criterios de aceptación**:
  - Dado un adjunto de tipo permitido, cuando se selecciona, entonces se acepta. **[IMPRESCINDIBLE]**
  - Dado un adjunto de tipo no permitido, cuando se selecciona o se intenta enviar, entonces se rechaza con un aviso claro. **[IMPRESCINDIBLE]**
  - Dado un fichero renombrado (extensión permitida pero contenido de otro tipo), cuando se valida en servidor, entonces se detecta por **MIME real** (contenido) y se rechaza. (decisión 1.3)
- **Notas técnicas y dependencias**: en cliente se valida por extensión/tipo declarado; en servidor por **extensión + MIME real (magic bytes)** — reforzado en HU-18. Depende de HU-11.

#### HU-13 — Validación del tamaño de adjunto
- **Fase**: F3   **RF cubierto(s)**: RF-09   **Prioridad**: Alta
- **Estimación**: XS
- **Descripción**: rechazar adjuntos que superen 10 MB.
- **Criterios de aceptación**:
  - Dado un adjunto de tamaño ≤ 10 MB, cuando se selecciona, entonces se acepta. **[IMPRESCINDIBLE]**
  - Dado un adjunto de tamaño > 10 MB, cuando se selecciona o se intenta enviar, entonces se rechaza con un aviso que indica el límite. **[IMPRESCINDIBLE]**
  - Dado el límite configurado, cuando se aplica, entonces usa `MAX_ATTACHMENT_SIZE_MB` (por defecto 10).
- **Notas técnicas y dependencias**: interpretación del límite = 10 MB binarios (10 × 1024 × 1024 bytes). Validación también en servidor (HU-18). Depende de HU-11.

### F4 — Seguridad y endurecimiento de servidor

#### HU-17 — Saneamiento del HTML del cuerpo en backend
- **Fase**: F4   **RF cubierto(s)**: RF-12 (NFR-02)   **Prioridad**: Alta
- **Estimación**: M
- **Descripción**: sanear en el backend el HTML del cuerpo antes de construir y enviar el correo, dejando solo el formato permitido.
- **Criterios de aceptación**:
  - Dado un cuerpo con HTML, cuando llega al backend, entonces se sanea antes de construir el correo. **[IMPRESCINDIBLE]**
  - Dado contenido peligroso (p. ej. `<script>`, atributos `on*`, `<iframe>`), cuando se sanea, entonces se elimina o neutraliza. **[IMPRESCINDIBLE]**
  - Dado el whitelist acordado, cuando se sanea, entonces solo sobreviven `b/strong`, `i/em`, `ul`, `ol`, `li`, `p`, `br`; se elimina todo lo demás, **incluidos enlaces e imágenes**. (decisión 1.3)
  - Dado un cuerpo saneado, cuando se envía, entonces conserva el formato válido del toolbar.
- **Notas técnicas y dependencias**: whitelist coherente con el toolbar de HU-10. Saneo con librería de servidor (p. ej. `sanitize-html`). Depende de HU-03/HU-10.

#### HU-18 — Validación en servidor (autoritativa)
- **Fase**: F4   **RF cubierto(s)**: RF-16 (NFR-11)   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: revalidar en el backend obligatorios, formato de direcciones y tipo/tamaño de adjunto, sin confiar en el frontend.
- **Criterios de aceptación**:
  - Dado una petición de envío, cuando llega al backend, entonces se validan en servidor: obligatorios (Para/Asunto/Cuerpo), formato de cada dirección y tipo + tamaño del adjunto. **[IMPRESCINDIBLE]**
  - Dado una petición que burla la validación de cliente (falta un obligatorio, email inválido, o tipo/tamaño de adjunto no permitido), cuando llega al backend, entonces se rechaza con error y **no** se envía. **[IMPRESCINDIBLE]**
  - Dado el adjunto, cuando se valida el tipo en servidor, entonces se comprueba el **MIME real** además de la extensión. (decisión 1.3)
  - Dado datos válidos en servidor, cuando pasan la validación, entonces se procede al envío (HU-03).
- **Notas técnicas y dependencias**: es la validación **autoritativa**; la de cliente (HU-08/HU-12/HU-13/HU-14) queda como conveniencia. Reutiliza el esquema/validaciones compartidas (`packages/shared`). Depende de HU-03/HU-11.

## Cobertura

**18/18 historias del mapa detalladas.** Ninguna pendiente.

| Fase | Historias | Detalladas |
|------|-----------|------------|
| F0 — Foundation | HU-01, HU-02, HU-03, HU-04 | ✅ 4/4 |
| F1 — Composición y envío | HU-05, HU-06, HU-07, HU-09, HU-10, HU-15, HU-16 | ✅ 7/7 |
| F2 — Validación de entradas | HU-08, HU-14 | ✅ 2/2 |
| F3 — Adjunto | HU-11, HU-12, HU-13 | ✅ 3/3 |
| F4 — Seguridad y endurecimiento | HU-17, HU-18 | ✅ 2/2 |

Cobertura RF (heredada del mapa §5): **16/16 RF**. HU-01 y HU-02 son enablers sin RF directo.

## Preguntas abiertas y pendientes

- Ninguna **[IMPRESCINDIBLE]** para pasar a Fase 2 (Diseño).
- Pendiente de configuración (no de requisitos): **proveedor y credenciales SMTP** (`requisitos.md` §7/§8) — afecta a la puesta en marcha de HU-03, no a su definición.
- ~~Pendiente de diseño: **identidad visual** (NFR-12)~~ — **Resuelto (2026-07-10):** identidad corporativa NTT DATA, formalizada en `docs/guia-estilos.md` (Fase 2).
- A concretar en implementación (no bloqueante): lista exacta de **etiquetas/atributos** y expresión de validación de email; el conjunto de referencia ya queda fijado en HU-17 y HU-08.

## Decisiones tomadas en el paso 1.3

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Entrada de múltiples destinatarios (Para/CC/CCO) | Chips/etiquetas / Texto separado por comas / Una por línea | **Chips/etiquetas** | usuario | UX habitual de cliente de correo; valida cada dirección al confirmarla (HU-06, HU-07, HU-08). |
| 2 | Validación del tipo de adjunto | Extensión + MIME real / Solo extensión / MIME del navegador | **Extensión + MIME real (magic bytes) en servidor** | usuario | Más seguro frente a ficheros renombrados (HU-12, HU-18). |
| 3 | Whitelist de saneamiento del cuerpo | Solo el set del toolbar / Toolbar + enlaces / Set ampliado | **Solo el set del toolbar** (b/strong, i/em, ul, ol, li, p, br) | usuario | Coherente con el editor minimalista; minimiza superficie XSS (HU-17). |
| 4 | Formulario tras un envío con éxito | Limpiar / Conservar / Conservar destinatarios | **Limpiar el formulario** | usuario | Flujo ágil listo para un nuevo correo; en error se conservan los datos (HU-16). |
| 5 | Interpretación de "Cuerpo vacío" | Ignorar HTML vacío / Tomar cualquier HTML como no vacío | **Ignorar HTML vacío (`<p><br></p>`)** | default | Evita falsos positivos de cuerpo relleno al validar obligatorios (HU-14). |
| 6 | Prevención de envíos duplicados | Deshabilitar botón durante el envío / Sin control | **Deshabilitar Enviar + indicador de progreso** | default | Evita doble envío en un flujo sin confirmación (HU-15). |
| 7 | Interpretación del límite de 10 MB | Binario (10 × 1024²) / Decimal (10 × 1000²) | **Binario (10 MiB)** | default | Criterio de tamaño reproducible para HU-13/HU-18. |

## Change log

Registro de cambios del documento (las HU se mantienen limpias y client-ready; aquí se anotan las modificaciones).

| Fecha | Cambio | Origen |
|-------|--------|--------|
| 2026-07-08 | Generación inicial del detalle: 18 HU sobre el faseado de 5 ciclos (F0–F4), con criterios Dado/Cuando/Entonces, estimación S/M/L y notas. Etiqueta de criterios de cierre = **[IMPRESCINDIBLE]**. Decisiones 1.3 registradas (4 del usuario + 3 defaults). | `aidd user-story-details` |
| 2026-07-08 | Regeneración/sobrescritura del documento a petición del usuario (contenido equivalente; ciclo limpio del skill). | `aidd user-story-details` |
| 2026-07-08 | Regeneración/sobrescritura a petición del usuario. Sin cambios en requisitos ni mapa; se conservan IDs, criterios y las 7 decisiones 1.3. Contenido equivalente. | `aidd user-story-details` |
| 2026-07-09 | **Cambio de métrica de estimación** (skill 1.9.0): de rangos S/M/L a **escala de tallas de puntos fijos** (XS 0,5 d · S 1,5 d · M 3 d · L 5 d · XL 8 d, 1 d = 8 h). Solo cambia el significado de la escala; **las tallas asignadas por HU, las HU, sus fases, criterios y prioridades quedan intactas**. | usuario |
| 2026-07-09 | **Re-estimación con la nueva granularidad** (aprovechando XS): 13 HU bajan de talla (ninguna sube). Nueva distribución **3 M + 8 S + 7 XS** (antes 9 M + 9 S). M: HU-03, HU-06, HU-17. S: HU-01, HU-02, HU-05, HU-10, HU-11, HU-12, HU-16, HU-18. XS: HU-04, HU-07, HU-08, HU-09, HU-13, HU-14, HU-15. **HU, fases, criterios y prioridades intactos**; solo cambia la talla. | usuario |
| 2026-07-10 | **NFR-12 resuelto.** La nota técnica de HU-05 decía que la identidad visual estaba pendiente de definir; se alinea con `docs/guia-estilos.md`, que la fija como corporativa NTT DATA. Solo cambia esa nota: **ninguna HU, fase, criterio, prioridad ni talla se modifica**. | usuario |

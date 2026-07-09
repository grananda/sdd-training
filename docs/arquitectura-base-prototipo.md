# Arquitectura del prototipo — Servicio Web de Envío de Email (aidd-training)

> **Versión 3** · **Generado:** 2026-07-08 11:24 CEST
> Documento de Fase 2 (AIDD · paso 2.1). Generado por `aidd prototype-architecture`.
> Entradas: docs/mapa-historias-usuario.md, docs/detalle-historias-usuario.md.
> Demo 100% mockeada para validación con cliente. **Aprobado (2026-07-08).**

## 1. Objetivo de la demo

Validar con el cliente, **antes de construir nada real**, que el formulario de composición y envío de email cubre el alcance acordado y que el flujo se entiende de un vistazo. La demo es un **wireframe navegable** (baja fidelidad, sin marca ni color; NFR-12 pendiente) que permite recorrer de punta a punta:

- Componer un email: destinatarios **Para/CC/CCO** (chips), **Asunto** y **Cuerpo** enriquecido (negrita, cursiva, listas).
- Adjuntar **un único documento** con sus límites de tipo y tamaño.
- Ver la **validación de entradas** (obligatorios y formato de email) bloqueando el envío.
- Pulsar **Enviar** y ver el resultado: **éxito** (con limpieza del formulario) o **error** (conservando los datos).

Todo el envío es **simulado**: no hay SMTP, ni backend, ni saneamiento real. La demo valida **UX, campos y flujo**, no la implementación. Cubre el recorrido funcional de las fases F1–F4 del mapa; los habilitadores de F0 (monorepo, Docker, endpoint) quedan fuera por ser internos y no validables por el cliente.

## 2. Stack mínimo

| Elemento | Elección | Justificación |
|----------|----------|---------------|
| Formato | **HTML + CSS + JS vanilla**, autocontenido (un fichero por pantalla/estado) | Sin build ni backend; se abre con doble clic. Máxima velocidad para iterar en la demo. |
| Generación | **booster-ux** (paso 2.2) | Produce las pantallas wireframe navegables a partir de este documento. |
| Estilo | **Wireframe** (grises, bordes, sin color de marca) | Fidelidad baja pedida por el usuario: valida estructura y campos, no estética. |
| Editor de cuerpo | Simulado (área de texto con botones B / I / • / 1.) | React Quill se mockea con un toolbar falso; no se integra la librería real. |
| Envío | **Mock en JS** (setTimeout + estado predefinido) | Simula éxito/error sin red. Un control de la demo permite forzar cada resultado. |

> No se usa React/Vite/Tailwind/Nodemailer en el prototipo. El stack real (definido en `requisitos.md` §5) se materializa en la arquitectura definitiva (paso 2.4), no aquí.

## 3. Componentes y módulos

La demo es de **una sola pantalla** (el compositor) con varios **estados** visualizables. Módulos lógicos del wireframe:

- **Cabecera / título** — identifica la pantalla; zona reservada para marca (pendiente NFR-12).
- **Campos de destinatarios** — tres campos con **chips**: Para (obligatorio), CC y CCO (opcionales).
- **Asunto** — input de una línea.
- **Cuerpo** — editor simulado con toolbar minimalista (negrita, cursiva, lista ordenada y no ordenada).
- **Adjunto** — selector de un único fichero con nombre + tamaño y botón de quitar.
- **Barra de acción** — botón **Enviar** (con estado deshabilitado/progreso).
- **Zona de feedback** — banner/toast de éxito o error.
- **Panel de control de la demo** (solo prototipo) — conmutadores para forzar: resultado del envío (éxito/error), y precargar un caso inválido. No forma parte del producto.

## 4. Pantallas o estados mínimos

Una pantalla, recorrible en estos estados (cada uno es una vista del wireframe):

| # | Estado | Qué muestra | HU validadas |
|---|--------|-------------|--------------|
| E1 | **Formulario vacío** | Todos los campos; CC/CCO/Adjunto marcados como opcionales; interfaz en español. | HU-05 |
| E2 | **Compuesto (con datos)** | Chips en Para/CC/CCO, asunto, cuerpo con formato, adjunto seleccionado (nombre + tamaño). | HU-06, HU-07, HU-09, HU-10, HU-11 |
| E3 | **Errores de validación** | Para vacío / email con formato inválido / obligatorio faltante señalados junto al campo; Enviar bloqueado. | HU-08, HU-14 |
| E4 | **Adjunto rechazado** | Aviso de tipo no permitido y de tamaño > 10 MB. | HU-12, HU-13 |
| E5 | **Enviando** | Botón Enviar deshabilitado con indicador de progreso (anti doble envío). | HU-15 |
| E6 | **Éxito** | Banner de éxito; formulario **limpio** listo para otro correo. | HU-16 |
| E7 | **Error de envío** | Banner de error claro (sin detalles técnicos); datos conservados para reintentar. | HU-16 |

Con E1→E7 el cliente recorre el alcance funcional completo sin bloqueos.

## 5. Estrategia de mocks

Todo lo externo o de servidor se **simula**:

- **Envío SMTP / Nodemailer** → función `mockSend()` en JS que espera ~1 s (setTimeout) y devuelve un resultado predefinido (éxito o error) según el panel de control de la demo. No hay red ni credenciales.
- **Saneamiento del HTML del cuerpo (HU-17)** → **no se ejecuta**; se representa como nota/anotación ("en el producto, el backend sanea el cuerpo"). No es validable visualmente por el cliente.
- **Validación autoritativa en servidor (HU-18)** → **no se ejecuta**; la demo solo muestra la validación de **cliente** (E3/E4). Se anota que el servidor la repite.
- **Editor React Quill** → toolbar falso; el formato es cosmético (no genera HTML real).
- **Adjunto** → no se sube ni se lee el fichero real; se simulan nombre y tamaño para disparar los avisos de tipo/tamaño.
- **Logs (HU-04)** → fuera de la demo (traza de servidor, no visible en UI).

## 6. Datos de ejemplo

Coherentes con el dominio de correo, para poblar los estados:

- **Para:** `ana.lopez@empresa.com`, `soporte@cliente.es`
- **CC:** `jefe.proyecto@empresa.com`  · **CCO:** `auditoria@empresa.com`
- **Email inválido de prueba (E3):** `ana.lopez@` , `correo-sin-arroba`
- **Asunto:** `Propuesta de colaboración — revisión`
- **Cuerpo:** párrafo con una palabra en **negrita**, otra en *cursiva* y una lista de 3 ítems.
- **Adjunto válido:** `propuesta.pdf` (2,4 MB) · **Tipo no permitido (E4):** `script.exe` · **Tamaño excedido (E4):** `video.mp4` (18 MB).

## 7. Supuestos y exclusiones

**Supuestos**
- Fidelidad **wireframe**: sin paleta ni tipografía de marca (se decide en la guía de estilos, paso 2.3). La estructura y los campos sí son definitivos.
- La demo se entrega como HTML estático navegable (booster-ux); un panel de control propio de la demo permite forzar los estados de resultado.

**Exclusiones (fuera de la demo)**
- Envío real, SMTP, Nodemailer y variables de entorno.
- Saneamiento de HTML (HU-17) y validación autoritativa en servidor (HU-18): se anotan, no se ejecutan.
- Habilitadores F0 (monorepo, Docker Compose, endpoint, logs): internos, no validables por el cliente.
- Persistencia, historial, reintentos, múltiples adjuntos, autenticación, anti-abuso (ya fuera de alcance en `requisitos.md` §6).

## 8. Pasos mínimos de implementación

1. **Aprobar** este documento (gate humano).
2. Ejecutar **`aidd prototype`** (paso 2.2), que redirige a **booster-ux** para maquetar la pantalla del compositor en **wireframe**.
3. Generar la vista base **E1 (formulario vacío)** con los campos Para/CC/CCO (chips), Asunto, Cuerpo (toolbar simulado) y Adjunto; interfaz en español.
4. Añadir los estados **E2–E7** como variantes navegables (datos de §6), incluyendo los avisos de validación (E3), rechazo de adjunto (E4), enviando (E5), éxito con limpieza (E6) y error con datos conservados (E7).
5. Cablear el **mock de envío** en JS (`mockSend()` + panel de control de la demo) para alternar éxito/error.
6. Revisar el recorrido **E1→E7** de punta a punta sin bloqueos.
7. **Presentar al cliente**, recoger feedback y **actualizar `docs/cliente-requisitos.md`**. Si hay cambios significativos, volver al paso 1.1 (`aidd requirements`).

## 9. Decisiones tomadas en el paso 2.1

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Fidelidad visual de la demo | Alta (Tailwind) / Media / **Baja (wireframe)** | **Baja (wireframe)** | usuario | Valida estructura y campos sin depender de la marca (pendiente NFR-12); itera rápido. |
| 2 | Flujos y estados a cubrir | **Completo** / Happy path + adjunto / Solo happy path | **Completo (éxito + validación + error + adjunto)** | usuario | Recorre el alcance funcional F1–F4 y expone las validaciones al cliente. |
| 3 | Enfoque técnico del prototipo | **HTML/CSS estático (booster-ux)** / React+Vite mock | **HTML/CSS estático (booster-ux)** | usuario | Sin build ni backend; la demo se abre con doble clic y es fácil de iterar. |
| 4 | Trato del saneamiento (HU-17) y validación servidor (HU-18) | Simular / **Anotar sin ejecutar** | **Anotar sin ejecutar** | default | No son validables visualmente; se documentan como comportamiento del producto real. |
| 5 | Habilitadores F0 en la demo | Incluir / **Excluir** | **Excluir** | default | Son internos (monorepo, Docker, endpoint, logs); no aportan a la validación con el cliente. |

## 10. Estado de implementación (paso 2.2 · `aidd prototype`)

Prototipo implementado con **booster-ux** (2026-07-08). Una única pantalla (el compositor) con los estados E1–E7 accesibles vía panel de control de la demo.

| Pantalla | Estados | Estado | Entregables |
|----------|---------|--------|-------------|
| Compositor de email | E1–E7 (vacío, compuesto, validación, adjunto rechazado, enviando, éxito, error) | ✅ Hecho | `docs/prototipo/index-v1.html` + `preview-v1.png` (v1 editorial) · `docs/prototipo/index-v2.html` + `preview-v2.png` (v2 Web Interface Guidelines) · notas `notes-v1.md`, `notes-v2.md` |

Dos variantes en fidelidad **wireframe** (grises, sin marca — coherente con la decisión #1 y NFR-12 pendiente), sin marca de agua. Envío mockeado en JS.

**Prototipo aprobado (2026-07-08).** La elección/síntesis de variante y la identidad visual definitiva se resuelven en `aidd style-guide` (paso 2.3); el prototipo se re-vestirá con esas pautas. Se conservan v1 y v2 como referencia (v2 aporta la línea base de accesibilidad/semántica).

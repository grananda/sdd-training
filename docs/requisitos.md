# Requisitos — Servicio Web de Envío de Email (aidd-training)

> Documento de Fase 1 (AIDD · paso 1.1). Generado por `aidd requirements`.
> Entrada: docs/cliente-requisitos.md. Salida hacia: docs/mapa-historias-usuario.md.
> **Aprobado (2026-07-03; re-aprobado 2026-07-07 tras enmienda).** **Enmienda (2026-07-07):** la identidad visual pasa a **pendiente de definir** (se retira la referencia a una marca concreta que no figuraba en el brief de Fase 0). Nota: el proveedor y las credenciales SMTP quedan pendientes de definir (ver §7 y §8); el requisito estable es que el SMTP sea configurable por variables de entorno.

## 1. Descripción del sistema y objetivos

Aplicación web con interfaz de usuario para **componer y enviar un correo electrónico** desde un formulario. El usuario redacta el mensaje con **formato enriquecido**, define destinatarios (Para, CC, CCO), adjunta opcionalmente **un único documento** y envía; el backend realiza el **envío real vía SMTP** con Nodemailer.

Es un **proyecto de formación** (repositorio `aidd-training`) para ejercitar el flujo AIDD de extremo a extremo sobre una funcionalidad acotada. Despliegue **solo local con Docker**.

**Objetivos medibles:**
- O-1: El usuario puede enviar un email con Para/CC/CCO, asunto, cuerpo con formato y un adjunto en un único formulario, sin cliente de correo externo.
- O-2: El backend entrega el correo a un servidor SMTP configurable por variables de entorno, con resultado (éxito/error) visible en la UI.
- O-3: El sistema valida entradas (destinatarios, campos obligatorios, tipo/tamaño de adjunto) y sanea el cuerpo HTML antes del envío.

## 2. Usuarios y roles

| Rol | Descripción | Permisos / responsabilidades |
|-----|-------------|------------------------------|
| **Remitente (usuario final)** | Persona que accede a la web y envía correos. Rol único. | Acceso abierto (sin autenticación). Rellenar el formulario, adjuntar un documento, enviar. |
| **Servidor SMTP** *(actor externo, no usuario)* | Servicio de correo saliente configurado por variables de entorno. | Recibir del backend y entregar el correo. Dependencia externa. |

No existen roles administrativos ni de gestión.

## 3. Requisitos funcionales

| ID | Requisito | Actor | Prioridad |
|----|-----------|-------|-----------|
| RF-01 | El sistema muestra un formulario de composición de email con los campos: Para, CC, CCO, Asunto, Cuerpo y Adjunto. | Remitente | Alta |
| RF-02 | El campo **Para** admite **una o varias** direcciones de correo. | Remitente | Alta |
| RF-03 | Los campos **CC** y **CCO** admiten **una o varias** direcciones de correo cada uno, y son opcionales. | Remitente | Alta |
| RF-04 | El sistema valida que cada dirección introducida (Para, CC, CCO) tenga **formato de email válido** antes de permitir el envío. | Sistema | Alta |
| RF-05 | El campo **Asunto** es un texto de una línea. | Remitente | Alta |
| RF-06 | El **Cuerpo** se edita con un **editor de texto enriquecido minimalista** (React Quill) con un conjunto acotado de opciones de formato: **negrita, cursiva y listas** (ordenada y no ordenada). No es texto plano ni un editor completo. | Remitente | Alta |
| RF-07 | El usuario puede **adjuntar un único documento** (opcional) al email. | Remitente | Alta |
| RF-08 | El sistema **valida el tipo** del adjunto, permitiendo solo esta lista básica: **JPG, GIF, PDF, Word (doc/docx), Excel (xls/xlsx) y PowerPoint (ppt/pptx)**. | Sistema | Alta |
| RF-09 | El sistema **valida el tamaño** del adjunto, rechazando los que superen **10 MB**. | Sistema | Alta |
| RF-10 | Para poder enviar, son **obligatorios**: al menos un destinatario en **Para**, **Asunto** no vacío y **Cuerpo** no vacío. CC, CCO y adjunto son opcionales. | Sistema | Alta |
| RF-11 | Al pulsar **Enviar**, el sistema envía el correo **directamente**, sin diálogo de confirmación ni vista previa previa. | Remitente | Media |
| RF-12 | El **backend sanea el HTML** del cuerpo antes de construir y enviar el correo, eliminando contenido potencialmente peligroso (XSS/inyección). | Sistema | Alta |
| RF-13 | El backend **envía el correo vía SMTP** (Nodemailer) usando la configuración de variables de entorno, incluyendo cuerpo con formato (HTML) y el adjunto si existe. | Sistema | Alta |
| RF-14 | Tras el envío, la UI muestra **feedback de resultado**: mensaje de **éxito** o de **error** según la respuesta del backend. | Sistema | Alta |
| RF-15 | El backend **registra en logs** el resultado de cada envío (éxito/error, destinatarios, asunto, timestamp), **sin persistir el contenido** del correo. | Sistema | Media |
| RF-16 | El backend **valida en servidor** los campos obligatorios, el formato de direcciones y el tipo/tamaño del adjunto (no confía solo en la validación de frontend). | Sistema | Alta |

## 4. Requisitos no funcionales

| ID | Requisito |
|----|-----------|
| NFR-01 | **Idioma**: la interfaz de usuario está en **español**. |
| NFR-02 | **Seguridad — sanitización**: el cuerpo HTML se sanea en backend antes del envío para evitar XSS/inyección. |
| NFR-03 | **Seguridad — secretos**: las credenciales SMTP se gestionan mediante variables de entorno; nunca en el código ni expuestas al frontend. |
| NFR-04 | **Sin autenticación**: el formulario es de acceso abierto (aceptable por alcance de formación y despliegue local no expuesto). |
| NFR-05 | **Sin medidas anti-abuso** (rate limiting, captcha): fuera de alcance por tratarse de despliegue local no público. |
| NFR-06 | **Sin persistencia**: no hay base de datos; el envío es *fire-and-forget* con traza únicamente en logs. |
| NFR-07 | **RGPD**: sin requisitos legales/RGPD específicos aplicables (sin datos reales de terceros ni retención de contenido). |
| NFR-08 | **Portabilidad / despliegue**: la aplicación se ejecuta **solo en local con Docker** (Docker Compose para frontend + backend). |
| NFR-09 | **Configurabilidad**: el servidor SMTP (host, puerto, seguridad, credenciales) es configurable por variables de entorno sin recompilar. |
| NFR-10 | **Usabilidad**: el envío se realiza desde un único formulario con feedback claro de éxito/error tras cada intento. |
| NFR-11 | **Validación defensiva**: toda validación crítica (obligatorios, formato de email, tipo/tamaño de adjunto) se aplica también en el backend. |
| NFR-12 | **Identidad visual**: **pendiente de definir**. El cliente aún no ha aportado guía de marca (paleta, tipografía, logotipo, componentes); se formalizará en la guía de estilos (Fase 2). |

## 5. Restricciones técnicas no negociables

- **Frontend**: React con **TypeScript** y **Tailwind CSS**; editor de cuerpo con **React Quill**.
- **Backend**: Node.js + **Express** con **TypeScript**; envío con **Nodemailer** sobre un **SMTP configurable por variables de entorno**. El proveedor concreto está **pendiente de definir** (candidatos: SMTP de pruebas en desarrollo local —MailHog/Mailpit/Mailtrap/Ethereal—, Gmail u otro proveedor transaccional). El código no se ata a un proveedor: solo a la configuración SMTP.
- **Monorepo**: **Turborepo** con **pnpm** (workspaces).
- **Despliegue**: **Docker** (Docker Compose) en **local** exclusivamente.
- **Persistencia**: **sin base de datos**; solo logs de servidor.
- **Adjunto**: **uno solo**; tipos permitidos: **JPG, GIF, PDF, Word, Excel, PowerPoint**; **máximo 10 MB**.
- **Identidad visual**: **pendiente de definir** (sin guía de marca aportada por el cliente; se concretará en la guía de estilos, Fase 2).

## 6. Alcance

**Dentro de esta fase:**
- Formulario web de composición y envío de un email (Para/CC/CCO múltiples, Asunto, Cuerpo enriquecido, un adjunto).
- Validación en frontend y backend (obligatorios, formato de email, tipo/tamaño de adjunto).
- Saneamiento del HTML del cuerpo en backend.
- Envío real vía SMTP con Nodemailer y configuración por variables de entorno.
- Feedback de éxito/error en la UI.
- Registro en logs del resultado del envío.
- Empaquetado y ejecución local con Docker Compose.

**Fuera de esta fase:**
- Autenticación, autorización o gestión de usuarios.
- Medidas anti-abuso (rate limiting, captcha).
- Persistencia de correos enviados / historial / bandeja / reintentos.
- Múltiples adjuntos por email.
- Plantillas de correo, borradores, programación de envíos.
- Despliegue en cloud/PaaS y entregabilidad avanzada (SPF/DKIM/gestión de reputación).
- Análisis antivirus de adjuntos.
- Internacionalización (i18n) más allá del español.

## 7. Variables de entorno y configuración requerida

> Sin valores reales de secretos. Los valores concretos del SMTP quedan **pendientes de definir por el usuario**; la columna muestra ejemplos según el proveedor.

| Variable | Propósito | Ejemplo (según proveedor) |
|----------|-----------|---------------------------|
| `SMTP_HOST` | Host del servidor SMTP. | `mailhog` (dev) · `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP. | `1025` (MailHog) · `587` (STARTTLS) |
| `SMTP_SECURE` | TLS/SSL directo (true) o STARTTLS/none (false). | `false` |
| `SMTP_USER` | Usuario de autenticación SMTP. | *(según proveedor; vacío en MailHog)* |
| `SMTP_PASSWORD` | Contraseña / contraseña de aplicación / API key. | *(secreto; vacío en MailHog)* |
| `MAIL_FROM` | Dirección remitente por defecto (From). | — |
| `MAX_ATTACHMENT_SIZE_MB` | Límite de tamaño de adjunto. | `10` |
| `PORT` | Puerto de escucha del backend Express. | — |
| `WEB_ORIGIN` / CORS | Origen permitido del frontend para CORS en local. | — |

## 8. Preguntas abiertas y pendientes

No hay preguntas **bloqueantes** para arrancar el paso 1.2. Todas las pendientes de la iteración anterior han quedado resueltas (ver sección 9). Quedan solo detalles de implementación/configuración a concretar en fases posteriores:

- **Definir el proveedor SMTP y sus variables de entorno** (host, puerto, credenciales). Decisión aplazada por el usuario; no bloquea el diseño porque el SMTP es configurable.
- Whitelist final de **etiquetas/atributos HTML** tras el saneamiento del cuerpo, coherente con el toolbar minimalista (bold, italic, listas).
- **Guía de marca / assets visuales** (paleta, tipografía, logotipo) para la guía de estilos (Fase 2): **pendiente de aportar por el cliente**.

## 9. Decisiones tomadas en el paso 1.1

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Multiplicidad de destinatarios (Para/CC/CCO) | Varias en los tres / Una en Para y varias en CC-CCO / Una en cada uno | **Varias en los tres** | usuario | Comportamiento habitual de un cliente de correo (RF-02, RF-03). |
| 2 | Campos obligatorios para enviar | Para+asunto+cuerpo / Solo Para / Para+cuerpo | **Para + asunto + cuerpo** | usuario | Evita envíos incompletos; CC/CCO/adjunto opcionales (RF-10). |
| 3 | Confirmación / vista previa antes de enviar | Sin confirmación / Diálogo / Vista previa | **Sin confirmación, feedback tras enviar** | usuario | Flujo simple acorde al alcance de formación (RF-11, RF-14). |
| 4 | Validación en servidor además de frontend | Sí / Solo frontend | **También en backend** | default | Buena práctica de seguridad; el frontend no es fiable (RF-16, NFR-11). |
| 5 | Servidor SMTP de envío | Gmail / Otro SMTP / Sandbox (MailHog…) | **Configurable por env; proveedor pendiente de definir** | usuario | El usuario aplaza los envs SMTP; el requisito estable es SMTP configurable (§5, §7, §8, RF-13). |
| 6 | Opciones de formato del editor | Minimalista / Completo | **Minimalista: negrita, cursiva, listas** | usuario | Editor acotado acorde al alcance (RF-06). |
| 7 | Tipos de adjunto permitidos | Básicos / Amplios | **JPG, GIF, PDF, Word, Excel, PowerPoint** | usuario | Lista blanca cerrada (RF-08). |
| 8 | Identidad visual de la UI | Marca aportada por el cliente / Genérica / Pendiente | **Pendiente de definir** | — | El brief (cliente-requisitos §8) no aporta guía de marca; se concretará en la guía de estilos, Fase 2 (NFR-12). |

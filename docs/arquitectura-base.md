# Arquitectura base — Servicio Web de Envío de Email (aidd-training)

> **Versión 3** · **Generado:** 2026-07-08 12:58 CEST
> Documento de Fase 2 (AIDD · paso 2.4). Generado por `aidd architecture`.
> Fuentes de verdad: detalle-historias-usuario.md, propuesta-arquitectura-base.md, guia-estilos.md.
> Insumo principal del roadmap. **Aprobado (2026-07-08). Cierra la Fase 2.**
>
> Consolida la arquitectura **definitiva e implementable**. No contradice las fuentes de entrada; el único punto abierto (proveedor SMTP) se documenta como decisión pendiente (§13). El prototipo (2.2) fue aprobado; su validación con cliente y el feedback se incorporarían a `cliente-requisitos.md` antes de construir.

## 1. Objetivo y alcance

Aplicación web de **una sola pantalla** para **componer y enviar un correo** (Para/CC/CCO, asunto, cuerpo enriquecido y un adjunto único) con **envío real vía SMTP**. Proyecto de formación; despliegue **solo local con Docker**; **sin persistencia**.

**Dentro:** formulario de composición, validación cliente y servidor, saneamiento del cuerpo, envío con Nodemailer, feedback de resultado, logs. **Fuera:** autenticación, anti-abuso, persistencia/historial/reintentos, múltiples adjuntos, cloud (ver `requisitos.md` §6).

Cubre las 18 HU (F0–F4). Este documento es consumible directamente para fasear el roadmap.

## 2. Principios y decisiones arquitectónicas

- **Contrato único compartido.** El esquema del email (campos, reglas, límites) vive una sola vez en `packages/shared` (Zod) y lo consumen cliente y servidor. Evita divergencia cliente/servidor (NFR-11, HU-18).
- **El servidor es la autoridad.** La validación de cliente es conveniencia/UX; la validación autoritativa y el saneamiento del HTML ocurren en el backend (HU-17, HU-18). El frontend no es de fiar.
- **Sin estado ni persistencia.** Envío *fire-and-forget*; la única traza es el log de servidor (NFR-06). No hay BD, sesión ni store global.
- **Configurable, no acoplado.** El SMTP se define por variables de entorno; el código no se ata a un proveedor (RF-13, NFR-03/09).
- **Seguridad por defecto.** Secretos solo por env; saneamiento con whitelist; límites aplicados también en servidor.
- **Accesible por defecto (WCAG 2.1 AA).** Tokens y componentes de `guia-estilos.md`: foco visible, hit targets ≥44px, semántica, `aria-live`.
- **Simplicidad proporcional al alcance.** Una pantalla, un endpoint, sin capas innecesarias (sin SSR, sin Redux, sin colas).

**Conflictos entre fuentes:** no se detectaron. La guía de estilos, la propuesta y el detalle de historias son coherentes (misma estructura de una pantalla, mismo whitelist de saneamiento, mismos límites de adjunto).

## 3. Estructura de la solución (árbol de carpetas real)

```
aidd-training/
├── apps/
│   ├── web/                          # Frontend React + Vite + TS + Tailwind
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── EmailForm.tsx          # Orquesta el formulario (RHF)
│   │   │   │   ├── RecipientChips.tsx      # Para/CC/CCO con chips
│   │   │   │   ├── SubjectField.tsx        # Asunto (una línea)
│   │   │   │   ├── BodyEditor.tsx          # React Quill (B/I/listas)
│   │   │   │   ├── AttachmentField.tsx     # Adjunto único + validación cliente
│   │   │   │   ├── SubmitBar.tsx           # Botón Enviar + estado enviando
│   │   │   │   └── FeedbackBanner.tsx      # Éxito/error (aria-live)
│   │   │   ├── hooks/
│   │   │   │   └── useSendEmail.ts         # fetch FormData + estado envío
│   │   │   ├── lib/
│   │   │   │   ├── apiClient.ts            # POST /api/send
│   │   │   │   └── errorMap.ts             # code -> mensaje UI (es)
│   │   │   ├── styles/
│   │   │   │   └── tokens.css              # design tokens de guia-estilos.md
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── tailwind.config.ts              # tokens NTT DATA
│   │   ├── vite.config.ts
│   │   └── Dockerfile
│   └── api/                          # Backend Express + TS
│       ├── src/
│       │   ├── routes/
│       │   │   └── send.route.ts          # POST /api/send
│       │   ├── controllers/
│       │   │   └── send.controller.ts      # orquesta validar→sanear→enviar→log
│       │   ├── services/
│       │   │   ├── mailer.ts               # Nodemailer transporter + send
│       │   │   ├── sanitizer.ts            # sanitize-html (whitelist)
│       │   │   └── attachment.ts           # file-type (MIME real) + límites
│       │   ├── middleware/
│       │   │   ├── upload.ts               # Multer memoryStorage (1 fichero)
│       │   │   ├── validate.ts             # Zod (esquema shared)
│       │   │   ├── cors.ts                 # origen WEB_ORIGIN
│       │   │   └── errorHandler.ts         # contrato de error uniforme
│       │   ├── config/
│       │   │   └── env.ts                  # carga + valida env (Zod)
│       │   ├── logger.ts                   # pino
│       │   ├── app.ts                      # Express app
│       │   └── server.ts                   # arranque (PORT)
│       └── Dockerfile
├── packages/
│   └── shared/
│       └── src/
│           ├── email.schema.ts            # emailSchema (Zod): campos + reglas
│           ├── attachment.rules.ts        # tipos permitidos + MAX 10 MiB
│           └── index.ts                    # exports (tipos + esquemas)
├── docker-compose.yml                # web + api + mailpit (dev)
├── turbo.json
├── package.json                      # workspaces (pnpm)
├── pnpm-workspace.yaml
├── .env.example                      # SMTP_*, MAIL_FROM, MAX_ATTACHMENT_SIZE_MB, PORT, WEB_ORIGIN
└── docs/                             # documentación AIDD (fuente de verdad)
```

## 4. Descomposición por módulos / dominios

| Módulo | Ubicación | Responsabilidad | HU |
|--------|-----------|-----------------|----|
| **Contrato de email** | `packages/shared` | Esquema Zod, tipos, límites y lista de tipos permitidos. Fuente única. | HU-08, HU-12–14, HU-18 |
| **Composición (UI)** | `apps/web/components` | Formulario y campos: chips, asunto, editor, adjunto, envío, feedback. | HU-05–16 |
| **Cliente de envío** | `apps/web/hooks` + `lib` | Construye FormData, llama al backend, mapea resultado/errores. | HU-15, HU-16 |
| **Endpoint de envío** | `apps/api/routes` + `controllers` | Recibe la petición y orquesta el pipeline. | HU-03, HU-18 |
| **Saneamiento** | `apps/api/services/sanitizer` | Limpia el HTML del cuerpo con whitelist. | HU-17 |
| **Adjunto** | `apps/api/services/attachment` + `middleware/upload` | Parsea, valida tipo (MIME real) y tamaño. | HU-11–13 |
| **Mailer** | `apps/api/services/mailer` | Transporter Nodemailer y envío SMTP. | HU-03 |
| **Config y observabilidad** | `apps/api/config` + `logger` | Carga/valida env; log del resultado sin secretos. | HU-04 |

## 5. Capas y responsabilidades

**Frontend (por responsabilidad, no por framework):**
1. **Presentación** — componentes de `guia-estilos.md` (tokens, AA). Sin lógica de negocio.
2. **Estado de formulario** — React Hook Form + resolver Zod (esquema de `shared`).
3. **Acceso a datos** — `useSendEmail` + `apiClient` (fetch, FormData, mapeo de errores).

**Backend (pipeline de `POST /api/send`):**
1. **Ruta** → 2. **Upload** (Multer memoria, 1 fichero) → 3. **Validación** (Zod + `file-type` para MIME real) → 4. **Saneamiento** (`sanitize-html`) → 5. **Mailer** (Nodemailer) → 6. **Logger** (pino) → 7. **Error handler** (respuesta uniforme sin filtrar secretos).

**Compartida:** `packages/shared` no depende de web ni de api; ambos dependen de ella.

## 6. Componentes base y relaciones

- `EmailForm` (contenedor RHF) compone `RecipientChips` ×3 (To/CC/CCO), `SubjectField`, `BodyEditor`, `AttachmentField`, `SubmitBar` y `FeedbackBanner`.
- `EmailForm` → `useSendEmail` → `apiClient` → `POST /api/send`.
- `apiClient` traduce la respuesta `{ ok, code, message }` con `errorMap` para el `FeedbackBanner`.
- Backend: `send.route` → `upload` → `validate` → `send.controller` → (`sanitizer`, `attachment`, `mailer`, `logger`) → `errorHandler`.
- Todos los componentes de UI aplican los **design tokens** (`styles/tokens.css` + `tailwind.config`) y las reglas de accesibilidad de la guía.

## 7. Flujos principales de información

**Envío con éxito (happy path):**
1. Usuario compone; RHF valida en cliente con el esquema de `shared` (HU-08, HU-14).
2. Al pulsar Enviar, `useSendEmail` deshabilita el botón y monta `FormData` (campos + adjunto) (HU-15).
3. `POST /api/send` → upload → validación autoritativa (obligatorios, emails, tipo+tamaño+MIME real) → saneamiento del cuerpo → Nodemailer entrega al SMTP (HU-03, HU-17, HU-18).
4. Log del resultado (sin contenido ni secretos) (HU-04).
5. Respuesta `{ ok: true }` → `FeedbackBanner` de éxito → formulario se limpia (HU-16).

**Rutas de error:**
- Validación de cliente falla → no se envía; se marcan campos (HU-08, HU-14).
- Validación de servidor falla (petición que burla el cliente) → `4xx { ok:false, code }` → banner de error; datos conservados (HU-16, HU-18).
- Adjunto no permitido / >10 MiB → rechazo con aviso (HU-12, HU-13).
- Fallo SMTP → `5xx` controlado sin filtrar credenciales → banner de error; datos conservados (HU-03, HU-16).

## 8. Gestión de estado

- **Local a la pantalla**, con React Hook Form. Sin store global (Redux/Zustand/Context de app): no hay estado compartido entre vistas (una sola pantalla, sin sesión, sin persistencia — NFR-06).
- **Chips** (Para/CC/CCO): estado interno de `RecipientChips`, expuesto a RHF como arrays de direcciones.
- **Adjunto:** un único `File` en el estado del formulario.
- **Estado de envío:** `idle | sending | success | error` en `useSendEmail`, que gobierna botón, spinner y banner.
- **Backend sin estado** entre peticiones (salvo el `transporter` reutilizable).

## 9. Navegación y organización de pantallas / endpoints

- **Frontend:** una sola ruta (`/`), sin router de múltiples vistas. Layout: cabecera → hoja de composición (Para → CC/CCO → Asunto → Cuerpo → Adjunto) → barra de acción (feedback + Enviar). El panel de estados del prototipo **no** forma parte del producto.
- **Backend (API):**

| Método | Ruta | Cuerpo | Respuesta | HU |
|--------|------|--------|-----------|----|
| `POST` | `/api/send` | `multipart/form-data`: `to[]`, `cc[]`, `bcc[]`, `subject`, `body` (HTML), `attachment?` | `200 { ok:true, message }` / `4xx|5xx { ok:false, code, message }` | HU-03, HU-16, HU-18 |
| `GET` | `/api/health` | — | `200 { status:"ok" }` | HU-01 (health-check) |

## 10. Integración con APIs y servicios externos

- **Único integrante externo: servidor SMTP** vía Nodemailer. Configurado por `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`. El `transporter` se crea una vez y se reutiliza.
- **Desarrollo:** servicio **Mailpit** (`axllent/mailpit`) en `docker-compose.yml`, SMTP en `1025` y UI web en `8025`, para probar el envío sin proveedor real y previsualizar HTML + adjuntos.
- **Producción/formación real:** proveedor SMTP configurable por env; el código no cambia. **Proveedor y credenciales concretos: pendientes** (§13).
- Sin otras integraciones (ni BD, ni auth externa, ni antivirus de adjuntos — fuera de alcance).

## 11. Seguridad, accesibilidad, observabilidad y rendimiento

**Seguridad**
- Saneamiento del cuerpo en servidor con whitelist (`b/strong`, `i/em`, `ul`, `ol`, `li`, `p`, `br`); se eliminan `<script>`, `on*`, iframes, enlaces e imágenes (HU-17, NFR-02).
- Validación autoritativa en servidor de todo lo del cliente (HU-18, NFR-11).
- Tipo de adjunto por **MIME real** (`file-type`) además de la extensión (HU-12).
- Secretos solo por env; `.env.example` sin secretos; logs sin credenciales ni contenido (NFR-03/06).
- Límite de 10 MiB también en Multer (no cargar adjuntos gigantes en memoria).
- CORS restringido a `WEB_ORIGIN`.
- Aceptado por alcance: sin auth ni anti-abuso (NFR-04/05); sin antivirus de adjuntos.

**Accesibilidad (WCAG 2.1 AA)** — de `guia-estilos.md`: contraste AA, `:focus-visible`, hit targets ≥44px, semántica (`header/main/aside/footer`, labels), teclado (Enter envía, Esc descarta, chips borrables), `aria-live` en feedback, estado nunca solo por color, `prefers-reduced-motion`.

**Observabilidad** — pino registra por envío: resultado, destinatarios, asunto y timestamp (HU-04, RF-15). Sin contenido del correo ni del adjunto (NFR-06).

**Rendimiento** — SPA ligera (Vite); `transporter` reutilizado; adjunto en memoria acotado a 10 MiB; sin trabajo pesado en el hilo de la petición más allá del envío.

## 12. Escalabilidad, mantenibilidad y extensibilidad

- **Escalabilidad:** backend sin estado → escalado horizontal trivial si algún día se necesitara; hoy basta una instancia en Compose. El punto de I/O es el SMTP.
- **Mantenibilidad:** contrato único en `shared`; capas con responsabilidad clara; contrato de error uniforme; tokens de diseño centralizados.
- **Extensibilidad (puntos naturales, hoy fuera de alcance):** cola + reintentos delante del envío; persistencia/historial añadiendo una capa de repositorio; múltiples adjuntos ampliando `attachment.rules` y el `upload`; auth como middleware. Ninguno se implementa ahora.

## 13. Riesgos técnicos, supuestos y decisiones pendientes

**Decisiones pendientes**
- **Proveedor y credenciales SMTP definitivos** (`requisitos.md` §7/§8): no bloqueante; el SMTP es configurable y en dev se usa MailHog/Mailpit. **[Pendiente, no bloqueante]**

**Supuestos**
- El prototipo (2.2) se valida con cliente y el feedback se incorpora a `cliente-requisitos.md` antes de construir; esta arquitectura asume el alcance actual sin cambios mayores.
- Whitelist de saneamiento y lista de tipos de adjunto son las fijadas en el detalle de historias.

**Riesgos**
- **Entregabilidad SMTP real** (SPF/DKIM, spam) si se usa un proveedor real: mitigado en dev con Mailpit; a vigilar en real.
- **Adjuntos maliciosos:** no se analizan (sin antivirus); riesgo aceptado por alcance.
- **Formulario abierto** sin anti-abuso: aceptado por despliegue local no expuesto.

## 14. Decisiones tomadas en el paso 2.4

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Conflictos entre fuentes de entrada | Resolver / — | **Sin conflictos** | default | Detalle, propuesta y guía de estilos son coherentes; no hay contradicciones que resolver. |
| 2 | Router en el frontend | Añadir router / **Una sola ruta** | **Una sola ruta (`/`)** | default | Producto de una sola pantalla; un router añadiría complejidad sin valor (HU-05). |
| 3 | Contrato del endpoint | `multipart/form-data` / JSON+base64 | **`multipart/form-data`** | default | El adjunto binario viaja de forma natural; evita inflar el payload (HU-11). |
| 4 | Health-check | Incluir `/api/health` / No | **Incluir `/api/health`** | default | Facilita orquestación en Docker y verificación del walking skeleton (HU-01). |
| 5 | Proveedor SMTP definitivo | Fijar ahora / **Dejar pendiente (configurable)** | **Pendiente, configurable por env; Mailpit en dev** | usuario (heredado) | El usuario aplazó el proveedor; el requisito estable es SMTP configurable (§13). |
| 6 | Capturador de correo en dev | **Mailpit** / MailHog | **Mailpit** (`axllent/mailpit`, puertos 1025/8025) | usuario | Mantenido y con mejor vista de HTML y adjuntos; drop-in sobre los puertos de MailHog (relevante porque se envía cuerpo HTML + adjunto). |

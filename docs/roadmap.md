# Roadmap de desarrollo — Servicio Web de Envío de Email (aidd-training)

> **Versión 1** · **Generado:** 2026-07-11
> Documento de Fase 3 (AISDD). Generado por `aisdd roadmap` (skill `aisdd-specs` v1.1.1).
> Fuentes: docs/arquitectura-base.md, docs/mapa-historias-usuario.md, docs/detalle-historias-usuario.md, docs/sprint-plan.md, docs/planificacion-proyecto.md, docs/plan-revision-hu.md.
> Faseado **alineado a la capa de entrega**: `docs/sprint-plan.md` (aprobado 2026-07-09, volcado a Jira: proyecto `AT`, board 34).

## 1. Presupuesto de contexto y complejidad

| Parámetro | Valor | Justificación |
|-----------|-------|---------------|
| Presupuesto de contexto | **alto** | Modelo de la sesión: Claude Fable 5 (ventana >200k tokens). El volumen documental es pequeño (~10 documentos cortos en `docs/`) y no hay código previo que arrastrar. |
| Complejidad | **baja-media** | Un solo dominio funcional (componer y enviar un email), una integración externa (SMTP vía Nodemailer), sin persistencia, sin migraciones ni auth. Media puntual en seguridad (saneamiento HTML, validación autoritativa). |
| Nº de fases | **7** | Con contexto alto el rango orientativo es 3–6, pero se amplía a 7 deliberadamente: (a) el proyecto es un **workshop** que necesita ciclos cortos y demostrables (decisión registrada en `mapa-historias-usuario.md` §7); (b) los cortes coinciden con los bloques F0–F4 del mapa de HU y con los gates de revisión del `plan-revision-hu.md`; (c) ninguna fase mezcla más de un objetivo funcional principal. Cada fase se abre como **un único change OpenSpec** de contexto muy acotado. |

**Regla de jerarquía aplicada:** el presupuesto de contexto decide el tamaño de cada change; el sprint plan decide el orden, las fronteras y qué HU están comprometidas. Ninguna HU se parte entre fases y ninguna fase cruza una frontera de sprint.

## 2. Resumen de fases

| Fase | Nombre | change (slug) | HU | Sprint | Real IA | Bruto | Riesgo contexto |
|------|--------|---------------|----|--------|---------|-------|-----------------|
| 1 | Foundation: monorepo y Docker | `foundation` | HU-01, HU-02 | Sprint 1 | 0,4 d | 3,0 d | bajo |
| 2 | Backend de envío SMTP y logs | `api-envio-smtp` | HU-03, HU-04 | Sprint 1 | 0,9 d | 3,5 d | bajo |
| 3 | UI de composición | `ui-composicion` | HU-05, HU-06, HU-07, HU-09, HU-10 | Sprint 1 | 1,8 d | 7,0 d | medio |
| 4 | Envío desde la UI y feedback | `ui-envio-feedback` | HU-15, HU-16 | Sprint 1 | 0,5 d | 2,0 d | bajo |
| 5 | Validación de cliente | `validacion-cliente` | HU-08, HU-14 | Sprint 2 | 0,2 d | 1,0 d | bajo |
| 6 | Adjunto único con validaciones | `adjunto` | HU-11, HU-12, HU-13 | Sprint 2 | 1,0 d | 3,5 d | bajo |
| 7 | Endurecimiento de servidor | `endurecimiento-servidor` | HU-17, HU-18 | Sprint 2 | 1,3 d | 4,5 d | medio |
| | **Total** | | **18 HU** | | **6,1 d** | **24,5 d** | |

Esfuerzos por HU tomados de `docs/sprint-plan.md` §2 (real con IA / bruto humano de referencia).

## 3. Detalle de fases

### Fase 1 — Foundation: monorepo y Docker (`foundation`)

- **Sprint:** Sprint 1 (10–14 ago 2026) · **HU:** HU-01, HU-02 · **Esfuerzo:** 0,4 d IA / 3,0 d bruto.
- **Objetivo:** dejar el esqueleto ejecutable: monorepo Turborepo + pnpm con `apps/web` (React + Vite + TS + Tailwind), `apps/api` (Express + TS) y `packages/shared`, levantado en local con Docker Compose (web + api + **Mailpit**).
- **Alcance:** estructura de carpetas de `arquitectura-base.md` §3; `turbo.json`, `pnpm-workspace.yaml`, Dockerfiles, `docker-compose.yml`, `.env.example`, endpoint `GET /api/health`, tokens de diseño base (`tokens.css`, `tailwind.config.ts`).
- **Exclusiones:** ninguna lógica de negocio — ni envío, ni formulario funcional. Solo walking skeleton.
- **Dependencias:** ninguna (primera fase).
- **Entregables OpenSpec:** change `foundation` (proposal, design, specs, tasks) archivado.
- **Criterios de cierre:** `docker compose up` levanta web + api + Mailpit; `GET /api/health` responde `200`; `pnpm build`/`pnpm dev` funcionan vía Turborepo; criterios `[IMPRESCINDIBLE]` de HU-01 y HU-02.
- **Riesgo de contexto:** bajo (solo scaffolding, sin dependencias de código previo).

### Fase 2 — Backend de envío SMTP y logs (`api-envio-smtp`)

- **Sprint:** Sprint 1 · **HU:** HU-03, HU-04 · **Esfuerzo:** 0,9 d IA / 3,5 d bruto.
- **Objetivo:** endpoint `POST /api/send` que envía un correo real vía Nodemailer con SMTP configurable por variables de entorno, registrando el resultado en logs (pino) sin persistir contenido.
- **Alcance:** `send.route` → `send.controller` → `mailer.ts` (transporter reutilizable); `config/env.ts` (carga y validación de env con Zod); `logger.ts`; contrato de error uniforme (`errorHandler`); CORS a `WEB_ORIGIN`. Envío verificable contra Mailpit.
- **Exclusiones:** adjunto (F3/fase 6), saneamiento y validación autoritativa completa (F4/fase 7) — en esta fase la validación de servidor es mínima (parseo del payload).
- **Dependencias:** fase 1 (`foundation`): Mailpit y esqueleto de `apps/api`.
- **Entregables OpenSpec:** change `api-envio-smtp` archivado.
- **Criterios de cierre:** un `POST /api/send` de prueba entrega el correo en Mailpit; logs con resultado, destinatarios, asunto y timestamp (sin contenido ni secretos); tests de integración del endpoint (Supertest) en verde; criterios `[IMPRESCINDIBLE]` de HU-03 y HU-04.
- **Riesgo de contexto:** bajo.

### Fase 3 — UI de composición (`ui-composicion`)

- **Sprint:** Sprint 1 · **HU:** HU-05, HU-06, HU-07, HU-09, HU-10 · **Esfuerzo:** 1,8 d IA / 7,0 d bruto.
- **Objetivo:** el remitente ve y usa el formulario completo de composición: chips de destinatarios Para/CC/CCO, asunto en una línea y cuerpo enriquecido con React Quill (negrita, cursiva, listas). UI en español, accesible AA.
- **Alcance:** `EmailForm` (React Hook Form) con `RecipientChips` ×3, `SubjectField`, `BodyEditor`, `SubmitBar` y hueco de `AttachmentField` (campo visible, sin lógica); esquema base del email en `packages/shared` (Zod) como contrato compartido; tokens y componentes de `guia-estilos.md`.
- **Exclusiones:** el envío real desde la UI y el feedback (fase 4); la validación de entradas (fase 5); la lógica del adjunto (fase 6).
- **Dependencias:** fase 1 (esqueleto de `apps/web` y `packages/shared`).
- **Entregables OpenSpec:** change `ui-composicion` archivado.
- **Criterios de cierre:** el formulario renderiza todos los campos y las chips añaden/eliminan direcciones en Para/CC/CCO; el editor produce HTML con el whitelist funcional (B/I/listas); tests de componentes (RTL) en verde; criterios `[IMPRESCINDIBLE]` de HU-05, HU-06, HU-07, HU-09 y HU-10.
- **Riesgo de contexto:** medio — es la fase con más HU y más componentes simultáneos; si el change crece, dividir (ver `prompts-roadmap-native-ai.md`).

### Fase 4 — Envío desde la UI y feedback (`ui-envio-feedback`)

- **Sprint:** Sprint 1 · **HU:** HU-15, HU-16 · **Esfuerzo:** 0,5 d IA / 2,0 d bruto.
- **Objetivo:** cerrar el MVP demoable: al pulsar Enviar se envía directamente (sin confirmación ni vista previa) y la UI muestra feedback claro de éxito o error, conservando los datos en caso de error.
- **Alcance:** `useSendEmail` (estado `idle | sending | success | error`), `apiClient` (POST `FormData` a `/api/send`), `errorMap` (código → mensaje en español), `FeedbackBanner` (`aria-live`), deshabilitado del botón durante el envío, limpieza del formulario tras éxito.
- **Exclusiones:** validación de cliente (fase 5); adjunto (fase 6).
- **Dependencias:** fase 2 (endpoint operativo) y fase 3 (formulario).
- **Entregables OpenSpec:** change `ui-envio-feedback` archivado. **Hito: MVP F1 demoable (demo vie 14-ago).**
- **Criterios de cierre:** happy path completo desde la UI hasta Mailpit con banner de éxito; error SMTP simulado produce banner de error con datos conservados; criterios `[IMPRESCINDIBLE]` de HU-15 y HU-16; Definition of Done del Sprint 1 (demo E1→E2→E6).
- **Riesgo de contexto:** bajo.

### Fase 5 — Validación de cliente (`validacion-cliente`)

- **Sprint:** Sprint 2 (17–21 ago 2026) · **HU:** HU-08, HU-14 · **Esfuerzo:** 0,2 d IA / 1,0 d bruto.
- **Objetivo:** impedir el envío desde el cliente si faltan Para/Asunto/Cuerpo o si alguna dirección (Para/CC/CCO) tiene formato inválido, con errores claros junto a los campos.
- **Alcance:** completar `emailSchema` en `packages/shared` (obligatorios + formato de email) y conectarlo como resolver de React Hook Form; mensajes de error accesibles junto a cada campo.
- **Exclusiones:** validación del adjunto (fase 6); validación autoritativa en servidor (fase 7).
- **Dependencias:** fases 3 y 4 (formulario y flujo de envío operativos).
- **Entregables OpenSpec:** change `validacion-cliente` archivado.
- **Criterios de cierre:** no se puede enviar con Para/Asunto/Cuerpo vacíos ni con direcciones inválidas; errores junto a los campos (AA); tests unit del esquema (shared) y de componentes en verde; criterios `[IMPRESCINDIBLE]` de HU-08 y HU-14.
- **Riesgo de contexto:** bajo.

### Fase 6 — Adjunto único con validaciones (`adjunto`)

- **Sprint:** Sprint 2 · **HU:** HU-11, HU-12, HU-13 · **Esfuerzo:** 1,0 d IA / 3,5 d bruto.
- **Objetivo:** adjuntar un único documento (opcional) al correo, validando en cliente tipo (JPG, GIF, PDF, Word, Excel, PowerPoint) y tamaño (máx. 10 MiB), y transportándolo hasta el envío.
- **Alcance:** `AttachmentField` funcional; `attachment.rules.ts` en `packages/shared` (tipos permitidos + límite) como fuente única; `upload.ts` (Multer memoryStorage, 1 fichero, límite 10 MiB) y paso del adjunto a Nodemailer en el backend.
- **Exclusiones:** verificación de MIME real con `file-type` como validación autoritativa de rechazo en servidor (se completa en fase 7 con HU-18); antivirus (fuera de alcance).
- **Dependencias:** fase 4 (flujo de envío) y fase 2 (endpoint).
- **Entregables OpenSpec:** change `adjunto` archivado.
- **Criterios de cierre:** un correo con adjunto llega a Mailpit con el fichero visible; el cliente rechaza tipos no permitidos y >10 MiB con aviso claro; tests en verde; criterios `[IMPRESCINDIBLE]` de HU-11, HU-12 y HU-13.
- **Riesgo de contexto:** bajo.

### Fase 7 — Endurecimiento de servidor (`endurecimiento-servidor`)

- **Sprint:** Sprint 2 · **HU:** HU-17, HU-18 · **Esfuerzo:** 1,3 d IA / 4,5 d bruto.
- **Objetivo:** el backend queda como autoridad: sanea el HTML del cuerpo (whitelist `b/strong, i/em, ul, ol, li, p, br`; fuera `<script>`, `on*`, iframes, enlaces, imágenes) y valida en servidor todo lo que valida el cliente (obligatorios, formato de email, tipo por MIME real con `file-type`, tamaño).
- **Alcance:** `sanitizer.ts` (sanitize-html), `attachment.ts` (MIME real), `validate.ts` (middleware Zod con el esquema de `shared`); respuestas `4xx { ok:false, code }` ante peticiones que burlan el cliente, sin filtrar secretos.
- **Exclusiones:** auth, anti-abuso, antivirus (Won't, `requisitos.md` §6).
- **Dependencias:** fases 2, 5 y 6 (endpoint, esquema compartido completo y adjunto).
- **Entregables OpenSpec:** change `endurecimiento-servidor` archivado. **Hito: producto endurecido (21-ago), recorrido E1–E7 completo.**
- **Criterios de cierre:** una petición maliciosa directa al endpoint (sin pasar por la UI) es rechazada o saneada; payload con `<script>`/`onclick` llega limpio a Mailpit; validación de seguridad con TI (revisión del 17–18 ago); e2e E1–E7 (Playwright, opcional) sobre Mailpit; accesibilidad AA verificada; criterios `[IMPRESCINDIBLE]` de HU-17 y HU-18; Definition of Done del Sprint 2.
- **Riesgo de contexto:** medio — toca todo el pipeline del backend y el contrato compartido; requiere revisión cuidadosa de seguridad.

## 4. Alineación con la capa de entrega

- **Orden y fronteras:** las fases 1–4 componen el **Sprint 1 — Núcleo (F0+F1)** y las fases 5–7 el **Sprint 2 — Endurecimiento (F2+F3+F4)**, en el mismo orden que el `sprint-plan.md` §4 y respetando su cadena de dependencias (§3). El corte fase 4 → fase 5 coincide con la frontera de sprint y con el **gate del MVP**.
- **Gates de revisión:** cada fase se construye después de la revisión entrelazada de sus HU (lun/mar de su sprint, `plan-revision-hu.md`). Ninguna HU está bloqueada ni en revisión con dudas a fecha de este roadmap (18/18 *Pendiente* de revisión just-in-time, 0 bloqueadas).
- **Esfuerzo:** Sprint 1 = fases 1–4 = **3,6 d IA** (13,5 d bruto); Sprint 2 = fases 5–7 = **2,5 d IA** (11,0 d bruto). Coincide con las cargas del `sprint-plan.md`.

## 5. Conflictos de alineación roadmap↔sprint

**Sin conflictos.** El presupuesto de contexto (alto) no obligó a partir ninguna HU en changes que desborden su sprint, ni a cortar a mitad de un bloque F0–F4: cada HU cabe entera en una fase, cada fase cabe entera en su sprint y los cortes de fase coinciden con los bloques del mapa de HU. **No es necesario re-ejecutar `aidd sprint-planning`**: el aviso de "modo degradado" del `sprint-plan.md` §6 queda resuelto sin desviaciones que reconciliar (las unidades HU→Story se mantienen; este roadmap solo añade la granularidad de changes por debajo).

Única observación (no conflicto): la fase 3 agrupa 5 HU en un change; si durante `aisdd open change ui-composicion` el alcance resultara excesivo, se dividiría en 2–3 changes **dentro de la misma ventana del Sprint 1** (ver criterios en `prompts-roadmap-native-ai.md`), sin afectar al plan.

## 6. Entregables de este paso

- `docs/roadmap.md` (este documento).
- `docs/prompts-roadmap-native-ai.md` — prompts operativos por fase (`aisdd open|implement|close change`).
- `openspec/config.yaml` — sección `roadmap` con el índice de fases (clave de unión roadmap↔sprint↔Jira vía `change_hint`).

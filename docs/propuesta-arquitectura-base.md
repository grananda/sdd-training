# Propuesta de arquitectura base — Servicio Web de Envío de Email (aidd-training)

> **Versión 3** · **Generado:** 2026-07-08 12:57 CEST
> Documento de Fase 2 (AIDD · paso 2.3). Generado por `aidd architecture-proposal`.
> Entrada: docs/detalle-historias-usuario.md. Propuesta, no arquitectura definitiva.
> **Aprobado (2026-07-08).**
>
> El stack base (React+TS+Tailwind+React Quill · Node+Express+TS+Nodemailer · Turborepo+pnpm · Docker · sin BD) viene **decidido y no negociable** de Fase 0/1 (`cliente-requisitos.md` §3, `requisitos.md` §5). Esta propuesta lo respeta y añade las decisiones aún abiertas (validación, estado, testing) con justificación.

## 1. Stack técnico recomendado

**Monorepo y tooling**
| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Monorepo | **Turborepo + pnpm workspaces** | Restricción no negociable (`requisitos.md` §5). Habilita `packages/shared` para compartir tipos y validación entre `web` y `api` (HU-01, HU-18). |
| Lenguaje | **TypeScript** (front y back) | Restricción no negociable. Tipado extremo a extremo del contrato del email (HU-01). |
| Contenedores | **Docker + Docker Compose** | Único modelo de despliegue (NFR-08). Orquesta `web` + `api` en local (HU-02). |

**Frontend (`apps/web`)**
| Elemento | Tecnología | Justificación |
|----------|------------|---------------|
| UI | **React + TypeScript** | Restricción no negociable. SPA de una sola pantalla (HU-05). |
| Build/dev | **Vite** | Dev server rápido y build sencillo para React+TS; encaja con Vitest (testing) y con contenedor ligero. |
| Estilos | **Tailwind CSS** | Restricción no negociable. Aplica los design tokens de `guia-estilos.md` (marca NTT DATA, AA). |
| Editor de cuerpo | **React Quill** | Restricción no negociable (RF-06). Toolbar minimalista: negrita, cursiva, listas; salida HTML (HU-10). |
| Formulario | **React Hook Form + `@hookform/resolvers` (Zod)** | Estado y errores del formulario con pocos re-render y buena a11y; reutiliza el esquema Zod de `shared` para validar en cliente (HU-06…HU-14). |
| Peticiones | **fetch nativo** (+ `FormData`) | El adjunto viaja como `multipart/form-data` (HU-11); no hace falta cliente HTTP pesado para un único endpoint. |

**Backend (`apps/api`)**
| Elemento | Tecnología | Justificación |
|----------|------------|---------------|
| Servidor | **Node.js + Express + TypeScript** | Restricción no negociable. Expone el endpoint de envío (HU-03, RF-13). |
| Envío SMTP | **Nodemailer** sobre SMTP configurable por env | Restricción no negociable (RF-13, NFR-03/09). Proveedor pendiente de definir; el código se ata solo a la config SMTP. |
| Subida de adjunto | **Multer** (memoryStorage) | Parsea `multipart/form-data` para el adjunto único; permite validar tipo/tamaño antes de adjuntar (HU-11…HU-13, HU-18). |
| Saneamiento HTML | **sanitize-html** | Whitelist coherente con el toolbar (`b/strong`, `i/em`, `ul`, `ol`, `li`, `p`, `br`); elimina scripts, `on*`, iframes, enlaces e imágenes (HU-17, RF-12, NFR-02). |
| Detección MIME real | **file-type** | Verifica el MIME por *magic bytes* además de la extensión, contra ficheros renombrados (HU-12, HU-18, decisión 1.3). |
| Validación | **Zod** (esquema de `shared`) | Revalidación autoritativa en servidor de obligatorios, formato de email y tipo/tamaño (HU-18, RF-16, NFR-11). |
| CORS | **cors** | Origen permitido del frontend en local vía `WEB_ORIGIN` (HU-02). |
| Config | **dotenv** + validación de env con Zod | Carga y valida `SMTP_*`, `MAIL_FROM`, `MAX_ATTACHMENT_SIZE_MB`, `PORT`, `WEB_ORIGIN` al arranque (NFR-03/09). |
| Logging | **pino** | Traza estructurada del resultado de cada envío (resultado, destinatarios, asunto, timestamp) sin persistir contenido ni secretos (HU-04, RF-15, NFR-06). |

**Paquete compartido (`packages/shared`)**
| Elemento | Tecnología | Justificación |
|----------|------------|---------------|
| Esquema y tipos | **Zod** | Fuente única de verdad del contrato del email y de las reglas de validación; se consume en cliente (RHF) y servidor (HU-18). Evita divergencia cliente/servidor (NFR-11). |

## 2. Organización de módulos y capas

Árbol previsto (coherente con `cliente-requisitos.md` §9):

```
aidd-training/
├── apps/
│   ├── web/                      # Frontend React + Vite
│   │   └── src/
│   │       ├── components/       # EmailForm, RecipientChips, BodyEditor, AttachmentField, FeedbackBanner
│   │       ├── hooks/            # useSendEmail (fetch + estado de envío)
│   │       ├── lib/              # api client, mapeo de errores
│   │       └── App.tsx
│   └── api/                      # Backend Express
│       └── src/
│           ├── routes/           # POST /api/send
│           ├── services/         # mailer (Nodemailer), sanitizer, attachment
│           ├── middleware/       # multer, validación (Zod), errorHandler, cors
│           ├── config/           # carga+validación de env
│           └── server.ts
├── packages/
│   └── shared/                   # emailSchema (Zod), tipos, límites y listas (tipos permitidos, 10 MB)
├── docker-compose.yml
├── turbo.json
└── .env.example
```

**Capas del backend** (flujo de una petición de envío):

1. **Ruta** (`POST /api/send`) — punto de entrada.
2. **Middleware de subida** (Multer, memoria) — extrae campos + adjunto.
3. **Validación** (Zod de `shared` + `file-type`) — obligatorios, formato de email, tipo/tamaño y MIME real. Rechaza con error si algo falla (HU-18).
4. **Saneamiento** (`sanitize-html`) — limpia el cuerpo HTML (HU-17).
5. **Servicio de envío** (Nodemailer) — construye y envía el correo (HU-03).
6. **Logging** (pino) — registra el resultado (HU-04).
7. **Manejador de errores** — respuesta controlada sin filtrar credenciales ni detalles sensibles (HU-03, HU-16).

**Frontend** — una pantalla (`EmailForm`) que compone los componentes de campo; `useSendEmail` encapsula la llamada al backend y el estado éxito/error/enviando.

## 3. Gestión de estado y flujo de datos

- **Estado del formulario:** local a la pantalla con **React Hook Form**; validación en cliente con el **resolver de Zod** sobre el esquema de `shared` (HU-08, HU-14). No se introduce store global (Redux/Zustand): el alcance es una sola pantalla sin estado compartido (NFR-06, sin persistencia).
- **Chips de destinatarios:** estado controlado dentro del componente `RecipientChips`, expuesto a RHF como arrays de direcciones (Para/CC/CCO) (HU-06, HU-07).
- **Adjunto:** un único `File` en estado del formulario; se valida tipo/tamaño en cliente antes de habilitar el envío (HU-12, HU-13).
- **Flujo de datos de envío:** `EmailForm` → `useSendEmail` construye `FormData` (campos + adjunto) → `POST /api/send` → el backend valida/sanea/envía → responde `{ ok, message }` → la UI muestra éxito (limpia el formulario) o error (conserva datos) (HU-15, HU-16).
- **Sin persistencia:** el envío es *fire-and-forget*; la única traza es el log de servidor (NFR-06).

## 4. Estrategia de testing

Stack: **Vitest + React Testing Library + Supertest** (E2E opcional con Playwright).

| Nivel | Herramienta | Qué cubre |
|-------|-------------|-----------|
| Unit (shared) | **Vitest** | El esquema Zod: obligatorios, formato de email, límites de tipo/tamaño (HU-08, HU-12, HU-13, HU-14). Es el núcleo reutilizado, máxima prioridad. |
| Unit (api) | **Vitest** | Saneamiento (`sanitize-html`: elimina `<script>`, `on*`, iframes, enlaces) y detección MIME real (HU-17, HU-12). Nodemailer **mockeado**. |
| Integración (api) | **Supertest** | `POST /api/send`: 2xx en caso válido, 4xx cuando se burla la validación de cliente, error controlado ante fallo SMTP sin filtrar secretos (HU-03, HU-16, HU-18). |
| Componentes (web) | **RTL** | Chips (añadir/eliminar, inválido), obligatorios que bloquean envío, adjunto rechazado, feedback de éxito/error y limpieza (HU-06…HU-16). |
| E2E (opcional) | **Playwright** | Recorrido E1→E7 del prototipo sobre la app real, con SMTP de pruebas (MailHog). |

Criterio de cobertura: priorizar la validación compartida y el saneamiento (superficie de seguridad), no un % global. Los criterios `[IMPRESCINDIBLE]` del detalle son el mínimo a cubrir.

## 5. Seguridad y escalabilidad

**Seguridad** (alineada con NFR-02/03/11 y F4)
- **Saneamiento del cuerpo en servidor** con whitelist estricto antes de construir el correo (HU-17). El cliente no es de fiar.
- **Validación autoritativa en servidor** de todo lo validado en cliente (HU-18); el frontend es conveniencia.
- **Secretos solo por env**: credenciales SMTP nunca en código ni expuestas al frontend; `.env.example` sin secretos reales (NFR-03). Logs sin credenciales ni contenido (NFR-06).
- **Límite de tamaño** aplicado también en Multer (`MAX_ATTACHMENT_SIZE_MB`, 10 MiB) para no cargar en memoria adjuntos gigantes (HU-13).
- **CORS** restringido a `WEB_ORIGIN` en local.
- **Fuera de alcance consciente:** sin auth ni anti-abuso (NFR-04/05), aceptado por despliegue local no expuesto; sin antivirus de adjuntos (riesgo aceptado en el brief).

**Escalabilidad** (proporcional al alcance)
- Backend **sin estado** (fire-and-forget, sin BD) → escalado horizontal trivial si algún día se necesitara; hoy basta una instancia en Compose (NFR-06/08).
- El envío SMTP es el único punto de I/O externo; el `transporter` de Nodemailer se reutiliza entre peticiones.
- No se diseñan colas ni reintentos (fuera de alcance); si el volumen creciera, el punto de extensión natural sería una cola delante del envío.

## 6. Recomendaciones técnicas

- **SMTP de desarrollo:** usar **Mailpit** (`axllent/mailpit`, SMTP `1025` / UI `8025`) en un servicio más del `docker-compose.yml` para probar el envío sin proveedor real y previsualizar HTML + adjuntos; el proveedor de producción queda configurable por env (resuelve el pendiente de `requisitos.md` §7/§8 sin atar el código).
- **Config validada al arranque:** fallar rápido si falta una variable SMTP obligatoria, con mensaje claro (evita fallos opacos en el envío).
- **Contrato de error uniforme** `{ ok: false, code, message }` para que la UI mapee mensajes de error sin exponer detalles técnicos (HU-16).
- **Tipos permitidos y límite centralizados en `shared`** (una sola lista JPG/GIF/PDF/Word/Excel/PowerPoint y el tope de 10 MB) para que cliente y servidor no diverjan.
- **Accesibilidad heredada de la guía de estilos**: componibles con foco visible, hit targets ≥44px y `aria-live` en el feedback (WCAG 2.1 AA).
- **Alineación con la arquitectura definitiva (2.4):** esta propuesta es el insumo directo de `aidd architecture`; las decisiones aquí confirmadas se consolidan allí.

## 7. Decisiones tomadas en el paso 2.3 (arquitectura)

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Librería de validación en `shared` | **Zod** / Valibot / Manual | **Zod** | usuario | Esquema TypeScript-first único para cliente y servidor; evita divergencia (HU-18, NFR-11). |
| 2 | Gestión del estado del formulario | **React Hook Form + Zod** / useState controlado | **React Hook Form + Zod** | usuario | Menos re-render, buena a11y y reutiliza el esquema de `shared` (HU-06…HU-14). |
| 3 | Stack de testing | **Vitest + RTL + Supertest** / Jest+RTL+Supertest / Mínimo | **Vitest + RTL + Supertest** (E2E Playwright opcional) | usuario | Rápido con TS/ESM; cubre unit, componentes e integración del endpoint (F1–F4). |
| 4 | Build del frontend | **Vite** / CRA / Next.js | **Vite** | default | Ligero y rápido para SPA React+TS; encaja con Vitest y con contenedor simple. No se necesita SSR (una pantalla). |
| 5 | Parseo del adjunto en backend | **Multer (memoria)** / Busboy / body-parser | **Multer (memoryStorage)** | default | Estándar en Express para `multipart/form-data`; valida antes de adjuntar, sin escribir a disco (HU-11). |
| 6 | Saneamiento y MIME | **sanitize-html + file-type** / DOMPurify(jsdom) / regex | **sanitize-html + file-type** | default | `sanitize-html` es de servidor y configurable por whitelist; `file-type` da MIME real por magic bytes (HU-17, HU-12). |
| 7 | SMTP de desarrollo | **Mailpit** / MailHog / proveedor real / Ethereal | **Mailpit** en Compose (`axllent/mailpit`, 1025/8025) | usuario | Elegido frente a MailHog por estar mantenido y renderizar mejor HTML y adjuntos; el proveedor final sigue configurable por env (§7/§8 requisitos). |

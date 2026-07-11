# Propuesta — ui-envio-feedback

> Historias: HU-15 (envío directo), HU-16 (feedback de resultado y limpieza del formulario). Fase F1.
> Fase 4 del `docs/roadmap.md`. Sprint 1 · MVP (10–14 ago 2026). **Hito MVP F1**: el correo se compone y se envía de extremo a extremo desde la UI.
> Construye sobre `ui-composicion` (formulario con botón Enviar inerte) y `api-envio-smtp` (`POST /api/send`).

## Why

El formulario ya compone el correo y el backend ya lo envía, pero **no están conectados**: el botón Enviar de `ui-composicion` es inerte. Esta fase cablea el envío desde la UI y muestra el resultado, cerrando el **hito MVP F1** (componer + enviar de verdad). Es el último eslabón del flujo feliz antes de endurecer con validación (fase 5), adjunto (fase 6) y saneamiento (fase 7).

## What Changes

- Se crea el hook **`useSendEmail`** (`apps/web/src/hooks/useSendEmail.ts`) con estado de envío `idle | sending | success | error`: al enviar deshabilita el botón e indica progreso (evita envíos duplicados), llama al cliente y expone el resultado.
- Se crea **`apiClient`** (`apps/web/src/lib/apiClient.ts`): hace `POST /api/send` con **`application/json`** (el `EmailDraft`: `to/cc/bcc/subject/body`) contra `VITE_API_BASE_URL` (default `http://localhost:3000`), y traduce la respuesta `{ ok, code, message }`. Sin adjunto (multipart) en esta fase (fase 6).
- Se crea **`errorMap`** (`apps/web/src/lib/errorMap.ts`): mapea el `code` de error del backend a un **mensaje en español** para la UI, con un fallback genérico.
- Se crea **`FeedbackBanner`** (`apps/web/src/components/FeedbackBanner.tsx`): banner de **éxito o error** con `aria-live` (accesible), que no expone detalles técnicos sensibles.
- Se **cablea el botón Enviar** de `EmailForm`: sustituye el `onSubmit` no-op por `useSendEmail` (**envío directo**, sin diálogo de confirmación ni vista previa — HU-15). Durante el envío, el botón se deshabilita y muestra progreso.
- **Tras un éxito**: se muestra el banner de éxito y el **formulario se limpia** (RHF `reset`). **Tras un error**: banner de error y **se conservan los datos** para reintentar (HU-16).
- Se añade **`VITE_API_BASE_URL`** al `.env.example` (default de dev `http://localhost:3000`), y se documenta que la llamada es cross-origin directa (CORS ya configurado en la api con `WEB_ORIGIN`).
- **Tests** (Vitest + RTL) con `fetch` y el cliente mockeados: envío deshabilita el botón; éxito muestra banner y limpia; error muestra banner y conserva datos.

**Fuera de alcance de esta fase (llega en fases posteriores):**
- **Validación de cliente** (obligatorios/formato, HU-08/HU-14): **fase 5**. En esta fase el envío se dispara con lo que haya en el formulario; la validación autoritativa vive en el backend (HU-18, fase 5).
- **Adjunto** (multipart/`FormData`, HU-11–13): **fase 6**. `apiClient` migrará de JSON a `FormData` entonces.
- **Saneamiento del cuerpo** (HU-17): **fase 7**, en el backend.

## Capabilities

### New Capabilities

- `ui-send-email`: envío directo del correo desde la UI mediante `useSendEmail` + `apiClient` (JSON a `POST /api/send`), sin diálogo de confirmación ni vista previa, con el botón deshabilitado y en progreso durante el envío para evitar duplicados. Cubre HU-15.
- `send-feedback`: feedback accesible de éxito/error tras el envío (`FeedbackBanner` con `aria-live` y `errorMap` en español), con limpieza del formulario al éxito y conservación de los datos al error. Cubre HU-16.

### Modified Capabilities

Ninguna a nivel de spec consolidada. A nivel de código, `EmailForm` (de `email-composition-form`) se **cablea**: su botón Enviar pasa de inerte a disparar el envío real; el comportamiento visible del formulario (campos, opcionales) no cambia.

## Impact

- **Código nuevo:** `apps/web/src/hooks/useSendEmail.ts`, `apps/web/src/lib/{apiClient,errorMap}.ts`, `apps/web/src/components/FeedbackBanner.tsx`; modificación de `EmailForm.tsx`. Tests nuevos.
- **Config nueva:** `VITE_API_BASE_URL` en `.env.example` (default `http://localhost:3000`).
- **Sin dependencias nuevas** (fetch nativo del navegador).
- **Sin validación, sin adjunto, sin saneamiento** en este change (fronteras a fases 5/6/7).
- **Cierra el hito MVP F1**: componer y enviar un correo de extremo a extremo desde la UI (verificable contra Mailpit en dev).

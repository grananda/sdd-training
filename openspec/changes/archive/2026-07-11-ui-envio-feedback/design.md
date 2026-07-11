# Diseño técnico — ui-envio-feedback

> Alineado con `docs/arquitectura-base.md` §6 (`EmailForm` → `useSendEmail` → `apiClient`), §7 (flujos de éxito/error) y §8 (estado de envío). Solo la parte de esta fase: cableado del envío JSON y feedback; sin adjunto, sin validación de cliente, sin saneamiento.

## 1. Punto de partida

- `ui-composicion` dejó `EmailForm` (RHF) con los campos y un botón Enviar **inerte** (`onSubmit` no-op).
- `api-envio-smtp` expone `POST /api/send` que acepta **JSON** (`to/cc/bcc/subject/body`) y responde `200 { ok:true, message }` o `5xx { ok:false, code, message }`.
- `packages/shared` exporta el tipo `EmailDraft`.

## 2. Cliente de envío (`lib/apiClient.ts`)

- `sendEmail(draft: EmailDraft): Promise<SendResult>`.
- `POST` a `` `${BASE}/api/send` `` con `BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"`, cabecera `Content-Type: application/json`, cuerpo `JSON.stringify(draft)`. Llamada **cross-origin directa** (la api ya habilita CORS para `WEB_ORIGIN`).
- Traduce la respuesta a un resultado uniforme para la UI:
  ```ts
  type SendResult =
    | { ok: true; message: string }
    | { ok: false; code: string; message: string };
  ```
- Mapea fallos: respuesta `ok:false` → `{ ok:false, code, message }`; error de red / excepción → `{ ok:false, code: "NETWORK", message }`. No propaga detalles técnicos crudos a la UI.

## 3. Mapa de errores (`lib/errorMap.ts`)

- `errorMessage(code: string): string`: `code` → mensaje en español. Cubre al menos `SEND_FAILED` (fallo de envío) y `NETWORK` (sin conexión con el servidor), con un **fallback genérico** ("No se pudo enviar el correo. Inténtalo de nuevo."). Nunca muestra credenciales ni trazas.

## 4. Hook de envío (`hooks/useSendEmail.ts`)

- Estado: `status: "idle" | "sending" | "success" | "error"` y `feedback?: { kind: "success" | "error"; message: string }`.
- `send(draft)`: pone `sending` (deshabilita el botón), llama a `apiClient.sendEmail`, y según el resultado deja `success` (mensaje de éxito) o `error` (mensaje de `errorMap`).
- Expone `isSending` para deshabilitar el botón y mostrar progreso, y una forma de limpiar el feedback.
- **Envío directo** (HU-15): sin confirmación ni vista previa. El estado `sending` evita envíos duplicados.

## 5. Banner de feedback (`components/FeedbackBanner.tsx`)

- Props: `kind: "success" | "error"`, `message: string`.
- Contenedor con `role="status"` y `aria-live="polite"` (éxito) / `role="alert"` y `aria-live="assertive"` (error), estilado con los tokens de estado de la guía (`--color-success-*` / `--color-error-*`). El estado **no** se transmite solo por color (icono/texto).

## 6. Cableado en `EmailForm`

- Se sustituye `onSubmit` no-op por:
  ```ts
  const { send, isSending, feedback } = useSendEmail();
  const onSubmit = async (draft: EmailDraft) => {
    const result = await send(draft);
    if (result.ok) reset(emptyDraft); // limpia el formulario al éxito (HU-16)
    // en error no se toca el formulario: se conservan los datos (HU-16)
  };
  ```
- El botón Enviar: `disabled={isSending}`, texto/indicador de progreso mientras `isSending`.
- `FeedbackBanner` se renderiza cuando hay `feedback`.
- `reset` proviene de `useForm` (RHF). El cuerpo React Quill se limpia al resetear `body` a "".

## 7. Configuración

- `.env.example`: añadir `VITE_API_BASE_URL=http://localhost:3000` (dev nativo). En Docker se ajusta al host/puerto de la api publicada. La api ya restringe CORS a `WEB_ORIGIN`.

## 8. Estrategia de test (Vitest + RTL)

- `apiClient`: `fetch` mockeado → `200 {ok:true}` devuelve `{ok:true}`; `5xx {ok:false,code}` devuelve `{ok:false,code}`; excepción de red → `{ok:false, code:"NETWORK"}`.
- `useSendEmail` / `EmailForm` (con `apiClient` o `fetch` mockeado y React Quill mockeado):
  - al enviar, el botón se deshabilita (`sending`).
  - éxito → aparece `FeedbackBanner` de éxito y el formulario se limpia (campos vacíos).
  - error → aparece `FeedbackBanner` de error y los datos se conservan.
- `errorMap`: `code` conocido → su mensaje; desconocido → fallback.

## 9. Fuera de alcance (trazabilidad de fronteras)

| Preocupación | HU | Fase |
|--------------|----|----|
| Validación de cliente (obligatorios/formato) | HU-08/HU-14 | 5 |
| Validación autoritativa en servidor | HU-18 | 5 |
| Adjunto (multipart / FormData) | HU-11–13 | 6 |
| Saneamiento del cuerpo | HU-17 | 7 |

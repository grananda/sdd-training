# Tareas — ui-envio-feedback

Orden por dependencia: cliente → mapa de errores → hook → banner → cableado en el formulario → config → verificación. `node`/`pnpm` solo vía nvm: exportar el PATH antes de cada comando.

## 1. Cliente de envío y errores

- [ ] 1.1 `lib/apiClient.ts`: `sendEmail(draft)` hace `POST ${VITE_API_BASE_URL||http://localhost:3000}/api/send` con JSON; devuelve `{ ok:true, message }` o `{ ok:false, code, message }`; error de red → `code: "NETWORK"`
- [ ] 1.2 `lib/errorMap.ts`: `errorMessage(code)` → mensaje en español (`SEND_FAILED`, `NETWORK`) con fallback genérico

## 2. Hook y banner

- [ ] 2.1 `hooks/useSendEmail.ts`: estado `idle|sending|success|error`; `send(draft)` (deshabilita vía `isSending`), expone `feedback` y limpieza; envío directo sin confirmación
- [ ] 2.2 `components/FeedbackBanner.tsx`: éxito/error con `aria-live` (status/alert), tokens de estado; el estado no se transmite solo por color

## 3. Cableado en el formulario

- [ ] 3.1 En `EmailForm.tsx`: sustituir el `onSubmit` no-op por `useSendEmail`; `disabled={isSending}` + progreso en el botón Enviar
- [ ] 3.2 Al éxito, `reset` del formulario (campos vacíos, incluido el cuerpo Quill); al error, no tocar los datos
- [ ] 3.3 Renderizar `FeedbackBanner` cuando haya feedback

## 4. Configuración

- [ ] 4.1 Añadir `VITE_API_BASE_URL=http://localhost:3000` al `.env.example` con comentario (dev nativo; ajustar en Docker); documentar la llamada cross-origin (CORS ya en la api)

## 5. Tests (Vitest + RTL)

- [ ] 5.1 `apiClient`: `fetch` mockeado → éxito `{ok:true}`; `5xx {ok:false,code}`; excepción de red → `{ok:false, code:"NETWORK"}`
- [ ] 5.2 `errorMap`: code conocido → su mensaje; desconocido → fallback
- [ ] 5.3 `EmailForm` (apiClient/fetch + Quill mockeados): al enviar el botón se deshabilita; éxito → banner de éxito y formulario limpio; error → banner de error y datos conservados

## 6. Verificación (criterios de cierre)

- [ ] 6.1 `pnpm build` y `pnpm test` en verde vía Turborepo
- [ ] 6.2 Prueba manual extremo a extremo (hito MVP F1): `docker compose up -d mailpit` + api + `pnpm dev`; componer y Enviar → banner de éxito, formulario limpio, y el correo aparece en Mailpit (`localhost:8025`)
- [ ] 6.3 Error: con la api caída, Enviar → banner de error en español y datos conservados

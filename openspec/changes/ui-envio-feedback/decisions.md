# Decisiones — ui-envio-feedback

Pre-flight de apertura (`aisdd open change`). La arquitectura (`docs/arquitectura-base.md` §6/§7/§8) ya fijaba la cadena `EmailForm → useSendEmail → apiClient` y el comportamiento de limpieza/conservación (decisión 1.3); el pre-flight se centró en el formato del payload y en cómo el front alcanza la api.

## payload-json

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: el endpoint `POST /api/send` (fase 2) acepta JSON; el adjunto (multipart/FormData) es la fase 6 (HU-11–13).
- **Pregunta**: ¿Qué envía `apiClient` en esta fase?
- **Opciones evaluadas**:
  - a) `application/json` con el `EmailDraft`
  - b) `FormData` ya (como la arquitectura final)
- **Decision**: a) JSON
- **Justificación**: coherente con el endpoint actual; se migra a FormData en la fase 6 cuando entre el adjunto. Evita plomería sin uso.

## api-base-url-env

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: el front (5173) y la api (3000) están en orígenes distintos; `foundation` ya configuró CORS en la api con `WEB_ORIGIN`.
- **Pregunta**: ¿Cómo dirige el front las llamadas al backend?
- **Opciones evaluadas**:
  - a) `VITE_API_BASE_URL` (default `http://localhost:3000`), llamada cross-origin directa
  - b) Proxy de Vite (`/api` → 3000), rutas relativas
- **Decision**: a) `VITE_API_BASE_URL`
- **Justificación**: encaja con el CORS ya configurado y funciona en nativo y en Docker (web y api en contenedores separados), donde el proxy de Vite no aplica.

## preflight-implementacion-sin-dudas

- **Fecha**: 2026-07-11
- **Tipo**: confirmacion
- **Origen**: usuario
- **Contexto**: pre-flight de `aisdd implement change`. `design.md` y las decisiones del open fijan la cadena `EmailForm → useSendEmail → apiClient`, el payload JSON, la base URL por env y el comportamiento limpieza/conservación; el código base (`EmailForm` con botón inerte, `EmailDraft` en shared, endpoint JSON) está claro.
- **Pregunta**: No se detectaron dudas bloqueantes durante el pre-flight de implementación.
- **Opciones evaluadas**:
  - a) Continuar con la implementación según design.md
- **Decision**: continuar. Detalles resueltos por defecto: `import.meta.env.VITE_API_BASE_URL` se tipa en `vite-env.d.ts`; los colores de estado del banner usan los CSS vars de la guía por estilo inline (no están mapeados en Tailwind); los tests mockean `fetch` (o `apiClient`) y `react-quill-new`.
- **Justificación**: alcance y patrón ya cerrados; no procede forzar preguntas.

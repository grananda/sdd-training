/**
 * Contrato compartido entre `apps/web` y `apps/api`.
 *
 * En la fase `foundation` es solo un placeholder que prueba la resolución del
 * workspace desde ambas apps. El esquema real del email (campos, reglas, límites
 * con Zod) se añade en fases posteriores del roadmap (validación / adjunto).
 */
export const SHARED_PACKAGE = "@aidd/shared" as const;

/** Marcador temporal; se reemplazará por el contrato del email. */
export const SHARED_PLACEHOLDER = "aidd-shared:foundation" as const;

/**
 * Contrato compartido entre `apps/web` y `apps/api`.
 *
 * Define la forma del borrador de email que compone la UI. En esta fase
 * (`ui-composicion`) es **solo el tipo**: la validación con Zod (obligatorios,
 * formato de direcciones, límites) se añade en la fase de validación de cliente
 * (`validacion-cliente`, HU-08/HU-14).
 */

/** Borrador de email compuesto en el formulario. `body` es HTML. */
export interface EmailDraft {
  /** Destinatarios principales (To). */
  to: string[];
  /** Copia (CC). */
  cc: string[];
  /** Copia oculta (CCO/BCC). */
  bcc: string[];
  /** Asunto (una sola línea). */
  subject: string;
  /** Cuerpo en HTML (se sanea en el backend, HU-17). */
  body: string;
}

/** Identificador del paquete compartido; útil para verificar la resolución del workspace. */
export const SHARED_PACKAGE = "@aidd/shared" as const;

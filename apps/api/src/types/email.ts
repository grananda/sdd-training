/**
 * Contrato de la petición de envío (`POST /api/send`) en esta fase.
 *
 * Se define **local** en `apps/api`; cuando la UI (fase 4) necesite compartirlo,
 * se promoverá a `packages/shared`. Aún **sin adjunto** (fase 6) ni validación de
 * dominio (la autoritativa es HU-18, fase 5).
 */
export interface SendEmailRequest {
  /** Destinatarios principales (To). Al menos uno en un envío real. */
  to: string[];
  /** Copia (CC), opcional. */
  cc?: string[];
  /** Copia oculta (CCO/BCC), opcional. */
  bcc?: string[];
  /** Asunto del correo. */
  subject: string;
  /** Cuerpo del correo en HTML (se sanea en HU-17, fase 7). */
  body: string;
}

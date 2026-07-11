import type { EmailDraft } from "@aidd/shared";

/** Resultado uniforme del envío para la UI (sin detalles técnicos crudos). */
export type SendResult =
  | { ok: true; message: string }
  | { ok: false; code: string; message: string };

/** Base del backend. Cross-origin directo; la api habilita CORS para WEB_ORIGIN. */
const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

/**
 * Envía el correo al backend (`POST /api/send`) en JSON (HU-15). En esta fase no
 * hay adjunto (multipart llega en la fase 6). Traduce la respuesta y los fallos
 * de red a un `SendResult` uniforme; nunca propaga trazas técnicas a la UI.
 */
export async function sendEmail(draft: EmailDraft): Promise<SendResult> {
  try {
    const response = await fetch(`${BASE}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const data = (await response.json().catch(() => null)) as {
      ok?: boolean;
      code?: string;
      message?: string;
    } | null;

    if (response.ok && data?.ok) {
      return { ok: true, message: data.message ?? "Correo enviado." };
    }
    return {
      ok: false,
      code: data?.code ?? "SEND_FAILED",
      message: data?.message ?? "",
    };
  } catch {
    // Fallo de red / servidor inaccesible.
    return { ok: false, code: "NETWORK", message: "" };
  }
}

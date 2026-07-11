/**
 * Traduce el `code` de error del backend (o del cliente) a un mensaje en español
 * para la UI (HU-16). No expone credenciales ni detalles técnicos.
 */
const MESSAGES: Record<string, string> = {
  SEND_FAILED: "No se pudo enviar el correo. Inténtalo de nuevo.",
  NETWORK:
    "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
};

const FALLBACK = "No se pudo enviar el correo. Inténtalo de nuevo.";

export function errorMessage(code: string): string {
  return MESSAGES[code] ?? FALLBACK;
}

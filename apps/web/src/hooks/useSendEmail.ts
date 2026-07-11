import { useCallback, useState } from "react";
import type { EmailDraft } from "@aidd/shared";
import { sendEmail, type SendResult } from "../lib/apiClient";
import { errorMessage } from "../lib/errorMap";

export type SendStatus = "idle" | "sending" | "success" | "error";

export interface Feedback {
  kind: "success" | "error";
  message: string;
}

/**
 * Gobierna el envío del correo desde la UI (HU-15, HU-16): estado
 * `idle|sending|success|error`, deshabilitado durante el envío (evita
 * duplicados) y feedback de resultado. El envío es **directo** (sin confirmación
 * ni vista previa). Devuelve el `SendResult` para que el formulario decida limpiar
 * (éxito) o conservar (error).
 */
export function useSendEmail() {
  const [status, setStatus] = useState<SendStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const send = useCallback(async (draft: EmailDraft): Promise<SendResult> => {
    setStatus("sending");
    setFeedback(null);

    const result = await sendEmail(draft);

    if (result.ok) {
      setStatus("success");
      setFeedback({ kind: "success", message: result.message || "Correo enviado." });
    } else {
      setStatus("error");
      setFeedback({ kind: "error", message: errorMessage(result.code) });
    }
    return result;
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
    setStatus("idle");
  }, []);

  return {
    status,
    isSending: status === "sending",
    feedback,
    send,
    clearFeedback,
  };
}

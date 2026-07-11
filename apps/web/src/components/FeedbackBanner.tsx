import type { CSSProperties } from "react";

export interface FeedbackBannerProps {
  kind: "success" | "error";
  message: string;
}

/**
 * Banner de resultado del envío (HU-16), accesible con `aria-live`. El estado no
 * se transmite solo por color: lleva icono + texto. Usa los tokens de estado de
 * la guía de estilos (no mapeados en Tailwind) por estilo inline.
 */
export function FeedbackBanner({ kind, message }: FeedbackBannerProps) {
  const isSuccess = kind === "success";

  const style: CSSProperties = isSuccess
    ? {
        color: "var(--color-success-fg)",
        backgroundColor: "var(--color-success-bg)",
        borderColor: "var(--color-success-border)",
      }
    : {
        color: "var(--color-error-fg)",
        backgroundColor: "var(--color-error-bg)",
        borderColor: "var(--color-error-border)",
      };

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      style={style}
      className="flex items-center gap-2 rounded-md border p-3 text-sm"
    >
      <span aria-hidden="true" className="font-semibold">
        {isSuccess ? "✓" : "⚠"}
      </span>
      <span>{message}</span>
    </div>
  );
}

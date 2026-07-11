import type { ClipboardEvent } from "react";

export interface SubjectFieldProps {
  id: string;
  value: string;
  onChange: (next: string) => void;
}

/** Colapsa cualquier salto de línea a un espacio, dejando el asunto en una línea. */
export function normalizeSubject(raw: string): string {
  return raw.replace(/[\r\n]+/g, " ");
}

/**
 * Campo de asunto de una sola línea (HU-09). Un `input type="text"` ya impide
 * saltos al teclear; el caso relevante es **pegar** texto multilínea: se
 * intercepta el pegado y se normalizan los saltos a espacios (en vez de dejar que
 * el navegador los concatene sin separación). Sin obligatoriedad en esta fase
 * (HU-14 es la fase de validación de cliente).
 */
export function SubjectField({ id, value, onChange }: SubjectFieldProps) {
  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    if (!/[\r\n]/.test(pasted)) return; // sin saltos, comportamiento normal
    event.preventDefault();
    const input = event.currentTarget;
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const next =
      value.slice(0, start) + normalizeSubject(pasted) + value.slice(end);
    onChange(normalizeSubject(next));
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-text">
        Asunto
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(normalizeSubject(event.target.value))}
        onPaste={handlePaste}
        className="rounded-md border border-border bg-surface p-2 text-text outline-none focus:border-primary"
      />
    </div>
  );
}

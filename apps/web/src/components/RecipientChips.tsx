import { useState, type KeyboardEvent } from "react";

export interface RecipientChipsProps {
  /** id del input, para asociar la etiqueta. */
  id: string;
  /** Etiqueta del campo (Para, CC, CCO). */
  label: string;
  /** Direcciones actuales (chips). */
  value: string[];
  /** Notifica el nuevo array de direcciones. */
  onChange: (next: string[]) => void;
  /** Marca el campo como opcional en la UI. */
  optional?: boolean;
  /** Texto de ayuda bajo el campo. */
  helpText?: string;
}

/**
 * Campo de direcciones como chips eliminables (HU-06, HU-07). Una dirección se
 * añade al pulsar Enter o coma; cada chip se puede quitar (con su botón o con
 * Backspace si el input está vacío). Reutilizable para Para, CC y CCO.
 *
 * En esta fase **no valida el formato** de las direcciones (HU-08 es la fase de
 * validación de cliente): el texto se acepta como chip tal cual.
 */
export function RecipientChips({
  id,
  label,
  value,
  onChange,
  optional = false,
  helpText,
}: RecipientChipsProps) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const address = draft.trim();
    if (address === "") return;
    // Evita duplicados exactos; sin validar formato en esta fase.
    if (!value.includes(address)) {
      onChange([...value, address]);
    }
    setDraft("");
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeAt(value.length - 1);
    }
  }

  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {optional && (
          <span className="font-normal text-text-muted"> (opcional)</span>
        )}
      </label>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2 focus-within:border-primary">
        {value.map((address, index) => (
          <span
            key={address}
            className="inline-flex items-center gap-1 rounded-pill bg-appbg px-2 py-1 text-sm text-text"
          >
            <span>{address}</span>
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Eliminar ${address}`}
              className="flex h-5 w-5 items-center justify-center rounded-pill text-text-muted hover:bg-border hover:text-text"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          aria-describedby={helpId}
          className="min-w-[8rem] flex-1 bg-transparent p-1 text-text outline-none"
        />
      </div>

      {helpText && (
        <p id={helpId} className="text-xs text-text-muted">
          {helpText}
        </p>
      )}
    </div>
  );
}

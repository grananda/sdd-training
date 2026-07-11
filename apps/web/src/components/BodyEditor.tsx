import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

/**
 * Configuración del toolbar acotado (HU-10): solo negrita, cursiva y listas
 * (ordenada y no ordenada). Se exporta para poder verificar en tests que no se
 * ofrece ningún formato fuera del set (ni enlaces, ni imágenes, ni encabezados).
 */
export const bodyEditorModules = {
  toolbar: [["bold", "italic"], [{ list: "ordered" }, { list: "bullet" }]],
} as const;

/** Formatos permitidos: coherentes con el toolbar. `list` cubre ordenada y no ordenada. */
export const bodyEditorFormats = ["bold", "italic", "list"] as const;

export interface BodyEditorProps {
  value: string;
  /** Recibe el cuerpo como HTML. */
  onChange: (html: string) => void;
}

/**
 * Editor de cuerpo enriquecido con React Quill (`react-quill-new`, compatible con
 * React 18) y salida HTML (HU-10). El saneamiento del HTML es del backend
 * (HU-17), no de esta capa.
 */
export function BodyEditor({ value, onChange }: BodyEditorProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-text">Cuerpo</span>
      <div className="rounded-md border border-border bg-surface">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={bodyEditorModules}
          formats={[...bodyEditorFormats]}
        />
      </div>
    </div>
  );
}

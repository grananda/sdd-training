import { Controller, useForm } from "react-hook-form";
import type { EmailDraft } from "@aidd/shared";
import { RecipientChips } from "./RecipientChips";
import { SubjectField } from "./SubjectField";
import { BodyEditor } from "./BodyEditor";

const emptyDraft: EmailDraft = {
  to: [],
  cc: [],
  bcc: [],
  subject: "",
  body: "",
};

/**
 * Pantalla única de composición del correo (HU-05). Orquesta con React Hook Form
 * los campos Para/CC/CCO (chips), Asunto y Cuerpo (React Quill), en español y con
 * identidad NTT DATA.
 *
 * En esta fase **no hay validación** (HU-08/HU-14, fase de validación de cliente)
 * ni **envío** real: el botón Enviar se renderiza pero es **inerte** — el cableado
 * a `POST /api/send` (useSendEmail) llega en la fase de envío desde la UI.
 */
export function EmailForm() {
  const { control, handleSubmit } = useForm<EmailDraft>({
    defaultValues: emptyDraft,
  });

  // Envío inerte en esta fase; se sustituye por useSendEmail en la fase 4.
  const onSubmit = (_draft: EmailDraft) => {
    /* no-op: el envío real se cablea en la fase `ui-envio-feedback` */
  };

  return (
    <main className="min-h-screen bg-appbg text-text font-base p-6">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-primary">Componer correo</h1>
          <p className="mt-1 text-sm text-text-muted">
            Rellena los destinatarios, el asunto y el cuerpo del mensaje.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 shadow-sm"
          noValidate
        >
          <Controller
            control={control}
            name="to"
            render={({ field }) => (
              <RecipientChips
                id="field-to"
                label="Para"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="cc"
            render={({ field }) => (
              <RecipientChips
                id="field-cc"
                label="CC"
                optional
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="bcc"
            render={({ field }) => (
              <RecipientChips
                id="field-bcc"
                label="CCO"
                optional
                helpText="Copia oculta: el resto de destinatarios no la ven."
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <SubjectField
                id="field-subject"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <BodyEditor value={field.value} onChange={field.onChange} />
            )}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-primary px-5 py-2 font-medium text-surface hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

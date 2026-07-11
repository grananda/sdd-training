import { SHARED_PLACEHOLDER } from "@aidd/shared";

/**
 * Página placeholder del walking skeleton (fase `foundation`). Sin formulario ni
 * lógica de negocio todavía: solo confirma que React + Tailwind + tokens y la
 * resolución de `@aidd/shared` funcionan. El formulario de composición llega en
 * fases posteriores del roadmap.
 */
export default function App() {
  return (
    <main className="min-h-screen bg-appbg text-text font-base flex items-center justify-center p-6">
      <section className="bg-surface border border-border rounded-lg shadow-sm max-w-lg w-full p-8">
        <h1 className="text-2xl font-semibold text-primary">aidd-training</h1>
        <p className="mt-3 text-text-muted">
          Esqueleto inicial operativo. Aquí vivirá el formulario para componer y
          enviar un email.
        </p>
        <p className="mt-4 text-sm text-text-disabled">
          Paquete compartido: <code>{SHARED_PLACEHOLDER}</code>
        </p>
      </section>
    </main>
  );
}

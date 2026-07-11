import { EmailForm } from "./components/EmailForm";

/**
 * Pantalla única de la aplicación (una sola ruta `/`): el formulario de
 * composición del correo. El envío desde la UI, la validación de cliente y el
 * adjunto se añaden en fases posteriores del roadmap.
 */
export default function App() {
  return <EmailForm />;
}

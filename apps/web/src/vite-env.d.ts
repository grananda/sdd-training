/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL del backend (p. ej. http://localhost:3000). Default en apiClient. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

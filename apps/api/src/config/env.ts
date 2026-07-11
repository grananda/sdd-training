import { config as loadDotenv } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { z } from "zod";

// Carga el .env de la raíz del monorepo de forma determinista, sin depender del
// cwd: este módulo vive en apps/api/(src|dist)/config, así que la raíz está 4
// niveles arriba. dotenv no pisa variables ya presentes en el entorno, por lo que
// en Docker (donde no hay .env y las vars llegan del compose) es un no-op seguro.
const moduleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(moduleDir, "../../../..");
loadDotenv({ path: resolve(repoRoot, ".env") });

/**
 * Carga (`dotenv`) y validación (Zod) de la configuración del backend.
 *
 * `dotenv/config` carga `.env` sin pisar variables ya presentes en el entorno
 * del proceso, así que es seguro tanto en el arranque nativo (`pnpm dev`, que lee
 * `.env`) como dentro de Docker (donde las variables llegan del `environment:` del
 * compose). Toda la configuración viene del entorno; nada se hardcodea.
 */
const booleanFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const envSchema = z.object({
  SMTP_HOST: z.string().min(1, "SMTP_HOST es obligatorio"),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_SECURE: booleanFromString.default("false"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASSWORD: z.string().optional().default(""),
  MAIL_FROM: z.string().min(1, "MAIL_FROM es obligatorio"),
  MAX_ATTACHMENT_SIZE_MB: z.coerce.number().int().positive().default(10),
  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.string().url("WEB_ORIGIN debe ser una URL válida"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Valida el entorno y devuelve la configuración tipada. Si falta o es inválida
 * una variable requerida, corta el arranque con un mensaje claro (fail-fast) en
 * lugar de dejar el servicio en un estado inconsistente.
 */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Configuración de entorno inválida -> ${detail}`);
  }
  return parsed.data;
}

export const env = loadEnv();

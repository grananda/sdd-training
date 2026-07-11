import pino from "pino";

/**
 * Logger de servidor (pino). Traza operativa sin persistir contenido de correos
 * ni secretos (NFR-06). El nivel se puede ajustar con LOG_LEVEL (por defecto info).
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "aidd-api" },
});

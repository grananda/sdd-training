import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger.js";

/**
 * Error handler uniforme del backend. Responde `{ ok:false, code, message }` con
 * un mensaje **genérico** (sin filtrar credenciales ni internals del SMTP) y
 * registra el detalle técnico curado — solo `message`/`code`, nunca el objeto de
 * error entero ni secretos (HU-03, NFR-03/06).
 *
 * Debe registrarse **después** de las rutas y conservar los 4 parámetros para que
 * Express lo reconozca como middleware de error.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const detail =
    err instanceof Error
      ? { message: err.message, code: (err as { code?: string }).code }
      : { message: String(err) };

  logger.error({ err: detail }, "error controlado en el pipeline de envío");

  res.status(502).json({
    ok: false,
    code: "SEND_FAILED",
    message: "No se pudo enviar el correo",
  });
}

import type { NextFunction, Request, Response } from "express";
import { sendMail } from "../services/mailer/mailer.js";
import { logger } from "../logger.js";
import type { SendEmailRequest } from "../types/email.js";

/**
 * Orquesta el envío de `POST /api/send`: entrega el correo al SMTP con Nodemailer
 * y registra el resultado (HU-03, HU-04). En esta fase **no** valida el dominio ni
 * sanea el cuerpo (validación autoritativa: HU-18, fase 5; saneamiento: HU-17,
 * fase 7); el cuerpo se envía como HTML tal cual.
 */
export async function sendController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { to, cc, bcc, subject, body } = (req.body ?? {}) as SendEmailRequest;

  try {
    await sendMail({ to, cc, bcc, subject, html: body });

    // Log de resultado con allow-list de campos: nunca el cuerpo ni secretos (NFR-06).
    logger.info({ result: "success", to, cc, bcc, subject }, "envío de correo");

    res.status(200).json({ ok: true, message: "Correo enviado" });
  } catch (err) {
    // Traza de resultado del envío (sin cuerpo ni secretos); el detalle técnico
    // lo registra el error handler.
    logger.warn({ result: "error", to, cc, bcc, subject }, "envío de correo fallido");
    next(err);
  }
}

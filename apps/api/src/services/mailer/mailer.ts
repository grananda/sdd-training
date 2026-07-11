import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../../config/env.js";

/**
 * Servicio de envío SMTP (Nodemailer). Aislado de Express para poder testearlo
 * con el transporter stubbeado. La configuración procede solo del entorno
 * (`config/env`); nada se hardcodea (HU-03, NFR-03/09).
 */

let transporter: Transporter | null = null;

/**
 * Devuelve el transporter, construyéndolo **una sola vez** a partir del entorno
 * y reutilizándolo en envíos posteriores. `auth` se omite cuando `SMTP_USER`/
 * `SMTP_PASSWORD` están vacíos (p. ej. Mailpit en desarrollo, sin autenticación).
 */
export function getTransporter(): Transporter {
  if (!transporter) {
    const auth =
      env.SMTP_USER && env.SMTP_PASSWORD
        ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
        : undefined;

    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      ...(auth ? { auth } : {}),
    });
  }
  return transporter;
}

/** Reinicia el transporter memoizado. Solo para tests. */
export function resetTransporter(): void {
  transporter = null;
}

export interface SendMailInput {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  /** Cuerpo ya en HTML. En esta fase se envía tal cual (saneamiento: HU-17). */
  html: string;
}

/**
 * Construye y entrega el mensaje al servidor SMTP. Devuelve el resultado de
 * Nodemailer en caso de éxito y **propaga** el error si el SMTP falla, para que
 * el pipeline lo mapee a una respuesta controlada sin filtrar secretos.
 */
export async function sendMail(input: SendMailInput): Promise<nodemailer.SentMessageInfo> {
  const { to, cc, bcc, subject, html } = input;
  return getTransporter().sendMail({
    from: env.MAIL_FROM,
    to,
    cc,
    bcc,
    subject,
    html,
  });
}

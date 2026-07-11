import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Transporter de Nodemailer stubbeado para el test de integración de la ruta.
const sendMailMock = vi.fn();
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: sendMailMock })),
  },
}));

import { createApp } from "../src/app.js";
import { resetTransporter } from "../src/services/mailer/mailer.js";
import { logger } from "../src/logger.js";

const validPayload = {
  to: ["a@b.com"],
  cc: ["c@d.com"],
  subject: "Hola",
  body: "<p>CUERPO_SECRETO</p>",
};

describe("POST /api/send", () => {
  beforeEach(() => {
    sendMailMock.mockReset();
    resetTransporter();
  });

  it("responde 200 { ok:true } cuando el envío tiene éxito", async () => {
    sendMailMock.mockResolvedValue({ messageId: "1" });

    const res = await request(createApp()).post("/api/send").send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, message: expect.any(String) });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it("responde 5xx controlado sin filtrar secretos cuando el SMTP falla", async () => {
    sendMailMock.mockRejectedValue(
      new Error("SMTP auth failed for user pa55word@smtp.internal"),
    );

    const res = await request(createApp()).post("/api/send").send(validPayload);

    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe("SEND_FAILED");
    // El mensaje del error del SMTP no se filtra en la respuesta.
    expect(JSON.stringify(res.body)).not.toContain("pa55word");
  });

  it("registra el resultado con destinatarios y asunto, sin el cuerpo", async () => {
    sendMailMock.mockResolvedValue({ messageId: "1" });
    const infoSpy = vi.spyOn(logger, "info");

    await request(createApp()).post("/api/send").send(validPayload);

    const logCall = infoSpy.mock.calls.find(
      (call) => (call[0] as { result?: string })?.result === "success",
    );
    expect(logCall).toBeTruthy();

    const logged = logCall![0] as Record<string, unknown>;
    expect(logged.to).toEqual(["a@b.com"]);
    expect(logged.subject).toBe("Hola");
    expect(JSON.stringify(logged)).not.toContain("CUERPO_SECRETO");

    infoSpy.mockRestore();
  });
});

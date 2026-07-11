import { describe, it, expect, vi, beforeEach } from "vitest";

// Transporter de Nodemailer stubbeado: sin red, determinista.
const sendMailMock = vi.fn();
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: sendMailMock })),
  },
}));

import { sendMail, resetTransporter } from "../src/services/mailer/mailer.js";

describe("mailer.sendMail", () => {
  beforeEach(() => {
    sendMailMock.mockReset();
    resetTransporter();
  });

  it("construye el mensaje con from/to/cc/bcc/subject/html", async () => {
    sendMailMock.mockResolvedValue({ messageId: "1" });

    await sendMail({
      to: ["a@b.com"],
      cc: ["c@d.com"],
      bcc: ["e@f.com"],
      subject: "Asunto",
      html: "<p>hola</p>",
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(String),
        to: ["a@b.com"],
        cc: ["c@d.com"],
        bcc: ["e@f.com"],
        subject: "Asunto",
        html: "<p>hola</p>",
      }),
    );
  });

  it("propaga el error del transporter si el SMTP falla", async () => {
    sendMailMock.mockRejectedValue(new Error("SMTP down"));

    await expect(
      sendMail({ to: ["a@b.com"], subject: "Asunto", html: "x" }),
    ).rejects.toThrow("SMTP down");
  });
});

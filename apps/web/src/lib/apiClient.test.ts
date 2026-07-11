import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEmail } from "./apiClient";

const draft = {
  to: ["a@b.com"],
  cc: [],
  bcc: [],
  subject: "Hola",
  body: "<p>x</p>",
};

describe("apiClient.sendEmail", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("devuelve {ok:true} cuando el backend responde correcto", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, message: "Correo enviado" }),
      }),
    );

    const result = await sendEmail(draft);

    expect(result).toEqual({ ok: true, message: "Correo enviado" });
  });

  it("devuelve {ok:false, code} cuando el backend responde error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ ok: false, code: "SEND_FAILED", message: "" }),
      }),
    );

    const result = await sendEmail(draft);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("SEND_FAILED");
  });

  it("mapea el fallo de red a code NETWORK", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await sendEmail(draft);

    expect(result).toEqual({ ok: false, code: "NETWORK", message: "" });
  });
});

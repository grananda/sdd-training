import { describe, it, expect } from "vitest";
import { SHARED_PACKAGE, type EmailDraft } from "./index.js";

describe("@aidd/shared", () => {
  it("expone el identificador del paquete compartido", () => {
    expect(SHARED_PACKAGE).toBe("@aidd/shared");
  });

  it("el tipo EmailDraft describe el contrato del borrador de email", () => {
    const draft: EmailDraft = {
      to: ["a@b.com"],
      cc: [],
      bcc: [],
      subject: "Hola",
      body: "<p>cuerpo</p>",
    };
    expect(draft.to).toEqual(["a@b.com"]);
    expect(draft.subject).toBe("Hola");
  });
});

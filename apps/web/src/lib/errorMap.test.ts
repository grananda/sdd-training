import { describe, it, expect } from "vitest";
import { errorMessage } from "./errorMap";

describe("errorMap.errorMessage", () => {
  it("traduce códigos conocidos", () => {
    expect(errorMessage("SEND_FAILED")).toMatch(/no se pudo enviar/i);
    expect(errorMessage("NETWORK")).toMatch(/conectar/i);
  });

  it("usa un fallback para códigos desconocidos", () => {
    expect(errorMessage("LO_QUE_SEA")).toMatch(/no se pudo enviar/i);
  });
});

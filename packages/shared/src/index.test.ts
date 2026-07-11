import { describe, it, expect } from "vitest";
import { SHARED_PACKAGE, SHARED_PLACEHOLDER } from "./index.js";

describe("@aidd/shared (placeholder de foundation)", () => {
  it("expone los marcadores del contrato compartido", () => {
    expect(SHARED_PACKAGE).toBe("@aidd/shared");
    expect(SHARED_PLACEHOLDER).toContain("foundation");
  });
});

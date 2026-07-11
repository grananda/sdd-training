import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { SubjectField, normalizeSubject } from "./SubjectField";

describe("normalizeSubject", () => {
  it("colapsa saltos de línea a un espacio", () => {
    expect(normalizeSubject("línea1\nlínea2\r\nlínea3")).toBe(
      "línea1 línea2 línea3",
    );
  });
});

function Harness() {
  const [value, setValue] = useState("");
  return <SubjectField id="subject" value={value} onChange={setValue} />;
}

describe("SubjectField", () => {
  it("normaliza a una sola línea el texto multilínea pegado", () => {
    render(<Harness />);
    const input = screen.getByLabelText("Asunto") as HTMLInputElement;

    fireEvent.paste(input, {
      clipboardData: { getData: () => "hola\nmundo" },
    });

    expect(input.value).toBe("hola mundo");
  });
});

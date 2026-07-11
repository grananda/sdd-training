import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// React Quill no rinde bien en jsdom: se sustituye por un textarea equivalente.
vi.mock("react-quill-new", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <textarea
      aria-label="Cuerpo editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

import { EmailForm } from "./EmailForm";

describe("EmailForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra todos los campos y el botón Enviar", () => {
    render(<EmailForm />);
    expect(
      screen.getByRole("heading", { name: /componer correo/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Para")).toBeInTheDocument();
    expect(screen.getByLabelText("CC (opcional)")).toBeInTheDocument();
    expect(screen.getByLabelText("CCO (opcional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Asunto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
  });

  it("marca CC y CCO como opcionales", () => {
    render(<EmailForm />);
    expect(screen.getAllByText("(opcional)").length).toBeGreaterThanOrEqual(2);
  });

  it("el botón Enviar no dispara ninguna petición (inerte en esta fase)", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<EmailForm />);

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

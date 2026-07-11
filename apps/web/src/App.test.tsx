import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

import App from "./App";

describe("App", () => {
  it("renderiza el formulario de composición", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /componer correo/i }),
    ).toBeInTheDocument();
  });
});

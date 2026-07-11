import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App (skeleton de foundation)", () => {
  it("renderiza el título del producto", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /aidd-training/i }),
    ).toBeInTheDocument();
  });
});

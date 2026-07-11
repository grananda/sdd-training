import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { RecipientChips } from "./RecipientChips";

function Harness() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <RecipientChips id="to" label="Para" value={value} onChange={setValue} />
  );
}

describe("RecipientChips", () => {
  it("añade una dirección como chip al pulsar Enter", () => {
    render(<Harness />);
    const input = screen.getByLabelText("Para");
    fireEvent.change(input, { target: { value: "a@b.com" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByText("a@b.com")).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("añade con coma y admite varias direcciones", () => {
    render(<Harness />);
    const input = screen.getByLabelText("Para");

    fireEvent.change(input, { target: { value: "a@b.com" } });
    fireEvent.keyDown(input, { key: "," });
    fireEvent.change(input, { target: { value: "c@d.com" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByText("a@b.com")).toBeInTheDocument();
    expect(screen.getByText("c@d.com")).toBeInTheDocument();
  });

  it("elimina un chip con su botón", () => {
    render(<Harness />);
    const input = screen.getByLabelText("Para");
    fireEvent.change(input, { target: { value: "a@b.com" } });
    fireEvent.keyDown(input, { key: "Enter" });

    fireEvent.click(screen.getByRole("button", { name: "Eliminar a@b.com" }));

    expect(screen.queryByText("a@b.com")).not.toBeInTheDocument();
  });
});

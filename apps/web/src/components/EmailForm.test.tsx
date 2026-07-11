import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { SendResult } from "../lib/apiClient";

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

// El cliente de envío se controla desde el test.
vi.mock("../lib/apiClient", () => ({ sendEmail: vi.fn() }));

import { EmailForm } from "./EmailForm";
import { sendEmail } from "../lib/apiClient";

const mockedSend = vi.mocked(sendEmail);

function addPara(address: string) {
  const input = screen.getByLabelText("Para");
  fireEvent.change(input, { target: { value: address } });
  fireEvent.keyDown(input, { key: "Enter" });
}

describe("EmailForm (envío y feedback)", () => {
  beforeEach(() => {
    mockedSend.mockReset();
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

  it("deshabilita el botón mientras el envío está en curso", async () => {
    let resolveSend: (r: SendResult) => void = () => {};
    mockedSend.mockReturnValue(
      new Promise<SendResult>((resolve) => {
        resolveSend = resolve;
      }),
    );

    render(<EmailForm />);
    addPara("a@b.com");
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    const sending = await screen.findByRole("button", { name: "Enviando…" });
    expect(sending).toBeDisabled();

    resolveSend({ ok: true, message: "Correo enviado" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled(),
    );
  });

  it("al éxito muestra banner y limpia el formulario", async () => {
    mockedSend.mockResolvedValue({ ok: true, message: "Correo enviado" });

    render(<EmailForm />);
    addPara("a@b.com");
    const subject = screen.getByLabelText("Asunto") as HTMLInputElement;
    fireEvent.change(subject, { target: { value: "Hola" } });

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/correo enviado/i);
    await waitFor(() => {
      expect(screen.queryByText("a@b.com")).not.toBeInTheDocument();
      expect((screen.getByLabelText("Asunto") as HTMLInputElement).value).toBe("");
    });
  });

  it("al error muestra banner y conserva los datos", async () => {
    mockedSend.mockResolvedValue({ ok: false, code: "SEND_FAILED", message: "" });

    render(<EmailForm />);
    addPara("a@b.com");
    const subject = screen.getByLabelText("Asunto") as HTMLInputElement;
    fireEvent.change(subject, { target: { value: "Hola" } });

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/no se pudo enviar/i);
    expect(screen.getByText("a@b.com")).toBeInTheDocument();
    expect((screen.getByLabelText("Asunto") as HTMLInputElement).value).toBe("Hola");
  });
});

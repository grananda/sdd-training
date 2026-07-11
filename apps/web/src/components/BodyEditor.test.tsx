import { describe, it, expect } from "vitest";
import { bodyEditorModules, bodyEditorFormats } from "./BodyEditor";

/**
 * El toolbar de React Quill no se renderiza de forma fiable en jsdom, así que se
 * verifica la configuración acotada del editor (HU-10): solo negrita, cursiva y
 * listas; nada de enlaces, imágenes ni encabezados.
 */
describe("BodyEditor (config del toolbar)", () => {
  const flatToolbar = bodyEditorModules.toolbar.flat();

  it("ofrece negrita, cursiva y listas ordenada/no ordenada", () => {
    expect(flatToolbar).toContainEqual("bold");
    expect(flatToolbar).toContainEqual("italic");
    expect(flatToolbar).toContainEqual({ list: "ordered" });
    expect(flatToolbar).toContainEqual({ list: "bullet" });
  });

  it("no ofrece enlaces, imágenes ni encabezados", () => {
    const serialized = JSON.stringify(bodyEditorModules.toolbar);
    expect(serialized).not.toContain("link");
    expect(serialized).not.toContain("image");
    expect(serialized).not.toContain("header");
  });

  it("restringe los formatos permitidos al set acordado", () => {
    expect([...bodyEditorFormats].sort()).toEqual(["bold", "italic", "list"]);
  });
});

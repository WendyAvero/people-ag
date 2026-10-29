import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// La sección "Sobre" debe depender solo de siteConfig.founder.
async function renderWith(founder: Record<string, unknown>) {
  vi.resetModules();
  vi.doMock("@/config/site", () => ({
    siteConfig: {
      name: "People AG",
      founder: {
        name: null,
        role: null,
        bio: null,
        credentials: null,
        photo: null,
        photoAlt: null,
        ...founder,
      },
    },
  }));
  const { Sobre } = await import("@/components/sections/Sobre");
  return renderToStaticMarkup(<Sobre />);
}

describe("Sobre People AG (configurable)", () => {
  it("sin datos de la fundadora no muestra bloque personal ni relleno", async () => {
    const html = await renderWith({});
    expect(html).toContain("Sobre People AG");
    const visible = html.replace(/<[^>]*>/g, " ");
    expect(visible).not.toMatch(/pronto|próximamente|Lorem|\[|COMPLETAR/i);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("border-l-2 border-sand pl-6"); // bloque personal
  });

  it("con datos reales muestra nombre, rol, bio y credenciales", async () => {
    const html = await renderWith({
      name: "Nombre de Prueba",
      role: "Rol de prueba",
      bio: ["Primer párrafo de prueba.", "Segundo párrafo de prueba."],
      credentials: ["Dato verificable uno", "Dato verificable dos"],
    });
    for (const text of [
      "Nombre de Prueba",
      "Rol de prueba",
      "Primer párrafo de prueba.",
      "Segundo párrafo de prueba.",
      "Dato verificable uno",
      "Dato verificable dos",
    ]) {
      expect(html).toContain(text);
    }
    expect(html).not.toContain("<img");
  });

  it("con foto usa el texto alternativo configurado", async () => {
    const html = await renderWith({
      name: "Nombre de Prueba",
      photo: "/fundadora.jpg",
      photoAlt: "Retrato de prueba",
    });
    expect(html).toContain("<img");
    expect(html).toContain('alt="Retrato de prueba"');
  });
});

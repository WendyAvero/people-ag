import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Sobre } from "@/components/sections/Sobre";
import { Footer } from "@/components/layout/Footer";

// El logo importa un PNG (lo resuelve Next al compilar); en tests se reemplaza.
vi.mock("@/components/layout/Logo", () => ({ Logo: () => null }));

// Con la configuración REAL del sitio (sin mocks).
describe("Sobre People AG y pie con la configuración real", () => {
  const sobre = renderToStaticMarkup(<Sobre />);
  const footer = renderToStaticMarkup(<Footer />);

  it("muestra el título, la fundadora y su credencial", () => {
    expect(sobre).toContain("Experiencia profesional. Criterio de negocio. Soluciones reales.");
    expect(sobre).toContain("Wendy Avero González");
    expect(sobre).toContain("Licenciada en Relaciones del Trabajo · Universidad de Buenos Aires");
    expect(sobre).toContain("fundadora de People AG");
  });

  it("muestra los tres bloques de valor actualizados", () => {
    for (const t of ["Criterio profesional", "Visión de negocio", "Compromiso con los resultados"]) {
      expect(sobre).toContain(t);
    }
    expect(sobre).not.toContain("Criterio técnico");
    expect(sobre).not.toContain("Cercanía y soluciones a medida");
  });

  it("no vincula People AG con otra empresa ni agrega datos no provistos", () => {
    const all = (sobre + footer).replace(/<[^>]+>/g, " ");
    expect(all).not.toMatch(/Tekhne|años de experiencia|certificad/i);
    expect(all).not.toMatch(/\bISO\b/);
    expect(sobre).not.toContain("<img"); // sin foto: no se inventa
  });

  it("el pie usa la nueva descripción institucional", () => {
    const text = footer.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(text).toContain(
      "Consultoría estratégica de Recursos Humanos para empresas. Selección, profesionalización de la gestión de personas y asesoramiento adaptado a cada organización.",
    );
  });
});

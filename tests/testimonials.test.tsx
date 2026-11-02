import { readFileSync } from "node:fs";
import { join } from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Testimonios } from "@/components/sections/Testimonios";
import {
  publishedTestimonials,
  testimonials,
  type Testimonial,
} from "@/content/testimonials";

// Los textos de este archivo son solo de prueba y no existen en el sitio.
const base: Testimonial = {
  quote: "Texto de prueba del testimonio.",
  name: "Nombre de Prueba",
  role: "Cargo de prueba",
  company: "Empresa de prueba",
  approved: true,
};

const TITLE = "La experiencia de trabajar con People AG";

describe("contenido de testimonios", () => {
  it("no trae textos de ejemplo ni de relleno", () => {
    const text = testimonials
      .flatMap((t) => [t.quote, t.name, t.role ?? "", t.company ?? ""])
      .join("\n");
    expect(text).not.toMatch(
      /lorem|ejemplo|de prueba|nombre y apellido|\[|COMPLETAR/i,
    );
  });

  it("solo se muestra lo que está aprobado: la sección existe si y solo si hay testimonios publicables", () => {
    const html = renderToStaticMarkup(<Testimonios />);
    expect(html.includes(TITLE)).toBe(publishedTestimonials().length > 0);
  });

  it("el tipo no admite fotos ni logos", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "content", "testimonials.ts"),
      "utf8",
    );
    expect(source).not.toMatch(/^\s*(photo|foto|image|imagen|logo|avatar)\??\s*:/im);
  });
});

describe("sección Testimonios", () => {
  it("sin testimonios no renderiza nada, ni siquiera el título", () => {
    expect(renderToStaticMarkup(<Testimonios items={[]} />)).toBe("");
  });

  it("los no aprobados o incompletos no se publican", () => {
    const html = renderToStaticMarkup(
      <Testimonios
        items={[
          { ...base, approved: false },
          { ...base, name: "  " },
          { ...base, quote: "   " },
        ]}
      />,
    );
    expect(html).toBe("");
  });

  it("muestra título, texto, nombre, cargo y empresa", () => {
    const html = renderToStaticMarkup(<Testimonios items={[base]} />);
    for (const text of [
      TITLE,
      "Texto de prueba del testimonio.",
      "Nombre de Prueba",
      "Cargo de prueba, Empresa de prueba",
    ]) {
      expect(html).toContain(text);
    }
    expect(html).toContain('id="testimonios"');
    expect(html).not.toContain("<img");
  });

  it("permite omitir cargo o empresa sin dejar huecos ni 'undefined'", () => {
    const sinEmpresa = renderToStaticMarkup(
      <Testimonios items={[{ ...base, company: null }]} />,
    );
    expect(sinEmpresa).toContain("Cargo de prueba");
    expect(sinEmpresa).not.toMatch(/Empresa de prueba|undefined|null|, </);

    const sinCargo = renderToStaticMarkup(
      <Testimonios items={[{ ...base, role: undefined }]} />,
    );
    expect(sinCargo).toContain("Empresa de prueba");
    expect(sinCargo).not.toMatch(/Cargo de prueba|undefined|null/);

    const soloNombre = renderToStaticMarkup(
      <Testimonios items={[{ ...base, role: null, company: "" }]} />,
    );
    expect(soloNombre).toContain("Nombre de Prueba");
    expect(soloNombre).not.toMatch(/text-muted|undefined|null/);
  });

  it("separa los párrafos por línea en blanco y arma la grilla según la cantidad", () => {
    const dos = renderToStaticMarkup(
      <Testimonios
        items={[
          { ...base, quote: "Primer párrafo de prueba.\n\nSegundo párrafo de prueba." },
          { ...base, name: "Otra Persona de Prueba" },
        ]}
      />,
    );
    expect(dos).toContain("<p>Primer párrafo de prueba.</p>");
    expect(dos).toContain("<p>Segundo párrafo de prueba.</p>");
    expect(dos).toContain("md:grid-cols-2");
    expect(dos).not.toContain("lg:grid-cols-3");

    const tres = renderToStaticMarkup(
      <Testimonios
        items={[base, { ...base, name: "Dos de Prueba" }, { ...base, name: "Tres de Prueba" }]}
      />,
    );
    expect(tres).toContain("lg:grid-cols-3");
  });
});

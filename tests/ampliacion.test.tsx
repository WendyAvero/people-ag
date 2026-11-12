import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Empresas } from "@/components/sections/Empresas";
import { Hero } from "@/components/sections/Hero";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { Sobre } from "@/components/sections/Sobre";
import { siteConfig } from "@/config/site";
import { servicePageList } from "@/content/service-pages";

vi.mock("@/components/layout/Logo", () => ({ Logo: () => null }));

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const newPages = servicePageList.filter((p) =>
  ["capacitacion-y-desarrollo-para-empresas", "integracion-y-desarrollo-de-equipos"].includes(p.slug),
);

describe("ampliación a cuatro líneas de servicio", () => {
  it("el titular de la home no cambia", () => {
    const hero = text(renderToStaticMarkup(<Hero />));
    expect(hero).toContain("Contratá mejor. Gestioná personas con criterio.");
    expect(hero).toContain(
      "Consultora de Recursos Humanos y Desarrollo Organizacional para empresas",
    );
  });

  it("«Servicio principal» no aparece en ninguna parte del código del sitio", () => {
    for (const f of walk(join(process.cwd(), "src")).filter((f) => /\.(tsx?|mdx?)$/.test(f))) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/Servicio principal/i);
    }
  });

  it("la sección de servicios muestra las cuatro líneas con el mismo tratamiento", () => {
    const html = renderToStaticMarkup(<Empresas />);
    expect(html.match(/<article /g)).toHaveLength(4);
    for (const id of ["reclutamiento", "consultoria", "capacitacion", "integracion"]) {
      expect(html).toContain(`id="${id}"`);
    }
    // Sin bloque destacado con fondo propio ni numeración que sugiera prioridad.
    expect(html).not.toContain("bg-sand-light");
    expect(text(html)).not.toMatch(/\b0[1-4]\b/);
  });

  it("el submenú «Servicios» tiene exactamente las cuatro entradas aprobadas, en orden", () => {
    const html = renderToStaticMarkup(<Header />);
    const sub = html.match(/<ul id="submenu-servicios"[\s\S]*?<\/ul>/)?.[0] ?? "";
    const items = [...sub.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => [m[2], m[1]]);
    expect(items).toEqual([
      ["Reclutamiento y selección", "/reclutamiento-y-seleccion-de-personal"],
      ["Consultoría estratégica de Recursos Humanos", "/consultoria-estrategica-de-recursos-humanos"],
      ["Capacitación y desarrollo", "/capacitacion-y-desarrollo-para-empresas"],
      ["Integración y desarrollo de equipos", "/integracion-y-desarrollo-de-equipos"],
    ]);
    expect(text(html)).toContain("Servicios");
    expect(text(html)).not.toContain("Empresas");
  });

  it("el pie enlaza a las cuatro páginas", () => {
    const html = renderToStaticMarkup(<Footer />);
    for (const p of servicePageList) expect(html).toContain(`href="/${p.slug}"`);
  });

  it("cada página enlaza a las otras tres con «También podemos ayudarte con»", () => {
    for (const page of servicePageList) {
      const html = renderToStaticMarkup(<ServicePageView page={page} />);
      expect(html, page.slug).toContain("También podemos ayudarte con");
      expect(html, page.slug).not.toContain("Otros servicios");
      const from = html.indexOf('aria-labelledby="tambien-title"');
      const block = html.slice(from, html.indexOf("</section>", from));
      for (const other of servicePageList.filter((p) => p.slug !== page.slug)) {
        expect(block, `${page.slug} → ${other.slug}`).toContain(`href="/${other.slug}"`);
      }
      expect(block, page.slug).not.toContain(`href="/${page.slug}"`);
      expect(html.match(/<h1[ >]/g), page.slug).toHaveLength(1);
    }
  });

  it("las páginas nuevas presentan modalidad y países sin promesas no definidas", () => {
    expect(newPages).toHaveLength(2);
    for (const p of newPages) {
      const t = JSON.stringify(p);
      expect(t, p.slug).toMatch(/presencial o remota/i);
      expect(t, p.slug).toMatch(/Argentina y Uruguay/);
      expect(t, p.slug).not.toMatch(/Santa Fe|certificad|garantiz|resultados? (garantizados|asegurados)|\$|USD|precio de|\bhoras?\b/i);
      expect(t, p.slug).not.toMatch(/\d+\s?(%|años|clientes|empresas|personas|equipos)/i);
    }
  });

  it("las páginas nuevas tienen las temáticas aprobadas", () => {
    const [cap, int] = newPages;
    expect(cap.topics).toHaveLength(7);
    expect(int.topics).toHaveLength(6);
    expect(cap.ctaLabel).toBe("Quiero capacitar a mi equipo");
    expect(int.ctaLabel).toBe("Quiero un taller para mi equipo");
    expect(cap.mailSubject).toBe("Consulta por capacitación y desarrollo");
    expect(int.mailSubject).toBe("Consulta por integración y desarrollo de equipos");
    for (const p of newPages) {
      const html = renderToStaticMarkup(<ServicePageView page={p} />);
      expect(html).toContain("Temáticas");
    }
    // Las páginas existentes no muestran la sección de temáticas.
    const rec = renderToStaticMarkup(<ServicePageView page={servicePageList[0]} />);
    expect(rec).not.toContain("Temáticas");
  });

  it("la formación aparece una sola vez, solo en «Sobre People AG»", () => {
    const sobre = text(renderToStaticMarkup(<Sobre />));
    expect(sobre.match(/Relaciones del Trabajo/g)).toHaveLength(1);
    expect(sobre.match(/Change Management/g)).toHaveLength(1);
    const elsewhere = [
      renderToStaticMarkup(<Hero />),
      renderToStaticMarkup(<Empresas />),
      renderToStaticMarkup(<Header />),
      renderToStaticMarkup(<Footer />),
      ...servicePageList.map((p) => renderToStaticMarkup(<ServicePageView page={p} />)),
      JSON.stringify(siteConfig.description),
    ].join(" ");
    expect(elsewhere).not.toMatch(/Relaciones del Trabajo|Change Management|Coaching/i);
  });
});

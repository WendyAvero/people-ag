import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Empresas } from "@/components/sections/Empresas";
import { Hero } from "@/components/sections/Hero";
import { ComoTrabajamos } from "@/components/sections/ComoTrabajamos";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { Sobre } from "@/components/sections/Sobre";
import { siteConfig } from "@/config/site";
import { servicePageList } from "@/content/service-pages";

vi.mock("@/components/layout/Logo", () => ({ Logo: () => null }));

// El submenú marca la página activa según la ruta (hook de Next, sin router en tests).
let mockPath: string | null = null;
vi.mock("next/navigation", () => ({ usePathname: () => mockPath }));

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const newPages = servicePageList.filter((p) => p.slug === "capacitacion-talleres-y-desarrollo-de-equipos");

describe("ampliación a tres líneas de servicio", () => {
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

  it("la sección de servicios muestra las tres líneas con el mismo tratamiento", () => {
    const html = renderToStaticMarkup(<Empresas />);
    expect(html.match(/<article /g)).toHaveLength(3);
    for (const id of ["reclutamiento", "consultoria", "capacitacion"]) {
      expect(html).toContain(`id="${id}"`);
    }
    // Sin bloque destacado con fondo propio ni numeración que sugiera prioridad.
    expect(html).not.toContain("bg-sand-light");
    expect(text(html)).not.toMatch(/\b0[1-4]\b/);
  });

  it("el submenú «Servicios» tiene exactamente las tres entradas aprobadas, en orden", () => {
    const html = renderToStaticMarkup(<Header />);
    const sub = html.match(/<ul id="submenu-servicios"[\s\S]*?<\/ul>/)?.[0] ?? "";
    const items = [...sub.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => [m[2], m[1]]);
    expect(items).toEqual([
      ["Reclutamiento y selección", "/reclutamiento-y-seleccion-de-personal"],
      ["Consultoría estratégica de Recursos Humanos", "/consultoria-estrategica-de-recursos-humanos"],
      ["Capacitación, talleres y desarrollo de equipos", "/capacitacion-talleres-y-desarrollo-de-equipos"],
    ]);
    expect(text(html)).toContain("Servicios");
    expect(text(html)).not.toContain("Empresas");
  });

  it("el pie enlaza a las tres páginas", () => {
    const html = renderToStaticMarkup(<Footer />);
    for (const p of servicePageList) expect(html).toContain(`href="/${p.slug}"`);
  });

  it("cada página enlaza a las otras dos con «También podemos ayudarte con»", () => {
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
    expect(newPages).toHaveLength(1);
    for (const p of newPages) {
      const t = JSON.stringify(p);
      expect(t, p.slug).toMatch(/presencial o remota/i);
      expect(t, p.slug).toMatch(/Argentina y Uruguay/);
      expect(t, p.slug).not.toMatch(/Santa Fe|certificad|garantiz|resultados? (garantizados|asegurados)|\$|USD|precio de|\bhoras?\b/i);
      expect(t, p.slug).not.toMatch(/\d+\s?(%|años|clientes|empresas|personas|equipos)/i);
    }
  });

  it("la página de capacitación unifica las temáticas, organizadas por objetivo", () => {
    const [cap] = newPages;
    expect(cap.h1).toBe("Capacitación, talleres y desarrollo de equipos para empresas y PyMEs");
    expect(cap.topicGroups?.map((g) => g.title)).toEqual([
      "Desarrollar competencias",
      "Fortalecer vínculos",
      "Mejorar el funcionamiento del equipo",
    ]);
    expect(cap.topicGroups?.flatMap((g) => g.items)).toHaveLength(11);
    expect(cap.topicsCustom?.title).toBe("Capacitaciones y talleres a medida");
    expect(cap.ctaLabel).toBe("Quiero desarrollar a mi equipo");
    expect(cap.mailSubject).toBe("Consulta por capacitación, talleres y desarrollo de equipos");
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
  it("el Hero tiene un texto de apoyo breve y dos CTA iguales para las tres líneas", () => {
    const html = renderToStaticMarkup(<Hero />);
    const hero = text(html);
    expect(hero).toContain("Contratá mejor. Gestioná personas con criterio.");
    expect(hero).toContain(
      "Ayudamos a las empresas, en especial a las PyMEs, a incorporar talento, ordenar la gestión de personas y desarrollar a sus líderes y equipos. Soluciones a medida.",
    );
    expect(hero).not.toContain("Somos una consultora");
    const buttons = [...html.matchAll(/<a [^>]*class="[^"]*rounded-full[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    const ctas = buttons.map((m) => [text(m[2]).trim(), m[1]]).filter(([l]) => /Conversemos|Ver los servicios/.test(l));
    expect(ctas).toEqual([
      ["Conversemos sobre tu empresa", "#contacto-empresa"],
      ["Ver los servicios", "#empresas"],
    ]);
    expect(hero).not.toMatch(/Necesito incorporar talento|Quiero profesionalizar/);
  });

  it("las tarjetas de la Home tienen nombre, una frase y un único enlace, sin botones de contacto", () => {
    const html = renderToStaticMarkup(<Empresas />);
    const cards = html.match(/<article[\s\S]*?<\/article>/g) ?? [];
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card.match(/<a /g)).toHaveLength(1);
      expect(card).toContain("Ver el servicio");
      expect(card).not.toMatch(/mailto:|contacto-empresa|rounded-full border/);
      expect(card.match(/<p /g)).toHaveLength(1);
    }
    for (const p of servicePageList) expect(html).toContain(`href="/${p.slug}"`);
  });

  it("«Método de trabajo» aclara que es el método general y conserva los cuatro pasos", () => {
    const html = renderToStaticMarkup(<ComoTrabajamos />);
    const t = text(html);
    expect(t).toContain("método general de trabajo de People AG");
    expect(t).toContain("Cada servicio, además, tiene su propio proceso");
    expect(html.match(/<li /g)).toHaveLength(4);
    for (const n of ["01", "02", "03", "04"]) expect(t).toContain(n);
    expect(html).toContain("grid-rows-subgrid"); // pasos y resultados alineados
  });

  it("los procesos específicos de cada servicio se conservan en su página", () => {
    const rec = servicePageList.find((p) => p.serviceId === "reclutamiento")!;
    const con = servicePageList.find((p) => p.serviceId === "consultoria")!;
    expect(rec.steps).toHaveLength(7);
    expect(con.steps).toHaveLength(5);
    for (const p of newPages) expect(p.steps).toHaveLength(5);
  });

  it("«Sobre» muestra bio en dos párrafos y la formación en un bloque propio", () => {
    const html = renderToStaticMarkup(<Sobre />);
    expect(siteConfig.founder.bio).toHaveLength(2);
    expect(html).toContain('aria-labelledby="formacion-title"');
    expect(text(html)).toContain("Fundadora de People AG");
    expect(text(html)).toContain("Licenciatura en Relaciones del Trabajo (Universidad de Buenos Aires)");
    expect(text(html)).toContain("Formación en Change Management");
    expect(text(html)).not.toMatch(/Coaching|UCEMA|certificad/i);
  });

  it("el eyebrow de cada página de servicio no repite el comienzo del H1", () => {
    for (const p of servicePageList) {
      expect(p.h1.toLowerCase().startsWith(p.eyebrow.toLowerCase()), p.slug).toBe(false);
      expect(p.eyebrow.toLowerCase(), p.slug).not.toBe(p.name.toLowerCase());
    }
  });

  it("«Temáticas» se presenta como tarjetas con borde, sin relleno sombreado", () => {
    const html = renderToStaticMarkup(<ServicePageView page={newPages[0]} />);
    const block = html.slice(html.indexOf('aria-labelledby="tematicas-title"'));
    expect(block).toContain("border-l-sand bg-white");
    expect(block).toContain("Liderazgo y gestión de equipos");
  });

  it("el submenú marca la página activa y la flecha tiene área táctil de 44 px", () => {
    mockPath = "/capacitacion-talleres-y-desarrollo-de-equipos";
    const html = renderToStaticMarkup(<Header home={false} />);
    mockPath = null;
    const sub = html.match(/<ul id="submenu-servicios"[\s\S]*?<\/ul>/)?.[0] ?? "";
    expect(sub.match(/aria-current="page"/g)).toHaveLength(1);
    expect(sub).toMatch(/aria-current="page"[^>]*>Capacitación, talleres y desarrollo de equipos/);
    expect(html).toMatch(/aria-controls="submenu-servicios"[^>]*class="[^"]*h-11 w-11/);
  });
});

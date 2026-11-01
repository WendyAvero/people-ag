import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { servicePageList, servicePages } from "@/content/service-pages";
import { companyServices } from "@/content/services";
import { homeJsonLd, jsonLdString, serviceJsonLd } from "@/lib/structured-data";
import sitemap from "@/app/sitemap";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("dominio canónico", () => {
  it("en producción, sin variable, usa https://people-ag.com", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "people-ag.vercel.app");
    vi.resetModules();
    const { siteConfig } = await import("@/config/site");
    expect(siteConfig.url).toBe("https://people-ag.com");
  });

  it("NEXT_PUBLIC_SITE_URL tiene prioridad si es https", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.example.com/");
    vi.resetModules();
    const { siteConfig } = await import("@/config/site");
    expect(siteConfig.url).toBe("https://www.example.com");
  });

  it("mailto usa el único correo real y codifica el asunto", async () => {
    const { mailtoHref } = await import("@/config/site");
    expect(mailtoHref()).toBe("mailto:wendyavero@people-ag.com");
    expect(mailtoHref("Consulta de empresa")).toBe(
      "mailto:wendyavero@people-ag.com?subject=Consulta%20de%20empresa",
    );
  });
});

describe("páginas de servicio", () => {
  it("usan los slugs pedidos", () => {
    expect(servicePageList.map((p) => p.slug)).toEqual([
      "reclutamiento-y-seleccion-de-personal",
      "consultoria-estrategica-de-recursos-humanos",
    ]);
  });

  it("title y description tienen largo razonable y mencionan Argentina y Uruguay", () => {
    for (const p of servicePageList) {
      expect(`${p.metaTitle} | People AG`.length, p.slug).toBeLessThanOrEqual(60);
      expect(p.metaDescription.length, p.slug).toBeLessThanOrEqual(170);
      expect(p.metaDescription, p.slug).toMatch(/Argentina y Uruguay/);
    }
  });

  it("cada página corresponde a un servicio existente y conserva sus pasos", () => {
    for (const p of servicePageList) {
      const svc = companyServices.find((s) => s.id === p.serviceId);
      expect(svc, p.slug).toBeDefined();
      expect(p.steps).toHaveLength(svc!.items!.length);
    }
  });

  it("no afirman clientes, testimonios, certificaciones ni cifras", () => {
    const text = JSON.stringify(servicePages);
    expect(text).not.toMatch(/\b(ISO|certificad|testimonio|caso de éxito|clientes? satisfech)/i);
    expect(text).not.toMatch(/\d+\s?(%|años|clientes|empresas)/i);
  });
});

describe("metadata y palabras clave de la home", () => {
  // layout.tsx usa next/font, que no se puede importar en Vitest: se revisa el
  // código fuente y la configuración de la que sale el title.
  const layoutSource = readFileSync(
    join(process.cwd(), "src", "app", "layout.tsx"),
    "utf8",
  );

  it("el title de la home nombra 'Recursos Humanos' y no pasa de 60 caracteres", async () => {
    const { siteConfig } = await import("@/config/site");
    expect(layoutSource).toContain("`${siteConfig.tagline} | ${siteConfig.name}`");
    const title = `${siteConfig.tagline} | ${siteConfig.name}`;
    expect(title).toMatch(/Recursos Humanos/);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it("la description de la home menciona PyMEs, Argentina y Uruguay y cabe en el snippet", async () => {
    const { siteConfig } = await import("@/config/site");
    expect(siteConfig.description).toMatch(/PyMEs/);
    expect(siteConfig.description).toMatch(/Argentina y Uruguay/);
    expect(siteConfig.description.length).toBeLessThanOrEqual(170);
  });

  it("el canonical de la home lo define la home y el layout no lo impone a todas las páginas", async () => {
    const home = await import("@/app/page");
    expect(layoutSource).not.toMatch(/alternates\s*:/);
    expect(home.metadata.alternates?.canonical).toBe("/");
  });

  it("las páginas de servicio tienen preguntas frecuentes sin repetir y mencionan PyMEs", () => {
    for (const p of servicePageList) {
      const qs = p.faqs.map((f) => f.q);
      expect(new Set(qs).size, p.slug).toBe(qs.length);
      expect(qs.length, p.slug).toBeGreaterThanOrEqual(5);
      expect(JSON.stringify(p), p.slug).toMatch(/PyMEs?/);
    }
  });
});

describe("sitemap y datos estructurados", () => {
  it("el sitemap lista la home y las dos páginas de servicio, sin privacidad (borrador)", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toHaveLength(3);
    expect(urls.some((u) => u.endsWith("/reclutamiento-y-seleccion-de-personal"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/consultoria-estrategica-de-recursos-humanos"))).toBe(true);
    expect(urls.some((u) => u.includes("privacidad"))).toBe(false);
  });

  it("la home declara Argentina y Uruguay y los dos servicios", () => {
    const json = JSON.stringify(homeJsonLd());
    expect(json).toContain('"name":"Argentina"');
    expect(json).toContain('"name":"Uruguay"');
    expect(json).toContain("wendyavero@people-ag.com");
    expect(json.match(/"@type":"Service"/g)).toHaveLength(2);
    expect(json).not.toMatch(/aggregateRating|review|telephone|streetAddress/);
  });

  it("las páginas de servicio incluyen Service y BreadcrumbList", () => {
    for (const p of servicePageList) {
      const json = JSON.stringify(serviceJsonLd(p));
      expect(json).toContain('"@type":"Service"');
      expect(json).toContain('"@type":"BreadcrumbList"');
    }
  });

  it("jsonLdString no puede cerrar el script", () => {
    expect(jsonLdString({ a: "</script>" })).not.toContain("</script>");
  });
});

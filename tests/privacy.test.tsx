import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import PrivacidadPage, { metadata } from "@/app/privacidad/page";
import sitemap from "@/app/sitemap";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

vi.mock("@/components/layout/Logo", () => ({ Logo: () => null }));

const html = renderToStaticMarkup(<PrivacidadPage />);
const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("aviso de privacidad (borrador)", () => {
  it("sigue siendo borrador: banner visible, noindex y fuera del sitemap", () => {
    expect(siteConfig.privacyIsDraft).toBe(true);
    expect(text).toContain("BORRADOR");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(sitemap().some((e) => e.url.includes("privacidad"))).toBe(false);
  });

  it("identifica a Wendy Avero González y deja el domicilio pendiente de validación jurídica", () => {
    expect(text).toContain("Wendy Avero González");
    expect(text).toContain("persona humana");
    expect(text).toMatch(/COMPLETAR: domicilio, pendiente de validación jurídica/);
    expect(text).toContain("wendyavero@people-ag.com");
  });

  it("no publica CUIT ni domicilio y solo dice que no los pide", () => {
    expect(siteConfig.legal).not.toHaveProperty("taxId");
    expect(text).not.toMatch(/CUIT\s*\[|CUIT:|CUIL/);
    expect(text).toContain("No pedimos DNI, CUIT, domicilio, teléfono");
  });

  it("lista solo los cuatro datos del formulario y aclara que no es plataforma de empleo", () => {
    expect(text).toContain("nombre y apellido, correo electrónico, empresa (opcional)");
    expect(text).not.toMatch(/servicio de interés/i);
    expect(text).toContain("No es una plataforma de empleo y no recibimos postulaciones laborales");
  });

  it("usa la redacción aprobada sobre terceros y proveedores", () => {
    expect(text).toContain(
      "No comercializamos ni compartimos tus datos con terceros para sus propias finalidades. Los proveedores tecnológicos intervienen exclusivamente para prestar los servicios necesarios para gestionar tu consulta.",
    );
    expect(text).not.toMatch(/no vendemos ni cedemos/i);
  });

  it("no afirma de forma absoluta que no se guardan datos", () => {
    expect(text).toContain("no tiene una base de datos propia para guardar las consultas");
    expect(text).toContain("pueden existir registros técnicos en los proveedores");
    expect(text).not.toMatch(/no guarda(mos)? (los )?mensajes|no se guardan/i);
  });

  it("mantiene señalados los puntos legales pendientes", () => {
    for (const t of [
      "domicilio, pendiente de validación jurídica",
      "plazo concreto de conservación",
      "condiciones contractuales de Vercel y Resend",
      "transferencia internacional",
      "inscripción de bases de datos ante la AAIP",
      "normativa uruguaya",
      "base jurídica del tratamiento",
      "texto textual",
      "confirmar antes de publicar",
    ]) {
      expect(text, t).toContain(t);
    }
  });

  it("no describe newsletters, marketing ni perfiles como prácticas", () => {
    expect(text).toContain("No enviamos newsletters ni hacemos campañas de marketing automatizadas");
    expect(text).not.toMatch(/suscrib/i);
  });

  it("el pie ya no enlaza a una sección de información legal inexistente", async () => {
    const footer = renderToStaticMarkup(<Footer />);
    expect(footer).not.toContain("informacion-legal");
    expect(footer).toContain('href="/privacidad"');
    expect(html).not.toContain('id="informacion-legal"');
  });
});

describe("casilla de consentimiento", () => {
  it("se mantiene, sin premarcar, con el texto aprobado y el enlace al aviso", async () => {
    const { ContactForm } = await import("@/components/forms/ContactForm");
    const form = renderToStaticMarkup(<ContactForm audience="empresa" />);
    expect(form).toContain('name="consent"');
    expect(form).not.toMatch(/name="consent"[^>]*checked/);
    const t = form.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(t).toContain(
      "Acepto que People AG utilice mis datos para responder mi consulta y mantener conversaciones relacionadas con los servicios solicitados.",
    );
    expect(form).toContain('href="/privacidad"');
    expect(form).not.toContain('name="service"');
  });
});

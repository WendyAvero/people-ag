import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/forms/ContactForm";
import { Contacto } from "@/components/sections/Contacto";
import { siteConfig } from "@/config/site";

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

afterEach(() => vi.unstubAllEnvs());

describe("formulario comercial de Reclutamiento y selección", () => {
  const html = renderToStaticMarkup(<ContactForm audience="empresa" dryRun />);
  const t = plain(html);

  it("tiene exactamente los campos pedidos, con obligatorios y opcionales identificados", () => {
    for (const n of ["name", "company", "email", "phone", "position", "message", "consent"]) {
      expect(html, n).toContain(`name="${n}"`);
    }
    expect(t).toContain("Nombre y apellido");
    expect(t).toContain("Empresa");
    expect(t).toContain("Email laboral");
    expect(t).toContain("Teléfono (opcional)");
    expect(t).toContain("Perfil o posición a cubrir");
    expect(t).toContain("Comentarios adicionales (opcional)");
    // Obligatorios: nombre, empresa, email, perfil y consentimiento.
    expect(html.match(/aria-required="true"/g)).toHaveLength(5);
    expect(html).toContain('type="tel"');
    expect(html).toContain('type="email"');
  });

  it("el email laboral solo tiene ayuda: no bloquea dominios personales", () => {
    expect(t).toContain("Si podés, usá tu correo de la empresa. Cualquier correo de contacto sirve.");
  });

  it("la casilla de privacidad no viene marcada y el texto legal sigue pendiente de validación", () => {
    expect(html).not.toMatch(/name="consent"[^>]*checked/);
    expect(html).toContain('href="/privacidad"');
    expect(siteConfig.privacyIsDraft).toBe(true);
    expect(siteConfig.contactDeliveryEnabled).toBe(false);
  });

  it("tiene campo trampa oculto, botón de envío accesible y no usa servicios externos", () => {
    expect(html).toContain('name="website"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain("Enviar consulta");
    expect(html).not.toMatch(/recaptcha|hcaptcha|turnstile/i);
  });

  it("en modo de prueba avisa que no envía ni guarda datos; sin modo de prueba no lo muestra", () => {
    expect(t).toContain("Vista de prueba: este formulario no envía mensajes ni guarda datos.");
    const live = plain(renderToStaticMarkup(<ContactForm audience="empresa" />));
    expect(live).not.toContain("Vista de prueba");
  });

  it("sigue el estilo del sitio: recuadros blancos con borde, sin rellenos sombreados", () => {
    expect(html).not.toMatch(/bg-sand-light|bg-cream/);
  });
});

describe("sección de contacto según el entorno", () => {
  it("en producción se ofrece el correo y no hay formulario", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const out = renderToStaticMarkup(<Contacto />);
    expect(out).not.toContain("<form");
    expect(plain(out)).toContain("Escribinos por correo");
    expect(out).toContain("mailto:");
  });

  it("en Preview se muestra el formulario en modo de prueba, sin envío real", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const out = renderToStaticMarkup(<Contacto />);
    expect(out).toContain("<form");
    expect(out).toContain('id="contacto-empresa"');
    expect(plain(out)).toContain("Vista de prueba");
    expect(plain(out)).not.toContain("Escribinos por correo");
  });
});

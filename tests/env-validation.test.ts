import { describe, expect, it } from "vitest";

import { validateMailerEnv, validatePublicEnv } from "@/lib/env-validation.mjs";

const good = {
  RESEND_API_KEY: "re_abc123",
  CONTACT_TO_EMAIL: "inbox@example.com",
  CONTACT_FROM_EMAIL: "People AG <contacto@example.com>",
};

describe("validateMailerEnv", () => {
  it("acepta una configuración correcta", () => {
    const r = validateMailerEnv(good);
    expect(r.ok).toBe(true);
    expect(r.config?.apiUrl).toBe("https://api.resend.com/emails");
  });

  it("informa qué variables faltan sin revelar valores", () => {
    const r = validateMailerEnv({});
    expect(r.ok).toBe(false);
    expect(r.config).toBeNull();
    expect(r.problems.join(" ")).toContain("RESEND_API_KEY");
    expect(r.problems.join(" ")).toContain("CONTACT_TO_EMAIL");
    expect(r.problems.join(" ")).toContain("CONTACT_FROM_EMAIL");
  });

  it("rechaza formatos inválidos y no filtra la clave en los mensajes", () => {
    const r = validateMailerEnv({
      RESEND_API_KEY: "clave-secreta-sin-prefijo",
      CONTACT_TO_EMAIL: "no-es-correo",
      CONTACT_FROM_EMAIL: "tampoco",
    });
    expect(r.ok).toBe(false);
    expect(r.problems.join(" ")).not.toContain("clave-secreta-sin-prefijo");
  });

  it("rechaza varios destinatarios en CONTACT_TO_EMAIL", () => {
    expect(
      validateMailerEnv({ ...good, CONTACT_TO_EMAIL: "a@x.com,b@x.com" }).ok,
    ).toBe(false);
  });

  it("solo admite RESEND_API_URL hacia localhost", () => {
    expect(
      validateMailerEnv({ ...good, RESEND_API_URL: "http://localhost:4010/emails" })
        .config?.apiUrl,
    ).toBe("http://localhost:4010/emails");
    for (const url of [
      "https://evil.example/emails",
      "http://evil.example/emails",
      "http://localhost.evil.example/emails",
    ]) {
      expect(validateMailerEnv({ ...good, RESEND_API_URL: url }).ok, url).toBe(false);
    }
  });
});

describe("validatePublicEnv", () => {
  it("acepta valores vacíos con advertencia sobre la URL del sitio", () => {
    const r = validatePublicEnv({});
    expect(r.errors).toEqual([]);
    expect(r.warnings.join(" ")).toContain("NEXT_PUBLIC_SITE_URL");
  });

  it("valida URL del sitio, redes y dominio de analítica", () => {
    const r = validatePublicEnv({
      NEXT_PUBLIC_SITE_URL: "http://inseguro.com",
      NEXT_PUBLIC_LINKEDIN_URL: "https://example.com/in/x",
      NEXT_PUBLIC_INSTAGRAM_URL: "no-es-url",
      NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "https://con-protocolo.com",
    });
    expect(r.errors.length).toBe(4);
  });

  it("acepta valores correctos", () => {
    const r = validatePublicEnv({
      NEXT_PUBLIC_SITE_URL: "https://www.example.com",
      NEXT_PUBLIC_LINKEDIN_URL: "https://www.linkedin.com/company/people-ag",
      NEXT_PUBLIC_INSTAGRAM_URL: "https://www.instagram.com/peopleag",
    });
    expect(r.errors).toEqual([]);
  });
});

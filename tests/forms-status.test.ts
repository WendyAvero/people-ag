import { afterEach, describe, expect, it, vi } from "vitest";

import { isContactFormEnabled, isTestEnvironment } from "@/lib/forms-status";

afterEach(() => vi.unstubAllEnvs());

describe("isContactFormEnabled", () => {
  it("está apagado sin configuración de correo", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    expect(isContactFormEnabled()).toBe(false);
  });

  it("está apagado con configuración incompleta", () => {
    vi.stubEnv("RESEND_API_KEY", "re_abc");
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    expect(isContactFormEnabled()).toBe(false);
  });

  it("se enciende solo con las tres variables válidas", () => {
    vi.stubEnv("RESEND_API_KEY", "re_abc");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "People AG <contacto@example.com>");
    expect(isContactFormEnabled()).toBe(true);
  });

  it("en producción no se enciende mientras el aviso de privacidad sea borrador", () => {
    vi.stubEnv("RESEND_API_KEY", "re_abc");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "People AG <contacto@example.com>");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isContactFormEnabled()).toBe(false);
  });

  it("en preview sí se puede probar con el aviso en borrador", () => {
    vi.stubEnv("RESEND_API_KEY", "re_abc");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "People AG <contacto@example.com>");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isContactFormEnabled()).toBe(true);
  });
});

describe("fail-safe en producción", () => {
  it("si no se puede determinar el entorno en un build de producción, queda apagado", () => {
    vi.stubEnv("RESEND_API_KEY", "re_abc");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "People AG <contacto@example.com>");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    expect(isContactFormEnabled()).toBe(false);
  });
});

describe("isTestEnvironment", () => {
  it("es true en preview y desarrollo, false solo en producción", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isTestEnvironment()).toBe(true);
    vi.stubEnv("VERCEL_ENV", "");
    expect(isTestEnvironment()).toBe(true);
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isTestEnvironment()).toBe(false);
  });
});

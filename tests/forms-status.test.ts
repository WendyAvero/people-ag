import { afterEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/config/site";
import { getContactMode, isContactFormEnabled, isTestEnvironment } from "@/lib/forms-status";

const cfg = siteConfig as { contactDeliveryEnabled: boolean };

function mailerEnv() {
  vi.stubEnv("RESEND_API_KEY", "re_abc");
  vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "People AG <contacto@example.com>");
}

afterEach(() => {
  cfg.contactDeliveryEnabled = false;
  vi.unstubAllEnvs();
});

describe("getContactMode", () => {
  it("el envío real está apagado en site.ts por defecto y el aviso sigue en borrador", () => {
    expect(siteConfig.contactDeliveryEnabled).toBe(false);
    expect(siteConfig.privacyIsDraft).toBe(true);
  });

  it("en producción está apagado (se ofrece el correo), con o sin variables de correo", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(getContactMode()).toBe("off");
    mailerEnv();
    expect(getContactMode()).toBe("off");
    expect(isContactFormEnabled()).toBe(false);
  });

  it("en producción tampoco se enciende con el interruptor de site.ts mientras el aviso sea borrador", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    mailerEnv();
    cfg.contactDeliveryEnabled = true;
    expect(getContactMode()).toBe("off");
  });

  it("en Preview y desarrollo se muestra en modo de prueba, sin envío, aunque haya variables de correo", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(getContactMode()).toBe("dry-run");
    mailerEnv();
    expect(getContactMode()).toBe("dry-run");
    vi.stubEnv("VERCEL_ENV", "");
    expect(getContactMode()).toBe("dry-run");
    expect(isContactFormEnabled()).toBe(true);
  });

  it("el envío real solo existe con el interruptor de site.ts Y las tres variables válidas", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    cfg.contactDeliveryEnabled = true;
    expect(getContactMode()).toBe("dry-run");
    mailerEnv();
    expect(getContactMode()).toBe("live");
  });
});

describe("fail-safe en producción", () => {
  it("si no se puede determinar el entorno en un build de producción, queda apagado", () => {
    mailerEnv();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    expect(getContactMode()).toBe("off");
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

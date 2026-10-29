import { afterEach, describe, expect, it, vi } from "vitest";

import { isContactFormEnabled } from "@/lib/forms-status";

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
});

import { describe, expect, it } from "vitest";

import { validatePublicEnv } from "@/lib/env-validation.mjs";

describe("validatePublicEnv", () => {
  it("acepta valores vacíos con advertencia sobre la URL del sitio", () => {
    const r = validatePublicEnv({});
    expect(r.errors).toEqual([]);
    expect(r.warnings.join(" ")).toContain("NEXT_PUBLIC_SITE_URL");
  });

  it("valida URL del sitio y redes", () => {
    const r = validatePublicEnv({
      NEXT_PUBLIC_SITE_URL: "http://inseguro.com",
      NEXT_PUBLIC_LINKEDIN_URL: "https://example.com/in/x",
      NEXT_PUBLIC_INSTAGRAM_URL: "no-es-url",
    });
    expect(r.errors.length).toBe(3);
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

import { describe, expect, it } from "vitest";

import { serviceOptions } from "@/lib/contact-schema";
import { companyServices, processSteps } from "@/content/services";

describe("contenido de servicios", () => {
  it("cada CTA de servicio preselecciona una opción válida del formulario de empresas", () => {
    const valid = serviceOptions.empresa.map((o) => o.value);
    for (const s of companyServices) {
      expect(valid, s.id).toContain(s.cta.service);
    }
  });

  it("hay exactamente tres servicios principales para empresas", () => {
    expect(companyServices.map((s) => s.id)).toEqual([
      "reclutamiento",
      "consultoria",
      "acompanamiento",
    ]);
  });

  it("el método tiene cuatro pasos", () => {
    expect(processSteps).toHaveLength(4);
  });

  it("reclutamiento conserva el proceso completo de 7 pasos, del perfil a los finalistas", () => {
    const rec = companyServices.find((s) => s.id === "reclutamiento");
    expect(rec?.items).toHaveLength(7);
    expect(rec?.items?.[0]).toMatch(/perfil/i);
    expect(rec?.items?.[5]).toMatch(/finalistas/i);
  });

  it("consultoría se organiza en ordenar, profesionalizar y desarrollar", () => {
    const c = companyServices.find((s) => s.id === "consultoria");
    expect(c?.groups?.map((g) => g.label)).toEqual([
      "Ordenar",
      "Profesionalizar",
      "Desarrollar",
    ]);
  });
});

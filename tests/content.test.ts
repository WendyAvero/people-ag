import { describe, expect, it } from "vitest";

import { companyServices, processSteps } from "@/content/services";

describe("contenido de servicios", () => {
  it("hay exactamente dos servicios principales, sin el antiguo acompañamiento", () => {
    expect(companyServices.map((s) => s.id)).toEqual([
      "reclutamiento",
      "consultoria",
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

  it("consultoría estratégica integra los cinco ejes sin repetir ítems", () => {
    const c = companyServices.find((s) => s.id === "consultoria");
    expect(c?.title).toBe("Consultoría estratégica de Recursos Humanos");
    expect(c?.items).toHaveLength(5);
    expect(new Set(c?.items).size).toBe(5);
    expect(c?.items?.[0]).toMatch(/Diagnóstico organizacional/);
    expect(c?.items?.[4]).toMatch(/Seguimiento continuo/);
  });
});

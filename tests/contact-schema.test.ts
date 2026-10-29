import { describe, expect, it } from "vitest";

import { LIMITS, parsePayload, serviceOptions } from "@/lib/contact-schema";

const validCompany = {
  audience: "empresa",
  name: "Ana Pérez",
  company: "Acme SA",
  email: "Ana@Acme.com",
  service: "reclutamiento",
  message: "Necesitamos cubrir un puesto de analista.",
  consent: true,
};

describe("parsePayload", () => {
  it("acepta una consulta válida de empresa y normaliza el correo", () => {
    const { data, errors } = parsePayload(validCompany);
    expect(errors).toEqual({});
    expect(data?.email).toBe("ana@acme.com");
    expect(data?.company).toBe("Acme SA");
  });

  it("exige todos los campos y el consentimiento", () => {
    const { data, errors } = parsePayload({ audience: "empresa" });
    expect(data).toBeNull();
    expect(Object.keys(errors).sort()).toEqual(
      ["company", "consent", "email", "message", "name", "service"].sort(),
    );
  });

  it("rechaza consultas que no sean de empresa (ya no hay formulario de personas)", () => {
    const { data, errors } = parsePayload({
      audience: "persona",
      name: "Luis Gómez",
      email: "luis@mail.com",
      service: "cv",
      message: "Quiero mejorar mi CV, gracias.",
      consent: true,
    });
    expect(data).toBeNull();
    expect(errors.service).toBeTruthy();
  });

  it("solo ofrece los servicios de empresa en el formulario", () => {
    expect(serviceOptions.empresa.map((o) => o.value)).toEqual([
      "reclutamiento",
      "consultoria",
      "otro",
    ]);
  });

  it("rechaza consentimiento que no sea exactamente true", () => {
    for (const consent of [false, "true", "on", 1, undefined]) {
      const { data, errors } = parsePayload({ ...validCompany, consent });
      expect(data).toBeNull();
      expect(errors.consent).toBeTruthy();
    }
  });

  it("rechaza nombre sin apellido", () => {
    expect(parsePayload({ ...validCompany, name: "Luis" }).errors.name).toBeTruthy();
  });

  it("rechaza correos mal formados o con caracteres de encabezado", () => {
    for (const email of [
      "sin-arroba",
      "a@b",
      "a b@c.com",
      "a@c.com\nBcc: x@y.com",
      "a@c.com,b@d.com",
      "<a@c.com>",
    ]) {
      expect(parsePayload({ ...validCompany, email }).errors.email, email).toBeTruthy();
    }
  });

  it("rechaza servicios que no existen (incluidos los de empleabilidad, ya eliminados)", () => {
    for (const service of ["cv", "linkedin", "entrevistas", "empleabilidad-360", "acompanamiento"]) {
      expect(parsePayload({ ...validCompany, service }).errors.service).toBeTruthy();
    }
    expect(parsePayload({ ...validCompany, service: "reclutamiento" }).errors.service).toBeUndefined();
  });

  it("aplica los límites de largo del mensaje", () => {
    expect(
      parsePayload({ ...validCompany, message: "corto" }).errors.message,
    ).toBeTruthy();
    expect(
      parsePayload({ ...validCompany, message: "x".repeat(LIMITS.messageMax + 1) })
        .errors.message,
    ).toBeTruthy();
  });

  it("colapsa saltos de línea en nombre y empresa (evita inyección en encabezados)", () => {
    const { data } = parsePayload({
      ...validCompany,
      name: "Ana\r\nBcc: x@y.com Pérez",
      company: "Acme\nSA",
    });
    expect(data?.name).not.toMatch(/[\r\n]/);
    expect(data?.company).not.toMatch(/[\r\n]/);
  });

  it("ignora tipos inesperados sin lanzar excepciones", () => {
    for (const input of [null, undefined, 42, "texto", [], { audience: {} }]) {
      expect(() => parsePayload(input)).not.toThrow();
      expect(parsePayload(input).data).toBeNull();
    }
  });
});

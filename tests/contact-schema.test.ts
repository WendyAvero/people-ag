import { describe, expect, it } from "vitest";

import { LIMITS, parsePayload } from "@/lib/contact-schema";

const validCompany = {
  audience: "empresa",
  name: "Ana Pérez",
  company: "Acme SA",
  email: "Ana@Acme.com",
  phone: "",
  position: "Analista contable",
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
      ["company", "consent", "email", "name", "position"].sort(),
    );
  });

  it("rechaza consultas que no sean de empresa (ya no hay formulario de personas)", () => {
    const { data, errors } = parsePayload({
      audience: "persona",
      name: "Luis Gómez",
      email: "luis@mail.com",
      message: "Quiero mejorar mi CV, gracias.",
      consent: true,
    });
    expect(data).toBeNull();
    expect(errors.message).toBeTruthy();
  });

  it("la empresa es obligatoria y se valida su largo", () => {
    const base = { ...validCompany };
    expect(parsePayload({ ...base, company: "" }).errors.company).toBeTruthy();
    expect(parsePayload({ ...base, company: "A" }).errors.company).toBeTruthy();
    expect(parsePayload({ ...base, company: "x".repeat(121) }).errors.company).toBeTruthy();
  });

  it("elimina caracteres de control del mensaje", () => {
    const { data } = parsePayload({ ...validCompany, message: "Hola\u0000 necesitamos\u0007 ayuda" });
    expect(data?.message).toBe("Hola necesitamos ayuda");
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

  it("no pide ni conserva un servicio de interés", () => {
    const { data } = parsePayload({ ...validCompany, service: "reclutamiento" });
    expect(data).not.toBeNull();
    expect(data).not.toHaveProperty("service");
  });

  it("el perfil o posición es obligatorio y tiene límites de largo", () => {
    expect(parsePayload({ ...validCompany, position: "" }).errors.position).toBeTruthy();
    expect(parsePayload({ ...validCompany, position: "ab" }).errors.position).toBeTruthy();
    expect(
      parsePayload({ ...validCompany, position: "x".repeat(LIMITS.positionMax + 1) }).errors.position,
    ).toBeTruthy();
    expect(parsePayload({ ...validCompany, position: "Analista  contable" }).data?.position).toBe("Analista contable");
  });

  it("el teléfono es opcional; si se completa, acepta formatos habituales y rechaza letras", () => {
    expect(parsePayload({ ...validCompany, phone: "" }).data?.phone).toBe("");
    for (const phone of ["+54 11 5555-1234", "(011) 5555 1234", "1155551234", "+598 99 123 456"]) {
      expect(parsePayload({ ...validCompany, phone }).errors.phone, phone).toBeUndefined();
    }
    for (const phone of ["llamame", "123", "+54 11 abcd 1234", "1".repeat(31)]) {
      expect(parsePayload({ ...validCompany, phone }).errors.phone, phone).toBeTruthy();
    }
  });

  it("el email laboral solo se valida por formato: no se bloquean dominios personales", () => {
    for (const email of ["ana@gmail.com", "ana@hotmail.com", "ana@yahoo.com.ar"]) {
      expect(parsePayload({ ...validCompany, email }).errors.email, email).toBeUndefined();
    }
  });

  it("los comentarios son opcionales y solo se limita su largo", () => {
    expect(parsePayload({ ...validCompany, message: "" }).data?.message).toBe("");
    expect(parsePayload({ ...validCompany, message: "corto" }).errors.message).toBeUndefined();
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

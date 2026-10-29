import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/contact/route";
import { buildEmail } from "@/lib/mailer";

const valid = {
  audience: "empresa",
  name: "Ana Pérez",
  company: "Acme SA",
  email: "ana@acme.com",
  service: "reclutamiento",
  message: "Necesitamos cubrir un puesto de analista.",
  consent: true,
};

let ipCounter = 0;
/** Cada prueba usa una IP distinta para no compartir el límite de envíos. */
function req(body: unknown, init: { ip?: string; headers?: Record<string, string> } = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      "x-forwarded-for": init.ip ?? `10.0.0.${++ipCounter}`,
      ...init.headers,
    },
    body: raw,
  });
}

function configure() {
  vi.stubEnv("RESEND_API_KEY", "re_test_key_123");
  vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "People AG <contacto@example.com>");
}

let fetchMock: ReturnType<typeof vi.fn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  errorSpy.mockRestore();
});

describe("POST /api/contact", () => {
  it("no confirma envíos si el correo no está configurado (503) y no llama al proveedor", async () => {
    const res = await POST(req(valid));
    const json = await res.json();
    expect(res.status).toBe(503);
    expect(json.ok).toBe(false);
    expect(json.code).toBe("not_configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("no revela variables, claves ni datos personales en la respuesta ni en los logs", async () => {
    configure();
    fetchMock.mockResolvedValue(new Response("{}", { status: 401 }));
    const res = await POST(req(valid));
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain("re_test_key_123");
    expect(text).not.toContain("inbox@example.com");
    expect(text).not.toContain("ana@acme.com");
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain("re_test_key_123");
    expect(logged).not.toContain("ana@acme.com");
    expect(logged).not.toContain("Necesitamos cubrir");
  });

  it("devuelve 422 con errores por campo si la validación falla", async () => {
    configure();
    const res = await POST(req({ audience: "empresa" }));
    const json = await res.json();
    expect(res.status).toBe(422);
    expect(Object.keys(json.errors)).toContain("email");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("envía por Resend con el formato esperado y responde ok", async () => {
    configure();
    fetchMock.mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test_key_123");
    const sent = JSON.parse(init.body);
    expect(sent.to).toEqual(["inbox@example.com"]);
    expect(sent.reply_to).toBe("ana@acme.com");
    expect(sent.subject).not.toMatch(/[\r\n]/);
    expect(sent.text).toContain("Consentimiento");
  });

  it("si el proveedor falla, responde 502 y nunca ok:true", async () => {
    configure();
    for (const status of [400, 401, 422, 429, 500]) {
      fetchMock.mockResolvedValueOnce(new Response("{}", { status }));
      const res = await POST(req(valid));
      const json = await res.json();
      expect(res.status, String(status)).toBe(502);
      expect(json.ok).toBe(false);
    }
  });

  it("si falla la red, responde 502 sin exponer el error interno", async () => {
    configure();
    fetchMock.mockRejectedValue(new TypeError("fetch failed: ECONNREFUSED 10.1.2.3"));
    const res = await POST(req(valid));
    const text = JSON.stringify(await res.json());
    expect(res.status).toBe(502);
    expect(text).not.toContain("ECONNREFUSED");
  });

  it("descarta en silencio los envíos que completan el campo trampa", async () => {
    configure();
    const res = await POST(req({ ...valid, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("limita a 5 envíos por IP y devuelve 429 en el sexto", async () => {
    configure();
    fetchMock.mockImplementation(async () => new Response("{}", { status: 200 }));
    const ip = "203.0.113.50";
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      statuses.push((await POST(req(valid, { ip }))).status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("rechaza otro origen (403), content-type incorrecto (415), JSON roto (400) y cuerpos grandes (413)", async () => {
    configure();
    expect(
      (await POST(req(valid, { headers: { origin: "https://evil.example" } }))).status,
    ).toBe(403);
    expect(
      (await POST(req(valid, { headers: { "content-type": "text/plain" } }))).status,
    ).toBe(415);
    expect((await POST(req("{oops"))).status).toBe(400);
    expect(
      (await POST(req({ ...valid, message: "x".repeat(20_000) }))).status,
    ).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("acepta el mismo origen", async () => {
    configure();
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const res = await POST(
      req(valid, { headers: { origin: "http://localhost:3000" } }),
    );
    expect(res.status).toBe(200);
  });
});

describe("buildEmail", () => {
  it("es texto plano, incluye el registro de consentimiento y no deja saltos en el asunto", () => {
    const { subject, text } = buildEmail(
      {
        audience: "empresa",
        name: "Luis Gómez",
        company: "Acme SA",
        email: "luis@mail.com",
        service: "reclutamiento",
        message: "<script>alert(1)</script>",
        consent: true,
      },
      new Date("2026-10-26T18:00:00Z"),
    );
    expect(subject).not.toMatch(/[\r\n]/);
    expect(text).toContain("2026-10-26T18:00:00.000Z");
    expect(text).toContain("<script>alert(1)</script>"); // texto plano: no se interpreta
  });
});

import { NextResponse, type NextRequest } from "next/server";

import { parsePayload } from "@/lib/contact-schema";
import { getMailerConfig, sendContactEmail } from "@/lib/mailer";
import { isContactFormEnabled } from "@/lib/forms-status";
import { isRateLimited, markSent, wasRecentlySent } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 10_000;

type ApiError = {
  ok: false;
  code:
    | "bad_request"
    | "validation"
    | "rate_limited"
    | "not_configured"
    | "delivery_failed";
  message: string;
  errors?: Record<string, string>;
};

function fail(status: number, body: ApiError) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Rechaza envíos desde otros orígenes (CSRF básico para un endpoint público). */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // llamadas sin navegador (curl); igual pasan por el resto de controles
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return fail(403, {
      ok: false,
      code: "bad_request",
      message: "Solicitud no permitida.",
    });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, {
      ok: false,
      code: "bad_request",
      message: "Formato de solicitud no válido.",
    });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return fail(413, {
      ok: false,
      code: "bad_request",
      message: "El mensaje es demasiado largo.",
    });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return fail(413, {
      ok: false,
      code: "bad_request",
      message: "El mensaje es demasiado largo.",
    });
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return fail(400, {
      ok: false,
      code: "bad_request",
      message: "No pudimos leer la solicitud.",
    });
  }

  const { data, errors } = parsePayload(json);
  if (!data) {
    return fail(422, {
      ok: false,
      code: "validation",
      message: "Revisá los campos marcados.",
      errors,
    });
  }

  // Campo trampa: si un bot lo completa, descartamos en silencio (no se envía nada).
  if (data.website) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  // Mismo envío repetido (doble clic): ya se despachó, no se manda otro correo.
  const fingerprint = `${data.email}|${data.service}|${data.message}`;
  if (wasRecentlySent(fingerprint, Date.now())) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  if (isRateLimited(clientKey(request), Date.now())) {
    return fail(429, {
      ok: false,
      code: "rate_limited",
      message:
        "Recibimos varios envíos seguidos. Esperá unos minutos y volvé a intentarlo.",
    });
  }

  const config = isContactFormEnabled() ? getMailerConfig() : null;
  if (!config) {
    // Integración pendiente: nunca se confirma un envío que no ocurrió.
    // (El motivo, sin valores, ya quedó registrado por getMailerConfig.)
    return fail(503, {
      ok: false,
      code: "not_configured",
      message:
        "El formulario todavía no está habilitado y tu mensaje no fue enviado. Por favor, intentá más tarde.",
    });
  }

  try {
    const result = await sendContactEmail(config, data, new Date());
    if (!result.ok) {
      console.error(`[contact] El proveedor de correo respondió ${result.status}.`);
      return fail(502, {
        ok: false,
        code: "delivery_failed",
        message:
          "No pudimos enviar tu mensaje por un problema técnico. Probá de nuevo en unos minutos.",
      });
    }
  } catch (error) {
    // Solo el tipo de error: nunca el cuerpo de la solicitud ni datos personales.
    console.error(
      "[contact] Error de red al contactar al proveedor de correo:",
      error instanceof Error ? error.name : "desconocido",
    );
    return fail(502, {
      ok: false,
      code: "delivery_failed",
      message:
        "No pudimos enviar tu mensaje por un problema técnico. Probá de nuevo en unos minutos.",
    });
  }

  markSent(fingerprint, Date.now());

  // Éxito real: el proveedor aceptó el correo. No se guarda nada en el servidor.
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

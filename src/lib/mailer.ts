import "server-only";

import { createHash } from "node:crypto";

import { siteConfig } from "@/config/site";
import { serviceLabel, type ContactPayload } from "./contact-schema";
import { validateMailerEnv } from "./env-validation.mjs";

/**
 * Envío de correo mediante la API REST de Resend (https://resend.com).
 * Sin SDK, para no sumar dependencias. Las credenciales viven solo en el
 * servidor (variables sin prefijo NEXT_PUBLIC_).
 *
 * Variables requeridas: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.
 * Opcional (solo pruebas locales): RESEND_API_URL apuntando a localhost.
 * La validación de formato está en env-validation.mjs.
 */

export type MailerConfig = {
  apiKey: string;
  to: string;
  from: string;
  apiUrl: string;
};

let reported = false;

/** Devuelve la configuración válida o null (y registra qué falta, sin valores). */
export function getMailerConfig(): MailerConfig | null {
  const { config, problems } = validateMailerEnv(process.env);
  if (!config && !reported) {
    reported = true;
    console.error(
      `[contact] Envío deshabilitado por configuración: ${problems.join(" ")}`,
    );
  }
  return config;
}

/** Quita saltos de línea para evitar inyección en asuntos/encabezados. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}

export function buildEmail(data: ContactPayload, receivedAt: Date) {
  const service = serviceLabel(data.audience, data.service);

  const subject = oneLine(
    `[People AG] Nueva consulta de empresa: ${service}`,
  );

  const when = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(receivedAt);

  const lines = [
    "Tipo de consulta: Empresa",
    `Nombre y apellido: ${data.name}`,
    `Empresa: ${data.company || "(no indicada)"}`,
    `Correo: ${data.email}`,
    `Servicio de interés: ${service}`,
    "",
    "Mensaje:",
    data.message,
    "",
    "—",
    // Registro de consentimiento: queda en esta casilla, no en el sitio.
    `Consentimiento: la persona aceptó el aviso de privacidad (${
      siteConfig.privacyIsDraft ? "versión borrador" : "versión vigente"
    }) al enviar el formulario. Fecha y hora (Buenos Aires): ${when} (${receivedAt.toISOString()}).`,
    "Podés responder directamente a este correo.",
  ];

  // Solo texto plano: evita problemas de HTML/inyección de contenido.
  return { subject, text: lines.join("\n") };
}

/**
 * Clave de idempotencia para Resend: el mismo envío (mismos datos) repetido en
 * una ventana de 10 minutos no genera un segundo correo, aunque lo procese otra
 * instancia del servidor.
 */
export function idempotencyKey(data: ContactPayload, now: Date): string {
  const bucket = Math.floor(now.getTime() / (10 * 60 * 1000));
  const hash = createHash("sha256")
    .update(JSON.stringify([data.email, data.service, data.message, bucket]))
    .digest("hex");
  return `people-ag-contact-${hash.slice(0, 40)}`;
}

export async function sendContactEmail(
  config: MailerConfig,
  data: ContactPayload,
  receivedAt: Date,
): Promise<{ ok: true } | { ok: false; status: number }> {
  const { subject, text } = buildEmail(data, receivedAt);

  const res = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey(data, receivedAt),
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: data.email,
      subject,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) return { ok: false, status: res.status };
  return { ok: true };
}

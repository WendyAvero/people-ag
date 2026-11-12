import "server-only";

import { siteConfig } from "@/config/site";
import { validateMailerEnv } from "./env-validation.mjs";

/**
 * Modos del formulario de contacto:
 *  - "off":     no se muestra (se ofrece el correo). Es el modo de producción.
 *  - "dry-run": modo de prueba, solo en Preview/desarrollo. Valida y aplica el
 *               antispam, pero NO envía correos, NO llama a terceros y NO guarda datos.
 *  - "live":    envío real por correo. Requiere `contactDeliveryEnabled: true`
 *               en site.ts Y las tres variables de correo válidas; en producción,
 *               además, el aviso de privacidad ya no puede ser un borrador.
 *
 * Producción es "off" ante cualquier duda (por ejemplo, si VERCEL_ENV no
 * estuviera disponible en un build de producción). Se evalúa en el servidor:
 * en el build y en cada llamada a /api/contact.
 */
export type ContactMode = "off" | "dry-run" | "live";

export function getContactMode(): ContactMode {
  const env = process.env;
  const deliveryReady =
    siteConfig.contactDeliveryEnabled && validateMailerEnv(env).ok;
  const isPreviewOrDev =
    env.VERCEL_ENV === "preview" ||
    (env.VERCEL_ENV !== "production" && env.NODE_ENV !== "production");

  if (!isPreviewOrDev) {
    return deliveryReady && !siteConfig.privacyIsDraft ? "live" : "off";
  }
  return deliveryReady ? "live" : "dry-run";
}

/** true si el formulario se muestra (modo de prueba o envío real). */
export function isContactFormEnabled(): boolean {
  return getContactMode() !== "off";
}

/**
 * true en cualquier entorno que no sea producción (Preview de Vercel, desarrollo
 * o build local). Se usa para avisar que el formulario es de prueba.
 */
export function isTestEnvironment(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

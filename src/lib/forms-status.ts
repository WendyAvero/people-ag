import "server-only";

import { siteConfig } from "@/config/site";
import { validateMailerEnv } from "./env-validation.mjs";

/**
 * El formulario solo se ofrece si:
 *  1. el envío de correo está bien configurado (RESEND_API_KEY, CONTACT_TO_EMAIL,
 *     CONTACT_FROM_EMAIL), y
 *  2. en PRODUCCIÓN (o si no se puede determinar el entorno), el aviso de privacidad ya no es un borrador
 *     (`privacyIsDraft: false`, que a su vez exige los datos legales completos).
 *     Así nunca se pide un consentimiento que remita a un aviso incompleto.
 *     En previews y desarrollo se puede probar igual, con el aviso en borrador.
 *
 * Se evalúa en el servidor durante el build: al cambiar variables hay que volver
 * a desplegar. Es el mismo criterio que usa /api/contact para responder 503.
 */
export function isContactFormEnabled(): boolean {
  if (!validateMailerEnv(process.env).ok) return false;
  if (!siteConfig.privacyIsDraft) return true;
  // Con el aviso en borrador solo se habilita donde se sabe que NO es producción:
  // Preview de Vercel o desarrollo/pruebas locales. Ante la duda (por ejemplo, si
  // VERCEL_ENV no estuviera disponible en un build de producción), queda apagado.
  const env = process.env;
  if (env.VERCEL_ENV === "production") return false;
  return env.VERCEL_ENV === "preview" || env.NODE_ENV !== "production";
}

/**
 * true en cualquier entorno que no sea producción (Preview de Vercel, desarrollo
 * o build local). Se usa para avisar que el formulario es de prueba.
 */
export function isTestEnvironment(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

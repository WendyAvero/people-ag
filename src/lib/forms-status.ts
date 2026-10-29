import "server-only";

import { validateMailerEnv } from "./env-validation.mjs";

/**
 * El formulario solo se ofrece si el envío de correo está bien configurado
 * (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL). Se evalúa en el
 * servidor durante el build: al cambiar variables hay que volver a desplegar.
 * Es el mismo criterio que usa /api/contact para responder 503.
 */
export function isContactFormEnabled(): boolean {
  return validateMailerEnv(process.env).ok;
}

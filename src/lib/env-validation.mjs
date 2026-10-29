/**
 * Validación de variables de entorno.
 * Es JavaScript plano (con JSDoc) para poder usarse tanto desde la app como
 * desde `npm run check:env` sin compilar. Nunca devuelve valores de secretos:
 * solo nombres de variables y descripciones del problema.
 */

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
// "correo@dominio.com" o "Nombre <correo@dominio.com>"
const FROM = /^(?:[^<>\r\n@]{1,80}\s<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}>|[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,})$/;

/** @param {string | undefined} value */
const clean = (value) => (value ?? "").trim();

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ ok: boolean, problems: string[], config: { apiKey: string, to: string, from: string, apiUrl: string } | null }}
 */
export function validateMailerEnv(env) {
  /** @type {string[]} */
  const problems = [];
  const apiKey = clean(env.RESEND_API_KEY);
  const to = clean(env.CONTACT_TO_EMAIL);
  const from = clean(env.CONTACT_FROM_EMAIL);
  const apiUrlRaw = clean(env.RESEND_API_URL);

  if (!apiKey) problems.push("RESEND_API_KEY no está definida.");
  else if (!apiKey.startsWith("re_")) problems.push("RESEND_API_KEY no tiene el formato esperado (debería empezar con \"re_\").");

  if (!to) problems.push("CONTACT_TO_EMAIL no está definida.");
  else if (!EMAIL.test(to)) problems.push("CONTACT_TO_EMAIL no es un correo válido (se admite una sola dirección).");

  if (!from) problems.push("CONTACT_FROM_EMAIL no está definida.");
  else if (!FROM.test(from)) problems.push("CONTACT_FROM_EMAIL debe ser \"correo@dominio.com\" o \"Nombre <correo@dominio.com>\".");

  let apiUrl = "https://api.resend.com/emails";
  if (apiUrlRaw) {
    // Solo para pruebas locales: evita que la clave de API viaje a un host arbitrario.
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(apiUrlRaw)) apiUrl = apiUrlRaw;
    else problems.push("RESEND_API_URL solo se acepta apuntando a localhost (pruebas). Eliminá la variable en producción.");
  }

  const ok = problems.length === 0;
  return { ok, problems, config: ok ? { apiKey, to, from, apiUrl } : null };
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validatePublicEnv(env) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  const site = clean(env.NEXT_PUBLIC_SITE_URL);
  if (!site) warnings.push("NEXT_PUBLIC_SITE_URL no está definida: sitemap, canonical y Open Graph no tendrán el dominio final.");
  else if (!/^https:\/\/[^\s/]+\.[^\s/]+\/?$/.test(site)) errors.push("NEXT_PUBLIC_SITE_URL debe ser una URL https sin ruta (ej. https://www.tu-dominio.com).");

  for (const [name, host] of [
    ["NEXT_PUBLIC_LINKEDIN_URL", "linkedin.com"],
    ["NEXT_PUBLIC_INSTAGRAM_URL", "instagram.com"],
  ]) {
    const value = clean(env[name]);
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || !url.hostname.endsWith(host)) {
        errors.push(`${name} debe ser una URL https de ${host}.`);
      }
    } catch {
      errors.push(`${name} no es una URL válida.`);
    }
  }

  const domain = clean(env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
  if (domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
    errors.push("NEXT_PUBLIC_PLAUSIBLE_DOMAIN debe ser un dominio sin protocolo (ej. tu-dominio.com).");
  }
  if (domain) {
    warnings.push("Analítica activada: confirmá que el aviso de privacidad (sección 9) la describa.");
  }

  return { errors, warnings };
}

/**
 * Validación de variables de entorno públicas (sitio y redes).
 * Es JavaScript plano (con JSDoc) para poder usarse tanto desde la app como
 * desde `npm run check:env` sin compilar. Nunca devuelve valores de secretos:
 * solo nombres de variables y descripciones del problema.
 */

/** @param {string | undefined} value */
const clean = (value) => (value ?? "").trim();

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
  if (!site) warnings.push("NEXT_PUBLIC_SITE_URL no está definida: se usará https://people-ag.com como dominio canónico (sitemap, canonical y Open Graph).");
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

  return { errors, warnings };
}

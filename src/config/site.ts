/**
 * Configuración central del sitio.
 *
 * Todo lo que cambia entre entornos o que todavía no existe (redes sociales,
 * analítica, URL pública) se lee de variables de entorno y se omite de la UI
 * si no está configurado. No se inventan enlaces ni datos de contacto.
 *
 * Las variables NEXT_PUBLIC_* quedan embebidas en el build: no pongas secretos
 * en ellas.
 */

function cleanUrl(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return /^https:\/\/[^\s]+$/i.test(trimmed) ? trimmed.replace(/\/+$/, "") : null;
}

/**
 * URL pública: NEXT_PUBLIC_SITE_URL, o el dominio de producción que Vercel
 * expone automáticamente, o localhost solo en desarrollo.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
const siteUrl =
  cleanUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

// Evita publicar a producción con sitemap/canonical/OG apuntando a localhost.
if (process.env.VERCEL_ENV === "production" && siteUrl.startsWith("http://localhost")) {
  throw new Error(
    "Falta NEXT_PUBLIC_SITE_URL (https://tu-dominio.com) para el build de producción.",
  );
}

export const siteConfig = {
  name: "People AG",
  tagline: "Consultora de Recursos Humanos",
  description:
    "Consultoría estratégica de Recursos Humanos para empresas: reclutamiento y selección, diagnóstico, procesos y acompañamiento en la gestión de personas.",
  url: siteUrl,
  locale: "es_AR",

  /** Año que se muestra en el pie. Actualizalo al publicar. */
  copyrightYear: 2026,

  /** Enlaces a redes. Si la variable no está definida, el enlace no se muestra. */
  social: {
    linkedin: cleanUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    instagram: cleanUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },

  /**
   * Analítica opcional y sin cookies (Plausible). Solo se carga si se define
   * NEXT_PUBLIC_PLAUSIBLE_DOMAIN. Ver README antes de activarla.
   */
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() || null,
  },

  /**
   * Mientras sea true, la página /privacidad muestra el aviso de "borrador".
   * Pasalo a false únicamente después de la revisión jurídica.
   */
  privacyIsDraft: true,

  /**
   * Datos legales del responsable del tratamiento. Completar con datos REALES
   * y revisados por un profesional; no inventar.
   * - aaipLegend: texto textual exigido por la normativa de la AAIP (ver README).
   * Si privacyIsDraft pasa a false con alguno vacío, el build falla a propósito.
   */
  legal: {
    responsible: null as string | null,
    taxId: null as string | null,
    address: null as string | null,
    privacyEmail: null as string | null,
    aaipLegend: null as string | null,
  },

  /**
   * Presentación de la fundadora (sección "Sobre People AG").
   * Completá SOLO con información real y verificable. Con todo en null la
   * sección se muestra sin bloque personal. Alcanza con editar este objeto:
   *   name         nombre y apellido
   *   role         cargo, ej. "Fundadora y consultora de RR. HH."
   *   bio          párrafos breves (array de textos)
   *   credentials  datos verificables en lista corta (formación, trayectoria)
   *   photo        archivo dentro de /public, ej. "/fundadora.jpg" (opcional)
   *   photoAlt     texto alternativo de la foto
   */
  founder: {
    name: null as string | null,
    role: null as string | null,
    bio: null as string[] | null,
    credentials: null as string[] | null,
    /** Ruta dentro de /public, por ejemplo "/fundadora.jpg". */
    photo: null as string | null,
    photoAlt: null as string | null,
  },
} as const;

if (!siteConfig.privacyIsDraft) {
  const missing = Object.entries(siteConfig.legal)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(
      `privacyIsDraft es false pero faltan datos legales en site.ts: ${missing.join(", ")}.`,
    );
  }
}

export const navItems = [
  { label: "Inicio", href: "#inicio", id: "inicio" },
  { label: "Empresas", href: "#empresas", id: "empresas" },
  { label: "Sobre People AG", href: "#sobre", id: "sobre" },
  { label: "Contacto", href: "#contacto", id: "contacto" },
] as const;

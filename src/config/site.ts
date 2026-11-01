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
 * URL pública y canónica. Prioridad:
 *  1. NEXT_PUBLIC_SITE_URL (https), si está definida.
 *  2. https://people-ag.com en builds de producción: el dominio propio es el
 *     canónico aunque el sitio también responda en people-ag.vercel.app.
 *  3. localhost solo en desarrollo.
 */
const PRODUCTION_URL = "https://people-ag.com";
const siteUrl =
  cleanUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  (process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000");

export const siteConfig = {
  name: "People AG",
  tagline: "Selección de personal y consultoría de RR. HH.",
  description:
    "Selección de personal y consultoría estratégica de RR. HH. para empresas de Argentina y Uruguay: reclutamiento, diagnóstico, procesos y acompañamiento.",
  url: siteUrl,
  locale: "es_AR",

  /**
   * Correo de contacto (enlaces mailto, datos estructurados). Las consultas del formulario llegan a CONTACT_TO_EMAIL.
   * Es el único correo real del sitio; se usa vía enlace mailto:.
   */
  contactEmail: "wendyavero@people-ag.com",

  /** Países donde se ofrecen los servicios (también para datos estructurados). */
  areas: [
    { code: "AR", name: "Argentina" },
    { code: "UY", name: "Uruguay" },
  ],

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
    name: "Wendy Avero González" as string | null,
    role: "Licenciada en Relaciones del Trabajo · Universidad de Buenos Aires" as
      | string
      | null,
    bio: [
      "Soy profesional de Recursos Humanos y fundadora de People AG, una consultora orientada a acompañar a las empresas en sus desafíos de gestión de personas.",
      "Mi enfoque combina formación técnica, visión de negocio y una mirada integral de las organizaciones. Trabajo para que Recursos Humanos aporte soluciones concretas: desde incorporar a las personas adecuadas hasta profesionalizar procesos, fortalecer el liderazgo y acompañar decisiones estratégicas.",
      "Creo en una gestión de personas con criterio, cercana a la realidad de cada empresa y alineada con sus objetivos. Por eso, cada propuesta parte de comprender la necesidad, definir prioridades y construir soluciones que puedan implementarse y sostenerse en el tiempo.",
    ] as string[] | null,
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

/** Enlace mailto: al canal de contacto, con asunto opcional. */
export function mailtoHref(subject?: string): string {
  const base = `mailto:${siteConfig.contactEmail}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

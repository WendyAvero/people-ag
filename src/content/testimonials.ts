/**
 * Testimonios de la sección "La experiencia de trabajar con People AG" (Home).
 *
 * REGLAS
 * - Solo testimonios REALES, con autorización de la persona para publicarlos
 *   (y de la empresa, si se la nombra). Nada de ejemplos ni textos de relleno.
 * - Mientras no haya testimonios con `approved: true`, la sección NO se
 *   muestra en ningún entorno (ni Production, ni Preview, ni desarrollo).
 * - No hay campos de foto ni de logo a propósito: no se publican sin
 *   autorización específica.
 *
 * CÓMO CARGAR UNO
 * Agregá un objeto a la lista, con el texto tal como lo autorizó la persona:
 *
 *   {
 *     quote: "Texto autorizado, sin editar el sentido.",
 *     name: "Nombre y apellido",
 *     role: "Cargo",          // opcional: omitilo o dejalo en null
 *     company: "Empresa",     // opcional: omitilo o dejalo en null
 *     approved: true,         // true solo con la autorización en mano
 *   }
 *
 * Con `approved: false` se puede dejar un borrador cargado sin que se publique.
 * Para separar párrafos dentro de un testimonio, usá una línea en blanco.
 */

export type Testimonial = {
  /** Texto del testimonio, tal como lo autorizó la persona. */
  quote: string;
  /** Nombre y apellido (obligatorio). */
  name: string;
  /** Cargo. Opcional: si no corresponde, se omite sin dejar huecos. */
  role?: string | null;
  /** Empresa. Opcional: si no corresponde, se omite sin dejar huecos. */
  company?: string | null;
  /** Solo `true` si hay autorización para publicarlo. */
  approved: boolean;
};

/** Lista de testimonios. Vacía hasta contar con contenido real y autorizado. */
export const testimonials: Testimonial[] = [];

export type PublishedTestimonial = {
  paragraphs: string[];
  name: string;
  /** "Cargo, Empresa", solo con lo que exista; null si no hay ninguno. */
  attribution: string | null;
};

/** Testimonios listos para mostrar: aprobados y con texto y nombre. */
export function publishedTestimonials(
  list: readonly Testimonial[] = testimonials,
): PublishedTestimonial[] {
  return list.flatMap((t) => {
    const name = t.name?.trim();
    const paragraphs = (t.quote ?? "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (t.approved !== true || !name || paragraphs.length === 0) return [];
    const attribution =
      [t.role, t.company]
        .map((v) => v?.trim())
        .filter(Boolean)
        .join(", ") || null;
    return [{ paragraphs, name, attribution }];
  });
}

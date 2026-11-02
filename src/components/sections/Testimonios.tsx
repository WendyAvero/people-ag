import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  publishedTestimonials,
  type Testimonial,
} from "@/content/testimonials";

/**
 * "La experiencia de trabajar con People AG".
 *
 * Se alimenta solo de src/content/testimonials.ts. Sin testimonios aprobados
 * no se renderiza nada (ni el título), así que mientras la lista esté vacía la
 * sección no existe en el sitio. Sin fotos ni logos: solo texto.
 */
export function Testimonios({
  items,
}: {
  /** Solo para pruebas; en el sitio se usa la lista de testimonials.ts. */
  items?: readonly Testimonial[];
}) {
  const list = publishedTestimonials(items);
  if (list.length === 0) return null;

  const single = list.length === 1;
  const columns = single
    ? "max-w-3xl"
    : list.length === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-title"
      className="bg-sand-light py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          id="testimonios-title"
          eyebrow="Testimonios"
          title="La experiencia de trabajar con People AG"
          className="max-w-3xl!"
        />

        <ul className={`mt-14 grid items-stretch gap-6 lg:gap-8 ${columns}`}>
          {list.map((t) => (
            <li key={`${t.name}-${t.paragraphs[0].slice(0, 24)}`} className="flex">
              <figure className="flex w-full flex-col border border-ink/10 border-l-4 border-l-lavender-deep bg-white p-7 sm:p-9">
                <span
                  aria-hidden="true"
                  className="font-display text-5xl font-light leading-none text-lavender"
                >
                  “
                </span>
                <blockquote
                  className={`mt-3 flex-1 space-y-4 leading-relaxed text-ink/90 ${
                    single ? "text-lg sm:text-xl" : "text-[0.98rem]"
                  }`}
                >
                  {t.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </blockquote>
                <figcaption className="mt-7 border-t border-ink/10 pt-5">
                  <span className="block font-display text-base font-semibold">
                    {t.name}
                  </span>
                  {t.attribution ? (
                    <span className="mt-1 block text-sm text-muted">
                      {t.attribution}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { aboutPillars } from "@/content/services";

/**
 * Presentación de la fundadora, 100 % configurable desde
 * src/config/site.ts (objeto `founder`). Sin datos reales no se muestra
 * ningún bloque personal ni texto de relleno.
 */
export function Sobre() {
  const { founder } = siteConfig;
  const hasProfile = Boolean(founder.name);
  const hasPhoto = Boolean(founder.photo && founder.name);

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="bg-white py-20 sm:py-28"
    >
      <Container className="grid items-start gap-14 lg:grid-cols-12 lg:gap-12">
        <div className={hasPhoto ? "lg:col-span-7" : "lg:col-span-12"}>
          <SectionHeading
            id="sobre-title"
            eyebrow="Sobre People AG"
            title="Quién está detrás de la consultora"
            className="max-w-3xl!"
          >
            People AG es una consultora de Recursos Humanos con una mirada
            integral del negocio y de las personas. Detrás de la marca hay
            experiencia profesional en gestión de personas, selección,
            desarrollo y acompañamiento organizacional.
          </SectionHeading>

          {hasProfile ? (
            <div className="mt-10 max-w-2xl border-l-2 border-sand pl-6">
              <p className="font-display text-xl font-semibold">{founder.name}</p>
              {founder.role ? (
                <p className="mt-1 text-sm text-muted">{founder.role}</p>
              ) : null}
              {founder.bio?.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-ink/90">
                  {paragraph}
                </p>
              ))}
              {founder.credentials && founder.credentials.length > 0 ? (
                <ul className="mt-5 space-y-2 text-[0.95rem]">
                  {founder.credentials.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-sand"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <dl className="mt-12 grid gap-8 border-t border-ink/15 pt-10 sm:grid-cols-3">
            {aboutPillars.map((pillar) => (
              <div key={pillar.title}>
                <dt className="font-display text-base font-semibold">
                  {pillar.title}
                </dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {pillar.description}
                </dd>
              </div>
            ))}
          </dl>

        </div>

        {hasPhoto && founder.photo ? (
          <figure className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none lg:pl-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand-light">
              <Image
                src={founder.photo}
                alt={founder.photoAlt ?? `Retrato de ${founder.name}`}
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
              />
            </div>
          </figure>
        ) : null}
      </Container>
    </section>
  );
}

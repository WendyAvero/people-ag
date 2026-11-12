import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mailtoHref, siteConfig } from "@/config/site";
import { otherServicePages, type ServicePage } from "@/content/service-pages";
import { companyServices } from "@/content/services";
import { jsonLdString, serviceJsonLd } from "@/lib/structured-data";

/** Página de servicio indexable. Reutiliza los componentes y estilos del sitio. */
export function ServicePageView({ page }: { page: ServicePage }) {
  const others = otherServicePages(page.slug);
  const mail = mailtoHref(page.mailSubject);

  return (
    <>
      <Header home={false} />
      <main id="contenido">
        {/* Encabezado de la página: único H1 */}
        <section
          aria-labelledby="servicio-title"
          className="pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24"
        >
          <Container>
            <nav aria-label="Ruta de navegación" className="text-sm text-muted">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{page.name}</li>
              </ol>
            </nav>
            <div className="mt-8 max-w-3xl">
              <p className="eyebrow text-lavender-deep">{page.eyebrow}</p>
              <h1
                id="servicio-title"
                className="mt-5 text-4xl font-semibold sm:text-5xl lg:text-[3.4rem]"
              >
                {page.h1}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                {page.lead}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={mail}>
                  {page.ctaLabel}
                  <ArrowRight
                    aria-hidden="true"
                    width={16}
                    height={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-muted">
                Escribinos a{" "}
                <a
                  href={mail}
                  className="font-medium text-ink underline underline-offset-4"
                >
                  {siteConfig.contactEmail}
                </a>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* Cuándo conviene */}
        <section
          aria-labelledby="cuando-title"
          className="bg-white py-16 sm:py-24"
        >
          <Container>
            <SectionHeading
              id="cuando-title"
              eyebrow="Para quién es"
              title={page.whenTitle}
              className="max-w-3xl!"
            />
            <ul className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {page.when.map((item) => (
                <li
                  key={item}
                  className="border-t-2 border-sand pt-4 text-[0.95rem] leading-relaxed text-ink/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Temáticas (solo si la página las define) */}
        {page.topics && page.topicsTitle ? (
          <section
            aria-labelledby="tematicas-title"
            className="bg-cream py-16 sm:py-24"
          >
            <Container>
              <SectionHeading
                id="tematicas-title"
                eyebrow="Temáticas"
                title={page.topicsTitle}
                className="max-w-3xl!"
              />
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.topics.map((topic) => (
                  <li
                    key={topic}
                    className="border border-ink/10 border-l-4 border-l-sand bg-white px-5 py-5 font-display text-lg font-semibold leading-snug"
                  >
                    {topic.replace(/\.$/, "")}
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        {/* Pasos / ejes */}
        <section
          aria-labelledby="pasos-title"
          className="bg-sand-light py-16 sm:py-24"
        >
          <Container>
            <SectionHeading
              id="pasos-title"
              eyebrow="Alcance"
              title={page.stepsTitle}
              className="max-w-3xl!"
            >
              {page.stepsIntro}
            </SectionHeading>
            <ol className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {page.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 border-t border-ink/15 pt-5">
                  <span
                    aria-hidden="true"
                    className="w-7 shrink-0 font-display text-sm font-semibold tabular-nums text-sand-deep"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/85">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* Enfoque */}
        <section
          aria-labelledby="enfoque-title"
          className="bg-white py-16 sm:py-24"
        >
          <Container>
            <SectionHeading
              id="enfoque-title"
              eyebrow="Enfoque"
              title={page.approachTitle}
              className="max-w-3xl!"
            />
            <ul className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
              {page.approach.map((item) => (
                <li key={item.title} className="border-t-2 border-lavender pt-4">
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Preguntas frecuentes */}
        <section
          aria-labelledby="faq-title"
          className="bg-cream py-16 sm:py-24"
        >
          <Container>
            <SectionHeading
              id="faq-title"
              eyebrow="Preguntas frecuentes"
              title="Lo que suelen preguntarnos las empresas"
              className="max-w-3xl!"
            />
            <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {page.faqs.map((faq) => (
                <div key={faq.q} className="border-t border-ink/15 pt-5">
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Contacto */}
        <section
          aria-labelledby="cierre-title"
          className="bg-white py-16 sm:py-24"
        >
          <Container>
            <div className="max-w-2xl">
              <h2 id="cierre-title" className="text-2xl font-semibold sm:text-3xl">
                Conversemos sobre tu empresa
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Contanos qué necesitás. Te respondemos por correo para coordinar
                una primera conversación, sin compromiso.
              </p>
              <div className="mt-7">
                <ButtonLink href={mail}>{page.ctaLabel}</ButtonLink>
              </div>
              <p className="mt-4 text-sm text-muted">
                {siteConfig.contactEmail}
              </p>
            </div>
          </Container>
        </section>

        {/* Enlaces a las demás líneas de servicio */}
        <section
          aria-labelledby="tambien-title"
          className="bg-cream py-16 sm:py-24"
        >
          <Container>
            <h2 id="tambien-title" className="text-2xl font-semibold sm:text-3xl">
              También podemos ayudarte con
            </h2>
            <ul className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
              {others.map((other) => {
                const service = companyServices.find((c) => c.id === other.serviceId);
                return (
                  <li key={other.slug} className="border-t-2 border-lavender pt-4">
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      <Link
                        href={`/${other.slug}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {other.name}
                      </Link>
                    </h3>
                    {service ? (
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                        {service.short}
                      </p>
                    ) : null}
                    <Link
                      href={`/${other.slug}`}
                      className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold text-lavender-deep underline-offset-4 hover:underline"
                    >
                      Ver el servicio
                      <span className="sr-only">: {other.name}</span>
                      <ArrowRight aria-hidden="true" width={16} height={16} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(serviceJsonLd(page)) }}
      />
    </>
  );
}

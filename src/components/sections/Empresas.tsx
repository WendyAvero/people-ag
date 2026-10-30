import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { companyMoments, companyServices } from "@/content/services";
import { contactHref, servicePathById } from "@/lib/contact-link";

const [recruiting, ...others] = companyServices;

function ServiceLink({ id, label }: { id: "reclutamiento" | "consultoria"; label: string }) {
  return (
    <a
      href={servicePathById[id]}
      className="group mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-lavender-deep underline-offset-4 hover:underline"
    >
      {label}
      <ArrowRight
        size={16}
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5"
      />
    </a>
  );
}

export function Empresas() {
  return (
    <section
      id="empresas"
      aria-labelledby="empresas-title"
      className="bg-white py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <SectionHeading
          id="empresas-title"
          eyebrow="Servicios"
          title="Recursos Humanos con mirada estratégica de negocio"
          className="max-w-3xl!"
        >
          Consultoría estratégica de Recursos Humanos para organizaciones que
          necesitan incorporar talento, profesionalizar sus procesos o contar
          con respaldo especializado en la gestión de personas.
        </SectionHeading>

        <div className="mt-14">
          <h3 className="font-display text-base font-semibold">
            Cuándo conviene hablar con nosotros
          </h3>
          <ul className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-3">
            {companyMoments.map((moment) => (
              <li
                key={moment}
                className="border-t-2 border-sand pt-4 text-[0.95rem] leading-relaxed text-ink/90"
              >
                {moment}
              </li>
            ))}
          </ul>
        </div>

        {/* 01 — Reclutamiento y selección: servicio principal */}
        <article
          id={recruiting.id}
          aria-labelledby={`${recruiting.id}-title`}
          className="mt-20 bg-sand-light px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="eyebrow text-sand-deep">01 · Servicio principal</p>
              <h3
                id={`${recruiting.id}-title`}
                className="mt-4 text-3xl font-semibold sm:text-4xl"
              >
                {recruiting.title}
              </h3>
              <p className="mt-5 leading-relaxed text-ink/85">{recruiting.lead}</p>
              <ButtonLink
                href={contactHref("reclutamiento")}
                data-servicio={recruiting.cta.service}
                className="mt-8"
              >
                {recruiting.cta.label}
              </ButtonLink>
              <div>
                <ServiceLink
                  id="reclutamiento"
                  label="Ver reclutamiento y selección de personal"
                />
              </div>
            </div>

            <ol className="grid gap-x-10 md:grid-cols-2 lg:col-span-7">
              {recruiting.items?.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-4 border-t border-ink/15 py-4 text-[0.95rem] leading-snug"
                >
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 font-display text-sm font-semibold tabular-nums text-sand-deep"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        {/* 02 — Consultoría estratégica de Recursos Humanos */}
        <div className="mt-6">
          {others.map((service, index) => (
            <article
              key={service.id}
              id={service.id}
              aria-labelledby={`${service.id}-title`}
              className="grid gap-8 border-b border-ink/15 py-12 first:border-t lg:grid-cols-12 lg:gap-14"
            >
              <div className="lg:col-span-5">
                <p className="eyebrow text-sand-deep">
                  {String(index + 2).padStart(2, "0")}
                </p>
                <h3
                  id={`${service.id}-title`}
                  className="mt-4 text-2xl font-semibold sm:text-3xl"
                >
                  {service.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{service.lead}</p>
                <ButtonLink
                  href={contactHref("consultoria")}
                  data-servicio={service.cta.service}
                  variant="secondary"
                  className="mt-7"
                >
                  {service.cta.label}
                </ButtonLink>
                <div>
                  <ServiceLink
                    id="consultoria"
                    label="Ver consultoría estratégica de RR. HH."
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                {service.groups ? (
                  <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
                    {service.groups.map((group) => (
                      <div key={group.label} className="border-t-2 border-lavender pt-4">
                        <dt className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-lavender-deep">
                          {group.label}
                        </dt>
                        {group.items.map((item) => (
                          <dd
                            key={item}
                            className="mt-3 text-[0.95rem] leading-snug"
                          >
                            {item}
                          </dd>
                        ))}
                      </div>
                    ))}
                  </dl>
                ) : (
                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {service.items?.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[0.95rem] leading-snug"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-sand"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-6 border-l-2 border-sand pl-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-lg leading-snug text-ink">
            Cada trabajo se define en conjunto. No ofrecemos paquetes cerrados:
            armamos el alcance según lo que tu organización necesita.
          </p>
          <ButtonLink href={contactHref()} className="shrink-0">
            Conversemos sobre tu empresa
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

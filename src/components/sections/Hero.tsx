import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/icons";
import { companyServices } from "@/content/services";
import { contactHref, servicePathById } from "@/lib/contact-link";

const shortLabels: Record<string, string> = {
  reclutamiento: "Del perfil a los finalistas, con acompañamiento.",
  consultoria: "Ordenar, profesionalizar y desarrollar la gestión de personas.",
};

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow text-lavender-deep">
            Consultoría estratégica de Recursos Humanos para empresas
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.5rem] font-semibold leading-[1.05] sm:text-6xl lg:text-[4rem]"
          >
            Contratá mejor.{" "}
            <span className="block text-lavender-deep">
              Gestioná personas con criterio.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            Somos una consultora de Recursos Humanos que ayuda a empresas y
            PyMEs a incorporar talento, profesionalizar la gestión de personas y
            tomar mejores decisiones de RR. HH., con soluciones alineadas a sus
            objetivos y necesidades de negocio.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={contactHref("reclutamiento")}
            >
              Necesito incorporar talento
            </ButtonLink>
            <ButtonLink
              href={contactHref("consultoria")}
              variant="secondary"
            >
              Quiero profesionalizar RR. HH.
            </ButtonLink>
          </div>
        </div>

        {/* Composición editorial: índice de soluciones para empresas */}
        <div className="lg:col-span-5">
          <div className="lg:relative lg:h-[31rem]">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 hidden h-[64%] w-[78%] bg-sand lg:block"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 hidden h-[46%] w-[58%] bg-lavender lg:block"
            />

            <nav
              aria-label="Soluciones para empresas"
              className="border border-ink/10 bg-white p-6 shadow-soft sm:p-8 lg:absolute lg:left-4 lg:right-6 lg:top-12"
            >
              <p className="eyebrow text-lavender-deep">
                Soluciones para empresas
              </p>
              <ol className="mt-4">
                {companyServices.map((service, index) => (
                  <li
                    key={service.id}
                    className="border-t border-ink/10 first:border-t-0"
                  >
                    <a
                      href={servicePathById[service.id]}
                      className="group flex items-start gap-4 py-4"
                    >
                      <span
                        aria-hidden="true"
                        className="pt-0.5 font-display text-sm font-semibold tracking-widest text-sand-deep"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="block font-display text-base font-semibold leading-snug text-ink">
                          {service.title}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-muted">
                          {shortLabels[service.id]}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-ink transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </Container>
    </section>
  );
}

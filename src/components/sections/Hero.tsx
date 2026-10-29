import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/icons";
import { companyServices } from "@/content/services";

const shortLabels: Record<string, string> = {
  reclutamiento: "Del perfil a los finalistas, con acompañamiento.",
  consultoria: "Ordenar, profesionalizar y desarrollar la gestión de personas.",
  acompanamiento: "Respaldo especializado según las prioridades del negocio.",
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
            Consultora boutique de RR. HH. para empresas
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.5rem] font-semibold leading-[1.05] sm:text-6xl lg:text-[4rem]"
          >
            Contratá mejor.
            <span className="block text-lavender-deep">
              Gestioná personas con criterio.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            Ayudamos a dueños, directores y gerentes a incorporar a las personas
            adecuadas y a ordenar, profesionalizar y desarrollar la gestión de
            Recursos Humanos, con una mirada estratégica del negocio y
            soluciones a la medida de cada organización.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#contacto-empresa" data-servicio="reclutamiento">
              Necesito incorporar talento
            </ButtonLink>
            <ButtonLink
              href="#contacto-empresa"
              data-servicio="consultoria"
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
                      href={`#${service.id}`}
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

import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { companyMoments, companyServices } from "@/content/services";
import { contactHref } from "@/lib/contact-link";

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
          Soluciones de Recursos Humanos y Desarrollo Organizacional para
          empresas que necesitan incorporar talento, ordenar su gestión,
          desarrollar a sus líderes o fortalecer sus equipos.
        </SectionHeading>

        <div className="mt-14">
          <h3 className="font-display text-base font-semibold">
            Cuándo conviene hablar con nosotros
          </h3>
          <ul className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Las tres líneas de servicio, con el mismo peso */}
        <div className="mt-20 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {companyServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
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

import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { companyServices } from "@/content/services";
import { contactHref } from "@/lib/contact-link";

export function Empresas() {
  return (
    <section
      id="empresas"
      aria-labelledby="empresas-title"
      className="bg-white py-16 sm:py-20 lg:py-24"
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

        {/* Las tres líneas de servicio, con el mismo peso y filas alineadas */}
        <div className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] lg:grid-cols-3 lg:gap-x-6 lg:gap-y-0">
          {companyServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-6 border-l-2 border-sand pl-6 sm:flex-row sm:items-center sm:justify-between">
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

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { mailtoHref, siteConfig } from "@/config/site";

export function Contacto() {
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="bg-cream py-20 sm:py-28"
    >
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="scroll-mt-28 lg:col-span-5">
          <SectionHeading
            id="contacto-title"
            eyebrow="Contacto"
            title="Contanos qué necesita tu empresa"
          >
            No hace falta tener todo definido: la primera conversación sirve
            justamente para eso. Te respondemos para coordinar una primera
            reunión.
          </SectionHeading>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-ink/10 border-l-4 border-l-lavender-deep bg-white p-6 sm:p-9">
            <h3 className="font-display text-lg font-semibold">
              Escribinos por correo
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              Podés contarnos qué necesita tu empresa por correo electrónico y
              te respondemos para coordinar una primera conversación.
            </p>
            <p className="mt-5 font-display text-lg font-semibold break-all">
              <a
                href={mailtoHref("Consulta de empresa")}
                className="underline underline-offset-4 hover:text-lavender-deep"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
            <ButtonLink href={mailtoHref("Consulta de empresa")} className="mt-6">
              Enviar un correo
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

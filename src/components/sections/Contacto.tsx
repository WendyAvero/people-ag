import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactPanel } from "@/components/forms/ContactPanel";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { mailtoHref, siteConfig } from "@/config/site";
import { isContactFormEnabled, isTestEnvironment } from "@/lib/forms-status";

const nextSteps = [
  "Leemos tu consulta con atención.",
  "Te respondemos por correo para coordinar una primera conversación.",
  "Si hay un buen encaje, definimos juntos cómo trabajar.",
];

/**
 * Se muestra mientras el envío de correo no esté configurado: no se piden
 * datos personales que no se podrían recibir.
 */
function ContactUnavailable() {
  return (
    <div className="border border-ink/10 border-l-4 border-l-lavender-deep bg-white p-6 sm:p-9">
      <h3 className="font-display text-lg font-semibold">
        Escribinos por correo
      </h3>
      <p className="mt-3 leading-relaxed text-muted">
        El formulario de consultas todavía no está habilitado. Mientras tanto,
        podés contarnos qué necesita tu empresa por correo y te respondemos
        para coordinar una primera conversación.
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
  );
}

export function Contacto() {
  const formEnabled = isContactFormEnabled();
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="bg-cream py-20 sm:py-28"
    >
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/*
          Con el formulario apagado, los botones "#contacto-empresa" llevan al
          inicio de esta columna (título + aviso), que siempre se puede ubicar
          arriba de la pantalla. Con el formulario activo, llevan al formulario.
        */}
        <div
          id={formEnabled ? undefined : "contacto-empresa"}
          className="scroll-mt-28 lg:col-span-5"
        >
          <SectionHeading
            id="contacto-title"
            eyebrow="Contacto"
            title="Contanos qué necesita tu empresa"
          >
            No hace falta tener todo definido: la primera conversación sirve
            justamente para eso. Te respondemos para coordinar una primera
            reunión.
          </SectionHeading>

          {formEnabled ? (
            <>
          <h3 className="mt-12 font-display text-base font-semibold">
            Qué pasa después de escribirnos
          </h3>
          <ol className="mt-5 space-y-4">
            {nextSteps.map((step, index) => (
              <li key={step} className="flex gap-4 text-[0.95rem] leading-snug">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand font-display text-xs font-semibold text-ink"
                >
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
            </>
          ) : null}
        </div>

        <div className="lg:col-span-7">
          {formEnabled ? <ContactPanel testMode={isTestEnvironment()} /> : <ContactUnavailable />}
        </div>
      </Container>
    </section>
  );
}

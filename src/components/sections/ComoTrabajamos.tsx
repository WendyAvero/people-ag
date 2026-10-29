import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/services";

export function ComoTrabajamos() {
  return (
    <section
      id="metodo"
      aria-labelledby="metodo-title"
      className="bg-lavender-deep py-20 text-cream sm:py-28"
    >
      <Container>
        <SectionHeading
          id="metodo-title"
          eyebrow="Cómo trabajamos"
          title="Un método con estructura, adaptado a cada organización"
          tone="light"
        >
          Antes de proponer una solución, entendemos el problema. Estos cuatro
          pasos ordenan cada proyecto y dejan claro qué se hace, en qué orden y
          con qué criterio.
        </SectionHeading>

        <ol className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <li key={step.title} className="relative border-t border-cream/30 pt-6">
              <span
                aria-hidden="true"
                className="font-display text-5xl font-light text-sand"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-semibold leading-snug">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/80">
                {step.description}
              </p>
              <p className="mt-4 border-t border-cream/20 pt-3 text-sm font-medium text-sand-light">
                <span className="eyebrow mr-2 text-cream/70">Resultado</span>
                {step.outcome}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <ButtonLink href="#contacto-empresa" variant="accent">
            Conversemos sobre tu empresa
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

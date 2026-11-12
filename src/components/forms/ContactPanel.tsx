import { ContactForm } from "./ContactForm";

/** Panel del formulario de contacto (solo empresas). */
export function ContactPanel({ dryRun = false }: { dryRun?: boolean }) {
  return (
    <div
      id="contacto-empresa"
      className="scroll-mt-28 border border-ink/10 bg-white p-6 shadow-soft sm:p-9"
    >
      <ContactForm audience="empresa" dryRun={dryRun} />
    </div>
  );
}

import { ContactForm } from "./ContactForm";

/** Panel del formulario de contacto (solo empresas). */
export function ContactPanel({ testMode = false }: { testMode?: boolean }) {
  return (
    <div
      id="contacto-empresa"
      className="scroll-mt-28 border border-ink/10 bg-white p-6 shadow-soft sm:p-9"
    >
      <ContactForm audience="empresa" testMode={testMode} />
    </div>
  );
}

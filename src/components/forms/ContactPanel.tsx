"use client";

import { useEffect, useState } from "react";

import { ContactForm } from "./ContactForm";

/**
 * Panel del formulario de contacto (solo empresas).
 * Los botones "#contacto-empresa" repartidos por la página llevan hasta acá y,
 * si traen `data-servicio`, preseleccionan ese servicio en el formulario.
 */
export function ContactPanel({ testMode = false }: { testMode?: boolean }) {
  // Servicio sugerido por el botón que se tocó (ej. "Necesito incorporar talento").
  const [preset, setPreset] = useState<{ service: string; nonce: number } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href="#contacto-empresa"]',
      );
      const service = link?.dataset.servicio;
      if (service) setPreset({ service, nonce: Date.now() });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      id="contacto-empresa"
      className="scroll-mt-28 border border-ink/10 bg-white p-6 shadow-soft sm:p-9"
    >
      <ContactForm audience="empresa" preset={preset} testMode={testMode} />
    </div>
  );
}

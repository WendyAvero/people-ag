import { mailtoHref } from "@/config/site";
import { servicePages, servicePathById } from "@/content/service-pages";
import { isContactFormEnabled } from "@/lib/forms-status";

/**
 * Destino de los botones de contacto de la home.
 * - Con el formulario habilitado: ancla al formulario (comportamiento actual).
 * - Sin formulario: correo de contacto, con el asunto del servicio.
 */
export function contactHref(serviceId?: "reclutamiento" | "consultoria"): string {
  if (isContactFormEnabled()) return "#contacto-empresa";
  const subject = serviceId
    ? Object.values(servicePages).find((p) => p.serviceId === serviceId)?.mailSubject
    : "Consulta de empresa";
  return mailtoHref(subject ?? "Consulta de empresa");
}

export { servicePathById };

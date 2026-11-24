import { mailtoHref } from "@/config/site";
import { servicePages, servicePathById, type ServicePage } from "@/content/service-pages";

/**
 * Destino de los botones de contacto: siempre el correo electrónico (mailto:),
 * con el asunto del servicio cuando corresponde.
 */
export function contactHref(serviceId?: ServicePage["serviceId"]): string {
  const subject = serviceId
    ? Object.values(servicePages).find((p) => p.serviceId === serviceId)?.mailSubject
    : "Consulta de empresa";
  return mailtoHref(subject ?? "Consulta de empresa");
}

export { servicePathById };

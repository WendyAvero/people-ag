import { ArrowRight } from "@/components/ui/icons";
import type { CompanyService } from "@/content/services";
import { servicePathById } from "@/lib/contact-link";

/**
 * Tarjeta de una línea de servicio en la home: nombre, una frase y un único
 * enlace a su página. Las cuatro usan el mismo diseño y el mismo peso: ninguna
 * se presenta como principal.
 */
export function ServiceCard({ service }: { service: CompanyService }) {
  return (
    <article
      id={service.id}
      aria-labelledby={`${service.id}-title`}
      className="flex flex-col border-t-2 border-sand pt-6"
    >
      <h3
        id={`${service.id}-title`}
        className="text-xl font-semibold leading-snug sm:text-2xl lg:text-xl xl:text-2xl"
      >
        {service.title}
      </h3>
      <p className="mt-3 leading-relaxed text-muted">{service.short}</p>
      <a
        href={servicePathById[service.id]}
        className="group mt-auto inline-flex items-center gap-2 pt-6 font-display text-sm font-semibold text-lavender-deep underline-offset-4 hover:underline"
      >
        Ver el servicio
        <span className="sr-only">: {service.title}</span>
        <ArrowRight
          size={16}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </a>
    </article>
  );
}

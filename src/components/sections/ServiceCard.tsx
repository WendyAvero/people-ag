import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/icons";
import type { CompanyService } from "@/content/services";
import { contactHref, servicePathById } from "@/lib/contact-link";

/**
 * Tarjeta de una línea de servicio en la home. Las cuatro líneas usan la misma
 * tarjeta y el mismo peso visual: ninguna se presenta como principal.
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
        className="text-2xl font-semibold sm:text-[1.65rem]"
      >
        {service.title}
      </h3>
      <p className="mt-4 leading-relaxed text-muted">{service.lead}</p>
      <div className="mt-auto pt-7">
        <ButtonLink href={contactHref(service.id)} variant="secondary">
          {service.cta.label}
        </ButtonLink>
        <div>
          <a
            href={servicePathById[service.id]}
            className="group mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-lavender-deep underline-offset-4 hover:underline"
          >
            Ver el servicio
            <span className="sr-only">: {service.title}</span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </article>
  );
}

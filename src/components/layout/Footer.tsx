import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

const serviceLinks = [
  { label: "Reclutamiento y selección", href: "/#reclutamiento" },
  { label: "Consultoría estratégica de RR. HH.", href: "/#consultoria" },
  { label: "Cómo trabajamos", href: "/#metodo" },
];

const contactLinks = [
  { label: "Consultas de empresas", href: "/#contacto-empresa" },
];

const linkClass =
  "inline-block rounded-sm py-1.5 text-cream/80 transition-colors hover:text-cream focus-visible:outline-cream";

export function Footer() {
  const { linkedin, instagram } = siteConfig.social;

  return (
    <footer className="bg-ink text-cream">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="h-20" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/75">
              {siteConfig.tagline} para empresas, con atención personalizada y
              una mirada estratégica del negocio.
            </p>

            {linkedin || instagram ? (
              <ul className="mt-6 flex items-center gap-3" aria-label="Redes sociales">
                {linkedin ? (
                  <li>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="People AG en LinkedIn (se abre en una pestaña nueva)"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink focus-visible:outline-cream"
                    >
                      <LinkedInIcon width={18} height={18} />
                    </a>
                  </li>
                ) : null}
                {instagram ? (
                  <li>
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="People AG en Instagram (se abre en una pestaña nueva)"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink focus-visible:outline-cream"
                    >
                      <InstagramIcon width={19} height={19} />
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Servicios" className="md:col-span-3">
            <h2 className="eyebrow text-sand">Servicios</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Contacto" className="md:col-span-4">
            <h2 className="eyebrow text-sand">Contacto</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {contactLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/20 pt-6 text-xs text-cream/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name}. Todos los derechos
            reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacidad" className={linkClass}>
                Aviso de privacidad
              </Link>
            </li>
            <li>
              <Link href="/privacidad#informacion-legal" className={linkClass}>
                Información legal
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

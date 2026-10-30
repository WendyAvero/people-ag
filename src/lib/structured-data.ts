import { siteConfig } from "@/config/site";
import { servicePageList, type ServicePage } from "@/content/service-pages";

/**
 * Datos estructurados (Schema.org). Solo se incluye información real y
 * verificable: sin reseñas, calificaciones, dirección, teléfono ni redes que
 * no estén cargadas.
 */

const orgId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;
const founderId = `${siteConfig.url}/#fundadora`;

const areaServed = siteConfig.areas.map((a) => ({
  "@type": "Country",
  name: a.name,
}));

export function pageUrl(slug: string) {
  return `${siteConfig.url}/${slug}`;
}

function serviceNode(page: ServicePage) {
  return {
    "@type": "Service",
    "@id": `${pageUrl(page.slug)}#service`,
    name: page.name,
    description: page.metaDescription,
    url: pageUrl(page.slug),
    serviceType: page.name,
    provider: { "@id": orgId },
    areaServed,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dueños, directores y gerentes de empresas",
    },
  };
}

const sameAs = [siteConfig.social.linkedin, siteConfig.social.instagram].filter(
  Boolean,
);

function organizationNode() {
  const founder = siteConfig.founder;
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo-people-ag.png`,
    image: `${siteConfig.url}/logo-people-ag.png`,
    email: siteConfig.contactEmail,
    areaServed,
    knowsLanguage: "es",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "consultas comerciales",
      email: siteConfig.contactEmail,
      areaServed: siteConfig.areas.map((a) => a.code),
      availableLanguage: "Spanish",
    },
    makesOffer: servicePageList.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@id": `${pageUrl(p.slug)}#service` },
    })),
    ...(founder.name ? { founder: { "@id": founderId } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

function founderNode() {
  const f = siteConfig.founder;
  if (!f.name) return null;
  return {
    "@type": "Person",
    "@id": founderId,
    name: f.name,
    jobTitle: "Fundadora de People AG",
    worksFor: { "@id": orgId },
  };
}

/** Grafo de la home: organización, sitio, fundadora y los dos servicios. */
export function homeJsonLd() {
  const founder = founderNode();
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: "es",
        publisher: { "@id": orgId },
      },
      ...(founder ? [founder] : []),
      ...servicePageList.map(serviceNode),
    ],
  };
}

/** Grafo de una página de servicio: el servicio y sus migas de pan. */
export function serviceJsonLd(page: ServicePage) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...serviceNode(page),
        mainEntityOfPage: pageUrl(page.slug),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteConfig.url}/` },
          { "@type": "ListItem", position: 2, name: page.name, item: pageUrl(page.slug) },
        ],
      },
    ],
  };
}

/** Escapa "<" para que el JSON nunca pueda cerrar el <script>. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

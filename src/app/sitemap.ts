import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { servicePageList } from "@/content/service-pages";

// Sin <lastmod>: no se inventan fechas de modificación.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "monthly", priority: 1 },
    ...servicePageList.map((p) => ({
      url: `${siteConfig.url}/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];

  // La política de privacidad solo entra al sitemap cuando deja de ser borrador.
  if (!siteConfig.privacyIsDraft) {
    routes.push({
      url: `${siteConfig.url}/privacidad`,
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }
  return routes;
}

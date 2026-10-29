import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "monthly", priority: 1 },
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

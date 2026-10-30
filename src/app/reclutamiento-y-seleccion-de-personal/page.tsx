import type { Metadata } from "next";

import { ServicePageView } from "@/components/sections/ServicePageView";
import { siteConfig } from "@/config/site";
import { servicePages } from "@/content/service-pages";

const page = servicePages["reclutamiento-y-seleccion-de-personal"];
const path = `/${page.slug}`;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    url: path,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${page.metaTitle} | ${siteConfig.name}`,
    description: page.metaDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${page.name} | ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${page.metaTitle} | ${siteConfig.name}`,
    description: page.metaDescription,
    images: ["/opengraph-image"],
  },
};

export default function Page() {
  return <ServicePageView page={page} />;
}

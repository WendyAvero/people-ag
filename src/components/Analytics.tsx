import Script from "next/script";

import { siteConfig } from "@/config/site";

/**
 * Analítica opcional, sin cookies (Plausible).
 * No se carga nada salvo que exista NEXT_PUBLIC_PLAUSIBLE_DOMAIN.
 * Antes de activarla, revisá el aviso de privacidad (ver README).
 */
export function Analytics() {
  const domain = siteConfig.analytics.plausibleDomain;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}

import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim()
  ? "https://plausible.io"
  : "";

/**
 * Content Security Policy. Next.js inyecta scripts en línea para hidratar, y
 * esta landing es estática (no admite nonces), por eso script-src/style-src
 * llevan 'unsafe-inline'. Aun así se restringen orígenes, frames, formularios
 * y objetos. Solo se aplica en producción (el modo dev necesita eval).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${plausible}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${plausible}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

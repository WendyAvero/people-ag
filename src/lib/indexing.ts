/**
 * Decide si el deployment actual puede ser indexado por buscadores.
 *
 * En Vercel, VERCEL_ENV vale "production" solo en el deployment de producción;
 * "preview" y "development" nunca se indexan. Si VERCEL_ENV no está definida
 * (build local), se usa NODE_ENV.
 */
export function isIndexableDeployment(
  env: Record<string, string | undefined>,
): boolean {
  if (env.VERCEL_ENV) return env.VERCEL_ENV === "production";
  return env.NODE_ENV === "production";
}

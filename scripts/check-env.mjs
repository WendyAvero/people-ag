/**
 * Verifica las variables de entorno públicas antes de publicar.
 *
 *   npm run check:env
 *
 * Lee .env.local si existe (solo uso local) y, además, el entorno actual.
 * No imprime valores.
 */
import { validatePublicEnv } from "../src/lib/env-validation.mjs";

try {
  process.loadEnvFile(".env.local");
  console.log("(Se leyó .env.local)\n");
} catch {
  /* sin .env.local: se usa el entorno actual */
}

const pub = validatePublicEnv(process.env);
let failed = false;

console.log("Variables públicas del sitio:");
if (pub.errors.length === 0) console.log("  OK: sin errores de formato.");
for (const e of pub.errors) {
  failed = true;
  console.log("  ✗ " + e);
}
for (const w of pub.warnings) console.log("  ! " + w);

process.exit(failed ? 1 : 0);

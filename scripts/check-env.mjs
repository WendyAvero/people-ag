/**
 * Verifica las variables de entorno antes de publicar.
 *
 *   npm run check:env                 → web informativa (los formularios son opcionales)
 *   npm run check:env -- --formularios → además exige la configuración de correo
 *
 * Lee .env.local si existe (solo uso local) y, además, el entorno actual.
 * No imprime valores de secretos.
 */
import { validateMailerEnv, validatePublicEnv } from "../src/lib/env-validation.mjs";

const requireForms = process.argv.includes("--formularios");

try {
  process.loadEnvFile(".env.local");
  console.log("(Se leyó .env.local)\n");
} catch {
  /* sin .env.local: se usa el entorno actual */
}

const mailer = validateMailerEnv(process.env);
const pub = validatePublicEnv(process.env);

let failed = false;

console.log("1) Web informativa (variables públicas):");
if (pub.errors.length === 0) console.log("  OK: sin errores de formato.");
for (const e of pub.errors) {
  failed = true;
  console.log("  ✗ " + e);
}
for (const w of pub.warnings) console.log("  ! " + w);

console.log("\n2) Formulario de contacto (correo, solo servidor):");
if (mailer.ok) {
  console.log("  OK: variables presentes y con formato válido. El formulario se mostrará.");
} else if (requireForms) {
  failed = true;
  for (const p of mailer.problems) console.log("  ✗ " + p);
} else {
  console.log("  Sin configurar: el sitio se publica SIN formulario (modo informativo).");
  for (const p of mailer.problems) console.log("  · " + p);
}

console.log(
  "\nNota: esto valida presencia y formato. No prueba que Resend acepte la clave ni que el dominio esté verificado.",
);
process.exit(failed ? 1 : 0);

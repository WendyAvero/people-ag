/**
 * Esquema y validación del formulario de contacto.
 * Se usa tanto en el navegador (mensajes inmediatos) como en el servidor
 * (la validación que realmente cuenta).
 */

/** El formulario es exclusivamente para empresas. */
export type Audience = "empresa";

export const LIMITS = {
  nameMin: 3,
  nameMax: 100,
  companyMin: 2,
  companyMax: 120,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;

export type ContactPayload = {
  audience: Audience;
  name: string;
  company: string;
  email: string;
  message: string;
  consent: boolean;
  /** Campo trampa anti-bots: debe llegar vacío. */
  website?: string;
};

export type FieldErrors = Partial<
  Record<"name" | "company" | "email" | "message" | "consent", string>
>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

// Caracteres de control (salvo tabulación y saltos de línea): no tienen lugar en un mensaje.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function asString(value: unknown): string {
  return typeof value === "string" ? value.replace(CONTROL_CHARS, "").trim() : "";
}

export function parsePayload(input: unknown): {
  data: ContactPayload | null;
  errors: FieldErrors;
} {
  const errors: FieldErrors = {};
  const raw = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;

  const audience: Audience | null = raw.audience === "empresa" ? "empresa" : null;
  if (!audience) {
    // No es un error de campo: el cliente siempre lo envía.
    return { data: null, errors: { message: "Solicitud inválida." } };
  }

  const name = asString(raw.name).replace(/\s+/g, " ");
  const company = asString(raw.company).replace(/\s+/g, " ");
  const email = asString(raw.email).toLowerCase();
  const message = asString(raw.message);
  const consent = raw.consent === true;
  const website = asString(raw.website);

  if (!name) {
    errors.name = "Ingresá tu nombre y apellido.";
  } else if (name.length < LIMITS.nameMin || !name.includes(" ")) {
    errors.name = "Ingresá tu nombre y apellido completos.";
  } else if (name.length > LIMITS.nameMax) {
    errors.name = `Usá hasta ${LIMITS.nameMax} caracteres.`;
  }

  // La empresa es opcional: solo se valida si se completó.
  if (company && company.length < LIMITS.companyMin) {
    errors.company = "El nombre de la empresa es demasiado corto.";
  } else if (company.length > LIMITS.companyMax) {
    errors.company = `Usá hasta ${LIMITS.companyMax} caracteres.`;
  }

  if (!email) {
    errors.email = "Ingresá tu correo electrónico.";
  } else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email)) {
    errors.email = "Revisá el correo: parece que le falta algo (ej. nombre@dominio.com).";
  }

  if (!message) {
    errors.message = "Contanos brevemente en qué podemos ayudarte.";
  } else if (message.length < LIMITS.messageMin) {
    errors.message = `Escribí al menos ${LIMITS.messageMin} caracteres para que podamos entender tu consulta.`;
  } else if (message.length > LIMITS.messageMax) {
    errors.message = `El mensaje supera los ${LIMITS.messageMax} caracteres.`;
  }

  if (!consent) {
    errors.consent =
      "Necesitamos tu conformidad con el aviso de privacidad para poder responderte.";
  }

  if (Object.keys(errors).length > 0) return { data: null, errors };

  return {
    data: {
      audience,
      name,
      company,
      email,
      message,
      consent,
      website,
    },
    errors,
  };
}

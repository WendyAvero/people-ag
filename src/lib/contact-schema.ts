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
  phoneMin: 6,
  phoneMax: 30,
  positionMin: 3,
  positionMax: 150,
  messageMax: 2000,
  /** Tiempo mínimo de llenado (ms): antispam invisible, lo controla el servidor. */
  minFillMs: 3000,
} as const;

export type ContactPayload = {
  audience: Audience;
  name: string;
  company: string;
  email: string;
  /** Opcional: cadena vacía si no se completó. */
  phone: string;
  /** Perfil o posición a cubrir. */
  position: string;
  /** Comentarios adicionales (opcionales): cadena vacía si no se completó. */
  message: string;
  consent: boolean;
  /** Campo trampa anti-bots: debe llegar vacío. */
  website?: string;
  /** Momento (ms epoch) en que se mostró el formulario: control de tiempo mínimo. */
  startedAt?: number;
};

export type FieldErrors = Partial<
  Record<"name" | "company" | "email" | "phone" | "position" | "message" | "consent", string>
>;

// Teléfono: dígitos con separadores habituales (+, espacios, guiones, puntos, paréntesis).
const PHONE_RE = /^\+?[\d\s().-]+$/;

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
  const phone = asString(raw.phone).replace(/\s+/g, " ");
  const position = asString(raw.position).replace(/\s+/g, " ");
  const message = asString(raw.message);
  const startedAt =
    typeof raw.startedAt === "number" && Number.isFinite(raw.startedAt)
      ? raw.startedAt
      : undefined;
  const consent = raw.consent === true;
  const website = asString(raw.website);

  if (!name) {
    errors.name = "Ingresá tu nombre y apellido.";
  } else if (name.length < LIMITS.nameMin || !name.includes(" ")) {
    errors.name = "Ingresá tu nombre y apellido completos.";
  } else if (name.length > LIMITS.nameMax) {
    errors.name = `Usá hasta ${LIMITS.nameMax} caracteres.`;
  }

  if (!company) {
    errors.company = "Ingresá el nombre de tu empresa.";
  } else if (company.length < LIMITS.companyMin) {
    errors.company = "El nombre de la empresa es demasiado corto.";
  } else if (company.length > LIMITS.companyMax) {
    errors.company = `Usá hasta ${LIMITS.companyMax} caracteres.`;
  }

  if (!email) {
    errors.email = "Ingresá tu correo electrónico.";
  } else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email)) {
    errors.email = "Revisá el correo: parece que le falta algo (ej. nombre@dominio.com).";
  }

  // El teléfono es opcional: solo se valida si se completó.
  if (phone) {
    const digits = phone.replace(/\D/g, "").length;
    if (!PHONE_RE.test(phone) || digits < LIMITS.phoneMin || phone.length > LIMITS.phoneMax) {
      errors.phone = "Revisá el teléfono: usá solo números, y opcionalmente +, espacios o guiones.";
    }
  }

  if (!position) {
    errors.position = "Contanos qué perfil o posición necesitás cubrir.";
  } else if (position.length < LIMITS.positionMin) {
    errors.position = "Escribí el nombre del perfil o posición (ej. Analista contable).";
  } else if (position.length > LIMITS.positionMax) {
    errors.position = `Usá hasta ${LIMITS.positionMax} caracteres.`;
  }

  // Los comentarios son opcionales: solo se controla el largo.
  if (message.length > LIMITS.messageMax) {
    errors.message = `Los comentarios superan los ${LIMITS.messageMax} caracteres.`;
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
      phone,
      position,
      message,
      consent,
      website,
      startedAt,
    },
    errors,
  };
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  LIMITS,
  parsePayload,
  type Audience,
  type FieldErrors,
} from "@/lib/contact-schema";
import { Field, controlClass, describedBy } from "./Field";
import { PrivacyNotice } from "./PrivacyNotice";

type Status = "idle" | "sending" | "success" | "error";

const FIELD_ORDER = [
  "name",
  "company",
  "email",
  "message",
  "consent",
] as const;

export function ContactForm({
  audience,
  testMode = false,
}: {
  audience: Audience;
  /** Entorno que no es producción (Preview): se avisa que es de prueba. */
  testMode?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  // Evita dos envíos simultáneos aunque se haga doble clic antes de re-renderizar.
  const sendingRef = useRef(false);

  // Al confirmarse el envío, el foco pasa al mensaje para lectores de pantalla.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const idp = `${audience}`; // prefijo para ids únicos entre formularios

  function focusFirstError(found: FieldErrors) {
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${first}"]`)
        ?.focus();
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || sendingRef.current) return;

    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      audience,
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };

    // Validación inmediata en el navegador (el servidor valida de nuevo).
    const local = parsePayload(payload);
    if (!local.data) {
      setErrors(local.errors);
      setFormError(null);
      setStatus("idle");
      focusFirstError(local.errors);
      return;
    }

    setErrors({});
    setFormError(null);
    sendingRef.current = true;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        errors?: FieldErrors;
      } | null;

      // Éxito solo si el servidor confirma que el envío se procesó.
      if (res.ok && body?.ok === true) {
        form.reset();
        setStatus("success");
        return;
      }

      if (res.status === 422 && body?.errors) {
        setErrors(body.errors);
        setStatus("idle");
        focusFirstError(body.errors);
        return;
      }

      setFormError(
        body?.message ??
          "No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.",
      );
      setStatus("error");
    } catch {
      setFormError(
        "No pudimos conectarnos. Revisá tu conexión y probá de nuevo.",
      );
      setStatus("error");
    } finally {
      sendingRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-success/40 bg-white p-8 text-center outline-none sm:p-10"
      >
        <p className="font-display text-2xl font-semibold text-success">
          ¡Gracias por escribirnos!
        </p>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Recibimos tu consulta. Vamos a leerla con atención y a responderte al
          correo que nos dejaste.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-lavender-deep underline underline-offset-4 hover:text-ink"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={formError ? `${idp}-form-error` : undefined}
      className="space-y-6"
    >
      {testMode ? (
        <p
          role="note"
          className="border-l-4 border-sand-deep bg-white px-4 py-3 text-sm font-semibold text-sand-deep"
        >
          Formulario en entorno de prueba. No ingreses datos personales reales.
        </p>
      ) : null}

      {process.env.NODE_ENV === "development" ? (
        <p className="border-l-2 border-sand-deep bg-white px-4 py-3 text-sm text-sand-deep">
          Modo desarrollo: el envío real requiere configurar{" "}
          <code>RESEND_API_KEY</code>, <code>CONTACT_TO_EMAIL</code> y{" "}
          <code>CONTACT_FROM_EMAIL</code> (ver README). Sin eso, el formulario
          informa que no está habilitado.
        </p>
      ) : null}

      <Field
        id={`${idp}-name`}
        label="Nombre y apellido"
        required
        error={errors.name}
      >
        <input
          id={`${idp}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={LIMITS.nameMax}
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy(`${idp}-name`, errors.name)}
          className={controlClass(!!errors.name)}
        />
      </Field>

      <Field
        id={`${idp}-company`}
        label="Empresa (opcional)"
        error={errors.company}
      >
        <input
          id={`${idp}-company`}
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={LIMITS.companyMax}
          aria-invalid={errors.company ? true : undefined}
          aria-describedby={describedBy(`${idp}-company`, errors.company)}
          className={controlClass(!!errors.company)}
        />
      </Field>

      <Field
        id={`${idp}-email`}
        label="Correo electrónico"
        required
        error={errors.email}
      >
        <input
          id={`${idp}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.emailMax}
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy(`${idp}-email`, errors.email)}
          className={controlClass(!!errors.email)}
        />
      </Field>

      <Field
        id={`${idp}-message`}
        label="Mensaje"
        required
        error={errors.message}
        hint="Contanos qué necesitás y en qué momento está tu organización."
      >
        <textarea
          id={`${idp}-message`}
          name="message"
          rows={5}
          maxLength={LIMITS.messageMax}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy(
            `${idp}-message`,
            errors.message,
            "hint",
          )}
          className={`${controlClass(!!errors.message)} resize-y`}
        />
      </Field>

      {/* Campo trampa anti-bots: oculto para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${idp}-website`}>No completar este campo</label>
        <input
          id={`${idp}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={`${idp}-consent`}
            name="consent"
            type="checkbox"
            aria-required="true"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={
              errors.consent ? `${idp}-consent-error` : `${idp}-consent-info`
            }
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-lavender-deep"
          />
          <label
            htmlFor={`${idp}-consent`}
            className="text-sm leading-relaxed text-ink"
          >
            Acepto que People AG utilice mis datos para responder mi consulta y
            mantener conversaciones relacionadas con los servicios solicitados.
          </label>
        </div>
        <div className="pl-8">
          <PrivacyNotice id={`${idp}-consent-info`} />
        </div>
        {errors.consent ? (
          <p
            id={`${idp}-consent-error`}
            className="mt-1.5 pl-8 text-sm font-medium text-error"
          >
            {errors.consent}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p
          id={`${idp}-form-error`}
          role="alert"
          className="border-l-2 border-error bg-white px-4 py-3 text-sm font-medium text-error"
        >
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 font-display text-sm font-semibold text-cream transition-all duration-200 hover:bg-lavender-deep active:translate-y-px disabled:cursor-wait disabled:opacity-70 focus-visible:outline-lavender-deep sm:w-auto"
      >
        {status === "sending" ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}

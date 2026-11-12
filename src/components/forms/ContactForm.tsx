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

type Status = "idle" | "sending" | "success" | "dry-run" | "error";

const FIELD_ORDER = [
  "name",
  "company",
  "email",
  "phone",
  "position",
  "message",
  "consent",
] as const;

export function ContactForm({
  audience,
  dryRun = false,
}: {
  audience: Audience;
  /**
   * Modo de prueba (Preview/desarrollo): el formulario valida pero NO envía ni
   * guarda nada. Se avisa en pantalla y la confirmación lo aclara.
   */
  dryRun?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  // Antispam invisible: el servidor exige un tiempo mínimo desde que se mostró el formulario.
  const startedAtRef = useRef<number>(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  // Evita dos envíos simultáneos aunque se haga doble clic antes de re-renderizar.
  const sendingRef = useRef(false);

  // Marca el momento en que se mostró el formulario (en el navegador, ya montado).
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  // Al confirmarse el envío, el foco pasa al mensaje para lectores de pantalla.
  useEffect(() => {
    if (status === "success" || status === "dry-run") successRef.current?.focus();
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
      phone: String(fd.get("phone") ?? ""),
      position: String(fd.get("position") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt: startedAtRef.current,
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
        dryRun?: boolean;
        message?: string;
        errors?: FieldErrors;
      } | null;

      // Éxito solo si el servidor confirma que el envío se procesó.
      if (res.ok && body?.ok === true) {
        form.reset();
        startedAtRef.current = Date.now();
        // En modo de prueba el servidor aclara que NO se envió nada: no se muestra como éxito.
        setStatus(body.dryRun === true ? "dry-run" : "success");
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

  if (status === "dry-run") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-ink/10 border-l-4 border-l-sand-deep bg-white p-8 outline-none sm:p-10"
      >
        <p className="font-display text-xl font-semibold">
          Vista de prueba: tu consulta no fue enviada
        </p>
        <p className="mt-3 max-w-md text-muted">
          Los datos pasaron la validación, pero este formulario todavía no está
          habilitado: no se envió ningún correo ni se guardó información.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-lavender-deep underline underline-offset-4 hover:text-ink"
        >
          Volver al formulario
        </button>
      </div>
    );
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
      {dryRun ? (
        <p
          role="note"
          className="border-l-4 border-sand-deep bg-white px-4 py-3 text-sm font-semibold text-sand-deep"
        >
          Vista de prueba: este formulario no envía mensajes ni guarda datos.
          No ingreses datos personales reales.
        </p>
      ) : null}

      <div>
        <h3 className="font-display text-lg font-semibold">
          Consultá por Reclutamiento y selección
        </h3>
        <p className="mt-1 text-sm text-muted">
          Los campos con <span aria-hidden="true" className="text-lavender-deep">*</span>
          <span className="sr-only">asterisco</span> son obligatorios.
        </p>
      </div>

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
        label="Empresa"
        required
        error={errors.company}
      >
        <input
          id={`${idp}-company`}
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={LIMITS.companyMax}
          aria-required="true"
          aria-invalid={errors.company ? true : undefined}
          aria-describedby={describedBy(`${idp}-company`, errors.company)}
          className={controlClass(!!errors.company)}
        />
      </Field>

      <Field
        id={`${idp}-email`}
        label="Email laboral"
        required
        error={errors.email}
        hint="Si podés, usá tu correo de la empresa. Cualquier correo de contacto sirve."
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
          aria-describedby={describedBy(`${idp}-email`, errors.email, "hint")}
          className={controlClass(!!errors.email)}
        />
      </Field>

      <Field
        id={`${idp}-phone`}
        label="Teléfono (opcional)"
        error={errors.phone}
      >
        <input
          id={`${idp}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={LIMITS.phoneMax}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy(`${idp}-phone`, errors.phone)}
          className={controlClass(!!errors.phone)}
        />
      </Field>

      <Field
        id={`${idp}-position`}
        label="Perfil o posición a cubrir"
        required
        error={errors.position}
      >
        <input
          id={`${idp}-position`}
          name="position"
          type="text"
          maxLength={LIMITS.positionMax}
          aria-required="true"
          aria-invalid={errors.position ? true : undefined}
          aria-describedby={describedBy(`${idp}-position`, errors.position)}
          className={controlClass(!!errors.position)}
        />
      </Field>

      <Field
        id={`${idp}-message`}
        label="Comentarios adicionales (opcional)"
        error={errors.message}
      >
        <textarea
          id={`${idp}-message`}
          name="message"
          rows={5}
          maxLength={LIMITS.messageMax}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy(`${idp}-message`, errors.message)}
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
            {/* TEXTO PENDIENTE DE VALIDACIÓN PROFESIONAL (aviso de privacidad en borrador). */}
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
        {status === "sending"
          ? dryRun
            ? "Validando…"
            : "Enviando…"
          : "Enviar consulta"}
      </button>
    </form>
  );
}

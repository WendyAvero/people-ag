import type { ReactNode } from "react";

const controlBase =
  "block w-full border bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus-visible:outline-2 focus-visible:outline-lavender-deep";

export function controlClass(hasError: boolean) {
  return `${controlBase} ${
    hasError ? "border-error" : "border-ink/25 hover:border-ink/50"
  }`;
}

type Props = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

/** Etiqueta + control + mensaje de error, conectados con aria-describedby. */
export function Field({ id, label, error, hint, required, children }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-lavender-deep">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

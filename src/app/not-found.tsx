import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="contenido" className="flex min-h-screen items-center">
      <Container className="py-24">
        <Logo className="h-16" />
        <p className="eyebrow mt-16 text-lavender-deep">Error 404</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          No encontramos esta página
        </h1>
        <p className="mt-5 max-w-md text-muted">
          Puede que el enlace haya cambiado o que la dirección tenga un error.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-lavender-deep"
        >
          Volver al inicio
        </Link>
      </Container>
    </main>
  );
}

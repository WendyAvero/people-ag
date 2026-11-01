import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Cómo ${siteConfig.name} trata los datos personales que se reciben a través del formulario de contacto.`,
  alternates: { canonical: "/privacidad" },
  // Mientras sea un borrador no debería aparecer en buscadores.
  robots: siteConfig.privacyIsDraft
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

/** Marca visible de un dato que debe completarse antes de publicar. */
function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="border-b-2 border-dashed border-sand-deep px-0.5 font-medium text-sand-deep">
      [COMPLETAR: {children}]
    </span>
  );
}

/** Muestra el dato real si está cargado en site.ts; si no, la marca de pendiente. */
function Val({ value, label }: { value: string | null; label: string }) {
  return value ? <>{value}</> : <Pending>{label}</Pending>;
}

function Block({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink/90">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <>
      <header className="border-b border-line bg-cream">
        <Container className="flex h-16 items-center justify-between sm:h-20">
          <Link href="/" aria-label="People AG, volver al inicio" className="rounded-sm">
            <Logo className="h-16" />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-lavender-deep underline underline-offset-4 hover:text-ink"
          >
            Volver al sitio
          </Link>
        </Container>
      </header>

      <main id="contenido" className="bg-white py-14 sm:py-20">
        <Container className="max-w-3xl">
          {siteConfig.privacyIsDraft ? (
            <div
              role="note"
              className="mb-10 border-l-4 border-error bg-cream p-5 text-sm leading-relaxed"
            >
              <p className="font-display font-semibold text-error">
                BORRADOR — no es un texto legal aprobado
              </p>
              <p className="mt-2">
                Este documento es un punto de partida editable. Los datos
                marcados como <Pending>dato pendiente</Pending> deben
                completarse y todo el texto debe ser revisado por un profesional
                del derecho antes de publicar el sitio. Para ocultar este aviso,
                cambiá <code>privacyIsDraft</code> a <code>false</code> en{" "}
                <code>src/config/site.ts</code>.
              </p>
            </div>
          ) : null}

          <p className="eyebrow text-lavender-deep">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Aviso de privacidad
          </h1>
          <p className="mt-4 text-sm text-muted">
            Última actualización: <Pending>fecha</Pending>
          </p>

          <Block title="1. Quién es responsable">
            <p>
              La responsable del tratamiento de tus datos es{" "}
              <Val value={siteConfig.legal.responsible} label="nombre completo" />
              , persona humana, que presta sus servicios profesionales bajo la
              marca {siteConfig.name}. Podés escribirle a{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-semibold text-lavender-deep underline underline-offset-4"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
            <p>
              Domicilio de la responsable:{" "}
              <Val
                value={siteConfig.legal.address}
                label="domicilio, pendiente de validación jurídica"
              />
              .
            </p>
          </Block>

          <Block title="2. Qué datos pedimos">
            <p>
              Solo los que completás en el formulario de contacto: nombre y
              apellido, correo electrónico, empresa (opcional) y el mensaje que
              escribas. No pedimos DNI, CUIT, domicilio, teléfono, datos
              financieros ni datos sensibles; te pedimos que tampoco los
              incluyas en el mensaje. El nombre, el correo y el mensaje son
              obligatorios: sin ellos no podemos responderte.
            </p>
            <p>
              Este formulario es solo para consultas por nuestros servicios. No
              es una plataforma de empleo y no recibimos postulaciones
              laborales.
            </p>
          </Block>

          <Block title="3. Para qué los usamos">
            <p>Únicamente para:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>responder la consulta que iniciaste voluntariamente;</li>
              <li>darte información sobre los servicios profesionales de {siteConfig.name};</li>
              <li>
                mantener conversaciones comerciales vinculadas con una posible
                contratación.
              </li>
            </ul>
            <p>
              Antes de enviar el formulario te pedimos que marques una casilla
              aceptando este uso. Podés retirar tu consentimiento escribiendo al
              correo del punto 1.{" "}
              <Pending>validar con asesor jurídico la base jurídica del
              tratamiento y si corresponde mantener la casilla de
              consentimiento</Pending>
            </p>
          </Block>

          <Block title="4. Para qué no los usamos">
            <p>
              No enviamos newsletters ni hacemos campañas de marketing
              automatizadas. No elaboramos perfiles comerciales. No usamos tus
              datos para ninguna finalidad distinta de las anteriores.
            </p>
            <p>
              No comercializamos ni compartimos tus datos con terceros para sus
              propias finalidades. Los proveedores tecnológicos intervienen
              exclusivamente para prestar los servicios necesarios para gestionar
              tu consulta.
            </p>
          </Block>

          <Block title="5. Cómo llegan tus datos y quién interviene">
            <p>
              Tu consulta llega a la casilla de correo de {siteConfig.name}. El
              sitio no tiene una base de datos propia para guardar las
              consultas, pero los mensajes se reciben y quedan en esa casilla, y
              pueden existir registros técnicos en los proveedores que se
              describen a continuación.
            </p>
            <p>
              Para que el formulario funcione usamos dos servicios: Vercel, para
              el alojamiento del sitio, y Resend, para el envío de la consulta
              por correo electrónico. Tus datos pasan por ellos para que el
              mensaje llegue. Pueden tener servidores fuera de Argentina y
              conservar registros técnicos según sus propias condiciones.{" "}
              <Pending>revisar las condiciones contractuales de Vercel y Resend,
              la ubicación de sus servidores, si hay transferencia internacional
              de datos y qué exige la normativa en ese caso, y los plazos de
              retención de cada uno</Pending>
            </p>
            <p>
              Para evitar envíos abusivos, el sitio usa tu dirección IP de forma
              temporal, durante unos minutos y sin guardarla.
            </p>
          </Block>

          <Block title="6. Cuánto tiempo los conservamos">
            <p>
              El tiempo necesario para responderte y, si corresponde, mantener
              la conversación comercial.{" "}
              <Pending>plazo concreto de conservación, a definir con asesor
              jurídico</Pending>
            </p>
          </Block>

          <Block title="7. Tus derechos">
            <p>
              Podés pedir el acceso, la rectificación, la actualización o la
              supresión de tus datos escribiendo a{" "}
              {siteConfig.contactEmail}.
            </p>
            <p>
              {siteConfig.legal.aaipLegend ?? (
                <Pending>texto textual que exige la normativa sobre el derecho de
                acceso y el rol de la Agencia de Acceso a la Información
                Pública; que el asesor jurídico lo copie tal como figura en la
                norma</Pending>
              )}
            </p>
            <p>
              <Pending>aplicabilidad de la inscripción de bases de datos ante la
              AAIP y de la normativa uruguaya cuando corresponda</Pending>
            </p>
          </Block>

          <Block title="8. Cookies y cambios en este aviso">
            <p>
              Por ahora, este sitio no instala cookies, no guarda información en
              tu dispositivo, no usa herramientas de analítica y no carga
              scripts de terceros.{" "}
              <Pending>confirmar antes de publicar, con la configuración final
              de Vercel (analítica, registros del proveedor), que esta
              afirmación sigue siendo exacta</Pending>
            </p>
            <p>
              Si modificamos este aviso, publicaremos la versión actualizada en
              esta misma página, con su fecha.
            </p>
          </Block>
        </Container>
      </main>
      <Footer />
    </>
  );
}

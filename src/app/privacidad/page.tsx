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

          <Block title="1. Quién es responsable de tus datos">
            <p>
              El responsable del tratamiento de los datos personales que se
              reciben a través de este sitio es{" "}
              <Val value={siteConfig.legal.responsible} label="nombre completo o razón social" />
              , CUIT <Val value={siteConfig.legal.taxId} label="número" />, con
              domicilio en{" "}
              <Val value={siteConfig.legal.address} label="domicilio legal" />,
              que actúa bajo la marca {siteConfig.name}.
            </p>
            <p>
              Para consultas sobre privacidad y para ejercer tus derechos podés
              escribir a{" "}
              <Val value={siteConfig.legal.privacyEmail} label="correo de contacto para temas de privacidad" />
              .
            </p>
          </Block>

          <Block title="2. Qué datos recolectamos">
            <p>
              Solo los que completás voluntariamente en el formulario de
              contacto:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Nombre y apellido.</li>
              <li>Correo electrónico.</li>
              <li>Nombre de la empresa (opcional).</li>
              <li>Servicio de interés.</li>
              <li>El contenido del mensaje que escribas.</li>
            </ul>
            <p>
              Son obligatorios el nombre y apellido, el correo, el servicio de
              interés y el mensaje (la empresa es opcional): sin ellos no
              podemos responder tu consulta.
            </p>
            <p>
              No pedimos datos sensibles. Te pedimos que tampoco los incluyas en
              el mensaje (por ejemplo, datos de salud, orientación sexual,
              afiliación política o sindical, o creencias religiosas).
            </p>
          </Block>

          <Block title="3. Para qué los usamos">
            <p>
              Usamos estos datos únicamente para leer tu consulta, responderte y
              coordinar una primera conversación. No los usamos para enviarte
              publicidad ni los cedemos a terceros con fines comerciales.
            </p>
          </Block>

          <Block title="4. Consentimiento">
            <p>
              Antes de enviar el formulario te pedimos que confirmes que leíste
              este aviso. Sin esa conformidad el formulario no se envía. Podés
              retirar tu consentimiento en cualquier momento escribiendo al
              correo indicado en el punto 1.
            </p>
            <p>
              El sitio no guarda un registro propio del consentimiento: la
              constancia (que aceptaste el aviso, con fecha y hora) queda
              incluida en el correo con tu consulta.
            </p>
          </Block>

          <Block title="5. Cómo se reciben y se protegen">
            <p>
              Los mensajes se envían por correo electrónico a una casilla de uso
              restringido a <Pending>quién accede</Pending>. El sitio no guarda
              los mensajes en una base de datos pública ni en el propio sitio.
              La transmisión se realiza mediante conexión cifrada (HTTPS).
            </p>
            <p>
              Datos técnicos: para prevenir abusos, el servidor usa tu
              dirección IP de forma temporal (en memoria, unos minutos) para
              limitar envíos repetidos, y el proveedor de alojamiento puede
              registrar datos de conexión (IP, fecha, navegador) en sus
              registros técnicos. <Pending>Confirmar con la configuración
              real del hosting el alcance y la duración de esos registros.</Pending>
            </p>
            <p>
              <Pending>Describir medidas adicionales: acceso con contraseña
              fuerte y verificación en dos pasos, dispositivos protegidos,
              etc.</Pending>
            </p>
          </Block>

          <Block title="6. Con quién podemos compartirlos">
            <p>
              Para que el formulario funcione utilizamos proveedores de servicios
              tecnológicos que procesan datos por nuestra cuenta: un servicio de
              envío de correo (<Pending>proveedor, ej. Resend</Pending>) y un
              servicio de alojamiento del sitio (<Pending>proveedor, ej.
              Vercel</Pending>). Estos proveedores pueden estar ubicados fuera
              de Argentina y pueden conservar una copia de los mensajes o
              registros técnicos según sus propias condiciones{" "}
              <Pending>verificar plazos de retención de cada proveedor</Pending>.
            </p>
            <p>
              <Pending>Con asesoramiento jurídico: describir el marco
              contractual con cada proveedor y, para transferencias
              internacionales a países sin nivel de protección adecuado, el
              mecanismo aplicable (por ejemplo, cláusulas contractuales modelo
              aprobadas por la AAIP) o el consentimiento expreso.</Pending>
            </p>
          </Block>

          <Block title="7. Cuánto tiempo los conservamos">
            <p>
              Conservamos tu consulta durante <Pending>plazo de conservación</Pending>{" "}
              y luego la eliminamos, salvo que hayamos iniciado una relación de
              trabajo o que una norma nos obligue a conservarla.
            </p>
          </Block>

          <Block title="8. Tus derechos">
            <p>
              Tenés derecho a solicitar el acceso, la rectificación, la
              actualización y la supresión de tus datos personales. Para
              ejercerlos, escribinos al correo indicado en el punto 1.{" "}
              <Pending>Revisión jurídica: indicar plazos de respuesta (la Ley
              25.326 prevé 10 días corridos para el acceso y 5 días hábiles para
              rectificación o supresión) y la gratuidad del acceso a intervalos
              no inferiores a seis meses.</Pending>
            </p>
            <p>
              {siteConfig.legal.aaipLegend ?? (
                <Pending>texto textual que exige la Resolución AAIP 14/2018
                (art. 3) sobre el rol de la Agencia de Acceso a la Información
                Pública como órgano de control; copiarlo tal como figura en la
                norma</Pending>
              )}
            </p>
          </Block>

          <Block title="9. Cookies y analítica">
            <p>
              Este sitio no utiliza cookies publicitarias ni de seguimiento.{" "}
              <Pending>Confirmar y ajustar según la analítica que se active: si
              se usa una herramienta sin cookies, indicarlo; si se usa una que
              sí las instala, agregar banner de consentimiento y detallar
              finalidades.</Pending>
            </p>
          </Block>

          <Block id="informacion-legal" title="10. Información legal">
            <p>
              {siteConfig.name} es una marca de <Val value={siteConfig.legal.responsible} label="titular: nombre o razón social" />
              , CUIT <Val value={siteConfig.legal.taxId} label="número" />,
              domicilio <Val value={siteConfig.legal.address} label="domicilio legal" />. Los contenidos de este sitio
              son informativos y no constituyen una oferta ni una garantía de
              resultados. <Pending>Agregar otros datos legales exigibles (por
              ejemplo, inscripciones) según indique el asesor jurídico.</Pending>
            </p>
          </Block>

          <Block title="11. Cambios en este aviso">
            <p>
              Si modificamos este aviso, publicaremos la versión actualizada en
              esta misma página con su fecha.
            </p>
          </Block>
        </Container>
      </main>
      <Footer />
    </>
  );
}

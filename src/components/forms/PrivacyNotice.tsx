import Link from "next/link";

import { siteConfig } from "@/config/site";

/**
 * Información de primera capa que se muestra junto al formulario, antes de
 * recolectar datos (finalidad, destinatarios, carácter obligatorio, derechos).
 * Borrador: el texto definitivo debe ser validado por un profesional.
 */
export function PrivacyNotice({ id }: { id: string }) {
  const { legal } = siteConfig;

  return (
    <div
      id={id}
      className="mt-3 space-y-2 border-l-2 border-sand pl-4 text-[0.8125rem] leading-relaxed text-muted"
    >
      <p>
        <strong className="font-semibold text-ink">
          Responsable: {legal.responsible ?? siteConfig.name}
        </strong>
        {legal.address ? ` · ${legal.address}` : ""}.
      </p>
      <p>
        Usamos tu nombre, correo, empresa (si corresponde), servicio de interés
        y mensaje <strong className="font-semibold">solo para responder esta
        consulta</strong>. Los campos con * son obligatorios: sin ellos no
        podemos responderte.
      </p>
      <p>
        Tu mensaje llega a nuestra casilla de correo a través de proveedores
        tecnológicos que pueden operar fuera de Argentina. No lo cedemos a
        terceros con fines comerciales.
      </p>
      <p>
        Podés acceder a tus datos, rectificarlos o pedir su supresión
        escribiendo a{" "}
        {legal.privacyEmail ? (
          <a
            href={`mailto:${legal.privacyEmail}`}
            className="font-semibold text-lavender-deep underline underline-offset-2"
          >
            {legal.privacyEmail}
          </a>
        ) : (
          "la dirección indicada en el aviso de privacidad"
        )}
        . Más detalle en el{" "}
        <Link
          href="/privacidad"
          target="_blank"
          className="font-semibold text-lavender-deep underline underline-offset-2"
        >
          aviso de privacidad
        </Link>
        .
      </p>
      {legal.aaipLegend ? <p>{legal.aaipLegend}</p> : null}
    </div>
  );
}

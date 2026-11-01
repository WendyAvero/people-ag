import Link from "next/link";

/**
 * Información breve que se muestra junto al formulario, antes de enviar.
 * El detalle completo (y los datos del responsable) está en el aviso de
 * privacidad, que todavía es un borrador.
 */
export function PrivacyNotice({ id }: { id: string }) {
  return (
    <p
      id={id}
      className="mt-3 border-l-2 border-sand pl-4 text-[0.8125rem] leading-relaxed text-muted"
    >
      Al enviar tu consulta, tus datos serán utilizados por People AG para
      responderte y gestionar el contacto comercial. Podés consultar más
      información sobre el tratamiento de tus datos en nuestro{" "}
      <Link
        href="/privacidad"
        target="_blank"
        className="font-semibold text-lavender-deep underline underline-offset-2"
      >
        Aviso de Privacidad
      </Link>
      .
    </p>
  );
}

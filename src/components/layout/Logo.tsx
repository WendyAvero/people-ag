import Image from "next/image";

import logo from "../../../public/logo-people-ag.png";

/**
 * Logo oficial de People AG (public/logo-people-ag.png, fondo transparente).
 * Solo se fija la altura: el ancho sale de la proporción original del archivo,
 * así nunca se deforma. Para cambiar el logo, reemplazá ese archivo por otro
 * PNG con fondo transparente.
 */
export function Logo({ className = "h-12 sm:h-16" }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="People AG Consultora"
      width={logo.width}
      height={logo.height}
      unoptimized
      priority
      className={`w-auto ${className}`}
    />
  );
}

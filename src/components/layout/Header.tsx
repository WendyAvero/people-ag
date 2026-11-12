"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { navItems } from "@/config/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { companyServices } from "@/content/services";
import { servicePathById } from "@/content/service-pages";
import { Logo } from "./Logo";

/**
 * En la home los enlaces son anclas de la misma página; en las páginas de
 * servicio (`home={false}`) apuntan a la home ("/#sección").
 */
export function Header({ home = true }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(home ? "inicio" : "");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);

  // Fondo del encabezado al hacer scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sección activa según el scroll.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Submenú «Servicios» (escritorio): se cierra con Escape, clic afuera o al salir el foco.
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [servicesOpen]);

  // Cerrar el menú móvil con Escape y devolver el foco al botón.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 sm:h-20 lg:px-10">
        <a href={`${prefix}#inicio`} aria-label="People AG, ir al inicio" className="inline-block rounded-sm py-1">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => {
              const isActive = active === item.id;
              const linkClass = `relative py-2 text-sm font-medium transition-colors hover:text-lavender-deep ${
                isActive ? "text-lavender-deep" : "text-ink/80"
              } after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-lavender-deep after:transition-transform after:duration-300 ${
                isActive
                  ? "after:scale-x-100"
                  : "after:scale-x-0 hover:after:scale-x-100"
              }`;

              if (item.id !== "empresas") {
                return (
                  <li key={item.id}>
                    <a
                      href={`${prefix}${item.href}`}
                      aria-current={isActive ? "true" : undefined}
                      className={linkClass}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              }

              return (
                <li
                  key={item.id}
                  ref={servicesRef}
                  className="relative flex items-center gap-1"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setServicesOpen(false);
                    }
                  }}
                >
                  <a
                    href={`${prefix}${item.href}`}
                    aria-current={isActive ? "true" : undefined}
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                  <button
                    ref={servicesButtonRef}
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="submenu-servicios"
                    aria-label="Mostrar las líneas de servicio"
                    onClick={() => setServicesOpen((v) => !v)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/80 transition-colors hover:text-lavender-deep"
                  >
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <ul
                    id="submenu-servicios"
                    hidden={!servicesOpen}
                    className="absolute left-0 top-full z-50 mt-2 w-80 border border-line border-t-2 border-t-sand bg-white p-2 shadow-soft"
                  >
                    {companyServices.map((service) => (
                      <li key={service.id}>
                        <a
                          href={servicePathById[service.id]}
                          onClick={() => setServicesOpen(false)}
                          className="block rounded-sm px-3 py-2.5 text-sm font-medium text-ink/90 transition-colors hover:bg-cream hover:text-lavender-deep"
                        >
                          {service.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={`${prefix}#contacto`}
            className="!px-5 !py-2.5 sm:!px-6"
          >
            Hablemos
          </ButtonLink>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="menu-movil"
        aria-label="Principal (móvil)"
        hidden={!open}
        className="border-t border-line bg-cream lg:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`${prefix}${item.href}`}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? "true" : undefined}
                className={`flex min-h-12 items-center justify-between border-b border-line/70 py-3 font-display text-base font-medium last:border-b-0 ${
                  active === item.id ? "text-lavender-deep" : "text-ink"
                }`}
              >
                {item.label}
              </a>
              {item.id === "empresas" ? (
                <ul className="border-b border-line/70 pb-2 pl-4">
                  {companyServices.map((service) => (
                    <li key={service.id}>
                      <a
                        href={servicePathById[service.id]}
                        onClick={() => setOpen(false)}
                        className="flex min-h-11 items-center py-2 text-[0.95rem] text-ink/85"
                      >
                        {service.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

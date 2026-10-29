"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import { navItems } from "@/config/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("inicio");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
        <a href="#inicio" aria-label="People AG, ir al inicio" className="inline-block rounded-sm py-1">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative py-2 text-sm font-medium transition-colors hover:text-lavender-deep ${
                      isActive ? "text-lavender-deep" : "text-ink/80"
                    } after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-lavender-deep after:transition-transform after:duration-300 ${
                      isActive
                        ? "after:scale-x-100"
                        : "after:scale-x-0 hover:after:scale-x-100"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="#contacto"
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
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? "true" : undefined}
                className={`flex min-h-12 items-center justify-between border-b border-line/70 py-3 font-display text-base font-medium last:border-b-0 ${
                  active === item.id ? "text-lavender-deep" : "text-ink"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

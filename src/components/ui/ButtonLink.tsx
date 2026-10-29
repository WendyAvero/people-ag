import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost-light";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold tracking-tight transition-all duration-200 ease-out active:translate-y-px active:scale-[0.99] focus-visible:outline-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-cream hover:bg-lavender-deep focus-visible:outline-lavender-deep",
  secondary:
    "border border-ink/80 text-ink hover:bg-ink hover:text-cream focus-visible:outline-lavender-deep",
  accent:
    "bg-sand text-ink hover:bg-cream focus-visible:outline-cream",
  "ghost-light":
    "border border-cream/50 text-cream hover:bg-cream hover:text-ink focus-visible:outline-cream",
};

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

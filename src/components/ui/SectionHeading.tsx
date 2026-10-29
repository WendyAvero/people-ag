import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  tone = "dark",
  className = "",
}: Props) {
  const eyebrowColor = tone === "light" ? "text-sand-light" : "text-lavender-deep";
  const bodyColor = tone === "light" ? "text-cream/80" : "text-muted";
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className={`eyebrow ${eyebrowColor}`}>{eyebrow}</p>
      <h2
        id={id}
        className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-[2.6rem]"
      >
        {title}
      </h2>
      {children ? (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${bodyColor}`}>
          {children}
        </p>
      ) : null}
    </div>
  );
}

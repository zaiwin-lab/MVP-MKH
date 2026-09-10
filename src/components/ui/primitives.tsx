import type { ReactNode } from "react";

/** Small gold uppercase label that sits above every page title. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/** White panel with the soft border and lift used across the portal. */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-card border border-parchment-300 bg-white shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Page hero: eyebrow, serif title with a gold-accented phrase, and a lead
 * line, over a Sarawak landscape band that fades into the page.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  trailing,
  lead,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  trailing?: string;
  lead: string;
  image: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-parchment-50">
      <div className="absolute inset-0 -z-10">{image}</div>
      {/* Left-weighted scrim so the headline stays readable over photography. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-parchment-50 via-parchment-50/85 to-parchment-50/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-parchment-100 to-transparent" />

      <div className="shell py-10 md:py-14">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-2 text-hero">
            {title}{" "}
            {accent && <span className="text-gold-600">{accent}</span>}
            {trailing && <> {trailing}</>}
          </h1>
          <p className="mt-3 max-w-xl text-base text-ink-500 md:text-lg">
            {lead}
          </p>
          {children}
        </div>
      </div>
    </header>
  );
}

/** The handwritten brand mark that appears in hero corners. */
export function ScriptMark({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <p
      aria-hidden
      className={`font-script text-xl leading-tight text-ink-800 md:text-2xl ${className}`}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
      <span className="mt-0.5 block h-px w-24 bg-gold-400" />
    </p>
  );
}

/** Numbered step badge used on the journey timelines. */
export function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-white">
      {n}
    </span>
  );
}

/** Full-width note strip — info, caution, or confirmation. */
export function Note({
  tone = "info",
  icon,
  children,
}: {
  tone?: "info" | "warn" | "ok";
  icon?: ReactNode;
  children: ReactNode;
}) {
  const tones = {
    info: "bg-parchment-200/70 border-parchment-300 text-ink-600",
    warn: "bg-red-50 border-red-200 text-ink-700",
    ok: "bg-forest-50 border-forest-200 text-ink-700",
  } as const;

  return (
    <div
      className={`flex items-start gap-3 rounded-control border px-4 py-3 text-[0.8125rem] ${tones[tone]}`}
    >
      {icon && <span className="mt-px shrink-0">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}

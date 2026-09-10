import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "forest" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  gold: "gold-face text-white shadow-sm hover:brightness-105 active:brightness-95 border border-gold-600/40",
  forest:
    "bg-forest-700 text-white hover:bg-forest-600 active:bg-forest-800 border border-forest-800/40",
  outline:
    "bg-white text-ink-800 border border-gold-300 hover:border-gold-500 hover:bg-gold-50",
  ghost: "bg-transparent text-ink-700 hover:bg-parchment-200 border border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-[0.9375rem]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "gold",
  size = "md",
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "gold",
  size = "md",
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

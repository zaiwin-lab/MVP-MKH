"use client";

import type { ReactNode } from "react";
import { COPY, LANGS, type Lang } from "@/lib/i18n";

/* --------------------------------------------------------------------------
   Express UI primitives.

   Local to /express rather than added to src/components/ui: this module
   carries its own navy/champagne register and is meant to lift cleanly into
   the full platform later. Nothing here is shared with the main portal.
   -------------------------------------------------------------------------- */

export const STEP_IDS = ["tanah", "rumah", "finance", "guide", "done"] as const;

/**
 * The progress rail. Its job is psychological, not navigational: it tells a
 * customer arriving from an ad that this is five short steps, not a mortgage
 * application. Five bars read as progress at 390px where five labelled chips
 * would not.
 */
export function ProgressRail({
  activeIndex,
  lang,
}: {
  activeIndex: number;
  lang: Lang;
}) {
  const t = COPY[lang];
  return (
    <nav aria-label={t.stepNav} className="w-full">
      <ol className="flex items-start gap-1.5 sm:gap-2.5">
        {t.steps.map((label, i) => {
          const reached = i <= activeIndex;
          const current = i === activeIndex;
          return (
            <li key={STEP_IDS[i]} className="min-w-0 flex-1">
              <span
                aria-hidden
                className={`block h-1 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                  reached
                    ? "bg-champagne-500"
                    : "bg-navy-200"
                } ${current ? "shadow-[0_0_0_3px_var(--color-champagne-100)]" : ""}`}
              />
              <span
                className={`mt-2 block truncate text-[0.625rem] font-bold uppercase tracking-[0.08em] transition-colors duration-500 sm:text-[0.6875rem] sm:tracking-[0.12em] ${
                  current
                    ? "text-navy-900"
                    : reached
                      ? "text-champagne-700"
                      : "text-navy-500"
                }`}
              >
                {label}
              </span>
              {current ? <span className="sr-only">{t.currentStep}</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
}) {
  return (
    <div
      role="group"
      aria-label={COPY[lang].langLabel}
      className="flex shrink-0 items-center rounded-full border border-navy-200 bg-white p-0.5"
    >
      {LANGS.map((entry) => {
        const active = entry.code === lang;
        return (
          <button
            key={entry.code}
            type="button"
            onClick={() => onChange(entry.code)}
            aria-pressed={active}
            title={entry.full}
            className={`min-h-9 rounded-full px-3 py-2 text-[0.6875rem] font-bold tracking-wide transition-colors duration-200 ${
              active
                ? "bg-navy-900 text-white"
                : "text-navy-500 hover:text-navy-900"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

export function SectionHeading({
  index,
  title,
  support,
}: {
  index: string;
  title: string;
  support: string;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-[0.8125rem] font-bold tabular-nums text-champagne-300 sm:size-10 sm:text-sm">
          {index}
        </span>
        <span aria-hidden className="h-px flex-1 bg-navy-100" />
      </div>
      <h2 className="mt-4 text-balance font-display text-[1.625rem] font-bold leading-[1.12] tracking-tight text-navy-900 sm:text-[2.125rem]">
        {title}
      </h2>
      <p className="mt-2.5 max-w-[60ch] text-pretty text-[0.9375rem] leading-relaxed text-navy-600 sm:text-base">
        {support}
      </p>
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-express border border-navy-100 bg-white p-5 shadow-express sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor?: string;
  children: ReactNode;
  /** The word for "optional" in the active language, or nothing. */
  optional?: string;
}) {
  /* The optional badge is a sibling of the <label>, not a child of it. The
     form backend derives its export column titles from label text, so nesting
     the badge would export a column called "Kawasan / AreaPilihan". */
  return (
    <div className="mb-2 flex items-baseline gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[0.8125rem] font-bold tracking-wide text-navy-800"
      >
        {children}
      </label>
      {optional ? (
        <span
          aria-hidden
          className="rounded-full bg-ivory-200 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-navy-600"
        >
          {optional}
        </span>
      ) : null}
    </div>
  );
}

/* Tap targets are 56px tall throughout: this journey is mostly thumbs. */
const CONTROL =
  "h-14 w-full rounded-control border-[1.5px] bg-white px-4 text-[0.9375rem] font-medium text-navy-900 transition-all duration-200 [transition-timing-function:var(--ease-out-quart)] placeholder:font-normal placeholder:text-navy-500 focus:outline-none focus:ring-4 focus:ring-champagne-400/25";

export function TextInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  invalid = false,
  describedBy,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal";
  autoComplete?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      inputMode={inputMode}
      autoComplete={autoComplete}
      value={value}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
      className={`${CONTROL} ${
        invalid
          ? "border-danger focus:border-danger focus:ring-danger/20"
          : "border-navy-200 hover:border-navy-300 focus:border-champagne-500"
      }`}
    />
  );
}

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  lang,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  /** Canonical value plus a label per language. */
  options: { value: string; ms: string; en: string }[];
  lang: Lang;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL} cursor-pointer appearance-none border-navy-200 pr-12 hover:border-navy-300 focus:border-champagne-500`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option[lang]}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-ivory-200 text-navy-600"
      >
        <svg viewBox="0 0 20 20" className="size-4">
          <path
            d="M5.5 8l4.5 4.5L14.5 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

function CheckBadge() {
  return (
    <span
      aria-hidden
      className="absolute right-2.5 top-2.5 z-10 flex size-6 items-center justify-center rounded-full bg-champagne-500 text-white shadow-[0_2px_8px_rgb(167_122_32_/_0.5)]"
    >
      <svg viewBox="0 0 14 14" className="size-3.5">
        <path
          d="M3 7.3l2.8 2.8L11 4.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const TILE_BASE =
  "group relative cursor-pointer overflow-hidden rounded-express border-[1.5px] text-center transition-all duration-300 [transition-timing-function:var(--ease-out-quart)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-champagne-400/30";

/**
 * A home-type tile showing the actual design rather than an emoji. Backed by
 * a real radio input: arrow-key navigation, screen-reader grouping and
 * backend field detection all come for free, and the field name exists in the
 * exported HTML where the form backend can find it.
 */
export function PhotoTile({
  name,
  value,
  checked,
  onChange,
  label,
  photo,
  alt,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  photo?: string;
  alt: string;
}) {
  return (
    <label
      className={`${TILE_BASE} block ${
        checked
          ? "border-champagne-500 shadow-express-lg"
          : "border-navy-200 hover:border-navy-300 hover:shadow-express"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {checked ? <CheckBadge /> : null}
      <span className="block aspect-[4/3] overflow-hidden bg-navy-100">
        {photo ? (
          <img
            src={photo}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`size-full object-cover transition-transform duration-500 [transition-timing-function:var(--ease-out-quart)] ${
              checked ? "scale-105" : "group-hover:scale-105"
            }`}
          />
        ) : (
          /* "Not sure yet" has no photo on purpose: it is a different kind of
             answer, and inventing a house for it would misrepresent it. */
          <span className="flex size-full items-center justify-center bg-ivory-200">
            <svg viewBox="0 0 32 32" className="size-12 text-navy-300 sm:size-14">
              <path
                d="M11.5 12a4.5 4.5 0 119 .2c0 2.6-3.6 3.3-3.6 6.3M16 24.4v.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </span>
      <span
        className={`block px-2 py-3 text-[0.8125rem] font-bold leading-tight transition-colors duration-200 sm:text-sm ${
          checked ? "bg-champagne-50 text-navy-900" : "bg-white text-navy-700"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

const CONSULT_ICONS: Record<string, ReactNode> = {
  "Phone Call": (
    <path
      d="M7.5 4h3l1.5 4-2 1.5a12 12 0 005.5 5.5L17 13l4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 015.5 6.2 2 2 0 017.5 4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "Zoom / Online": (
    <>
      <rect
        x="2.5"
        y="5"
        width="19"
        height="13"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 21.5h7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  "Meet-Up": (
    <>
      <circle cx="9" cy="8.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.8" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 19.5a5.5 5.5 0 0111 0M15.5 15.2a4.6 4.6 0 015 4.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
};

export function IconTile({
  name,
  value,
  checked,
  onChange,
  label,
  note,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  note: string;
}) {
  return (
    <label
      className={`${TILE_BASE} flex flex-col items-center justify-start gap-2 p-4 sm:p-5 ${
        checked
          ? "border-champagne-500 bg-champagne-50 shadow-express-lg"
          : "border-navy-200 bg-white hover:border-navy-300 hover:shadow-express"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {checked ? <CheckBadge /> : null}
      <span
        aria-hidden
        className={`flex size-11 items-center justify-center rounded-full transition-colors duration-300 sm:size-12 ${
          checked ? "bg-navy-900 text-champagne-300" : "bg-ivory-200 text-navy-600"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-5 sm:size-[1.375rem]">
          {CONSULT_ICONS[value]}
        </svg>
      </span>
      <span
        className={`text-[0.8125rem] font-bold leading-tight sm:text-sm ${
          checked ? "text-navy-900" : "text-navy-700"
        }`}
      >
        {label}
      </span>
      <span className="text-[0.6875rem] leading-tight text-navy-500">{note}</span>
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-1.5 text-[0.8125rem] font-semibold text-danger"
    >
      <svg aria-hidden viewBox="0 0 16 16" className="mt-px size-4 shrink-0">
        <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8 4.8v3.6M8 11v.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {children}
    </p>
  );
}

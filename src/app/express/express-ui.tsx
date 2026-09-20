"use client";

import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
   Express UI primitives.

   Deliberately local to /express rather than added to src/components/ui: this
   module carries its own navy/champagne register and is meant to lift cleanly
   into the full platform later. Nothing here is shared with the main portal.
   -------------------------------------------------------------------------- */

export const STEPS = [
  { id: "tanah", index: "01", label: "Tanah" },
  { id: "rumah", index: "02", label: "Rumah" },
  { id: "finance", index: "03", label: "Finance" },
  { id: "guide", index: "04", label: "Guide" },
  { id: "done", index: "05", label: "Done" },
];

/**
 * The progress rail. Its job is psychological, not navigational — it tells a
 * customer arriving from an ad that this is five short steps, not a mortgage
 * application. Five thin bars read as progress at 390px where five labelled
 * chips would not.
 */
export function ProgressRail({ activeIndex }: { activeIndex: number }) {
  return (
    <nav aria-label="Langkah perjalanan" className="w-full">
      <ol className="flex items-start gap-1.5 sm:gap-3">
        {STEPS.map((step, i) => {
          const reached = i <= activeIndex;
          return (
            <li key={step.id} className="min-w-0 flex-1">
              <span
                aria-hidden
                className={`block h-[3px] rounded-full transition-colors duration-500 ${
                  reached ? "bg-champagne-500" : "bg-navy-200"
                }`}
              />
              <span className="mt-2 flex items-baseline gap-1 sm:gap-1.5">
                <span
                  className={`text-[0.5625rem] font-bold tabular-nums transition-colors duration-500 sm:text-[0.625rem] ${
                    reached ? "text-champagne-600" : "text-navy-300"
                  }`}
                >
                  {step.index}
                </span>
                <span
                  className={`truncate text-[0.5625rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-500 sm:text-[0.625rem] sm:tracking-[0.14em] ${
                    reached ? "text-navy-800" : "text-navy-300"
                  }`}
                >
                  {step.label}
                </span>
              </span>
              {i === activeIndex ? <span className="sr-only">(langkah semasa)</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
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
      <p className="flex items-center gap-2.5">
        <span className="text-[0.6875rem] font-bold tracking-[0.18em] text-champagne-600">
          {index}
        </span>
        <span aria-hidden className="h-px w-6 bg-champagne-300" />
      </p>
      <h2 className="mt-2.5 font-display text-[1.5rem] leading-tight tracking-tight text-navy-900 sm:text-[1.875rem]">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-navy-500">
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
      className={`rounded-express border border-navy-100 bg-white p-5 shadow-express sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  /* The "Pilihan" badge is a sibling of the <label>, not a child of it. The
     form backend derives its column titles from label text, so nesting the
     badge would export a column called "Kawasan / AreaPilihan". */
  return (
    <div className="mb-2 flex items-baseline gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[0.8125rem] font-semibold tracking-wide text-navy-800"
      >
        {children}
      </label>
      {optional ? (
        <span
          aria-hidden
          className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-navy-300"
        >
          Pilihan
        </span>
      ) : null}
    </div>
  );
}

/* Tap targets are 52px tall throughout — this journey is mostly thumbs. */
const CONTROL =
  "h-[3.25rem] w-full rounded-control border bg-white px-4 text-[0.9375rem] text-navy-900 transition-colors duration-150 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-champagne-400/50";

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
          ? "border-danger focus:border-danger"
          : "border-navy-200 focus:border-champagne-400"
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
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL} appearance-none border-navy-200 pr-11 focus:border-champagne-400`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-navy-400"
      >
        <path
          d="M5 8l5 5 5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * A selectable tile backed by a real radio input. The radio is visually
 * hidden rather than replaced by a div-with-onClick, so arrow-key navigation,
 * screen-reader grouping and native form semantics all come for free — and so
 * the field name exists in the exported HTML for the form backend to detect.
 */
export function Tile({
  name,
  value,
  checked,
  onChange,
  icon,
  label,
  note,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  icon: string;
  label: string;
  note?: string;
}) {
  return (
    <label
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-express border p-4 text-center transition-all duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-champagne-400/60 sm:p-5 ${
        checked
          ? "border-champagne-400 bg-champagne-50 shadow-express"
          : "border-navy-200 bg-white hover:border-navy-300 hover:bg-ivory-50"
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
      <span
        aria-hidden
        className={`text-[1.375rem] leading-none transition-transform duration-150 sm:text-[1.625rem] ${
          checked ? "scale-105" : "group-hover:scale-105"
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-[0.8125rem] font-semibold leading-tight sm:text-sm ${
          checked ? "text-navy-900" : "text-navy-700"
        }`}
      >
        {label}
      </span>
      {note ? (
        <span className="text-[0.6875rem] leading-tight text-navy-400">{note}</span>
      ) : null}
      {checked ? (
        <span
          aria-hidden
          className="absolute right-2.5 top-2.5 flex size-4 items-center justify-center rounded-full bg-champagne-500 text-white"
        >
          <svg viewBox="0 0 12 12" className="size-2.5">
            <path
              d="M2.5 6.2l2.4 2.4 4.6-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-[0.8125rem] font-medium text-danger">
      {children}
    </p>
  );
}

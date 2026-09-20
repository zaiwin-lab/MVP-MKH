"use client";

import type { ReactNode } from "react";
import { COPY, LANGS, type Lang } from "@/lib/i18n";

/* --------------------------------------------------------------------------
   Express UI primitives — dark chrome register.

   Local to /express rather than added to src/components/ui: this module runs
   drenched navy with glass panels, where the main portal runs light. Nothing
   here is shared with it.
   -------------------------------------------------------------------------- */

export const STEP_IDS = ["tanah", "rumah", "finance", "guide", "done"] as const;

/* --------------------------------------------------------------------------
   Icons. Drawn at 24x24 on a 1.7px stroke so they hold their weight against
   the glass without turning into blobs at tile size.
   -------------------------------------------------------------------------- */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const ICONS: Record<string, ReactNode> = {
  "1 Tingkat": (
    <>
      <path d="M3 10.5L12 4l9 6.5" {...STROKE} />
      <path d="M5.5 9.6V20h13V9.6" {...STROKE} />
      <path d="M10 20v-5h4v5" {...STROKE} />
    </>
  ),
  "2 Tingkat": (
    <>
      <path d="M3 9L12 3l9 6" {...STROKE} />
      <path d="M5.5 8.2V21h13V8.2" {...STROKE} />
      <path d="M5.5 13.5h13" {...STROKE} />
      <path d="M8.5 10.2h2M13.5 10.2h2" {...STROKE} />
      <path d="M10 21v-4h4v4" {...STROKE} />
    </>
  ),
  "Belum Pasti": (
    <>
      <circle cx="12" cy="12" r="8.8" {...STROKE} />
      <path d="M9.4 9.6a2.7 2.7 0 015.3.6c0 1.8-2.6 2.2-2.6 4" {...STROKE} />
      <path d="M12 17.4v.1" {...STROKE} />
    </>
  ),
  "Phone Call": (
    <path
      d="M7.5 4h3l1.5 4-2 1.5a12 12 0 005.5 5.5L17 13l4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 015.5 6.2 2 2 0 017.5 4z"
      {...STROKE}
    />
  ),
  "Zoom / Online": (
    <>
      <rect x="2.6" y="5" width="18.8" height="12.6" rx="2.4" {...STROKE} />
      <path d="M8.5 21h7M12 17.6V21" {...STROKE} />
    </>
  ),
  "Meet-Up": (
    <>
      <circle cx="9" cy="8.4" r="3.1" {...STROKE} />
      <circle cx="16.9" cy="9.9" r="2.3" {...STROKE} />
      <path d="M3.6 19.4a5.4 5.4 0 0110.8 0M15.6 15.2a4.5 4.5 0 014.8 4.2" {...STROKE} />
    </>
  ),
  land: (
    <>
      <path d="M3 8.5l6-3 6 3 6-3v10l-6 3-6-3-6 3z" {...STROKE} />
      <path d="M9 5.5v10M15 8.5v10" {...STROKE} />
    </>
  ),
  wallet: (
    <>
      <rect x="2.8" y="5.8" width="18.4" height="13" rx="2.6" {...STROKE} />
      <path d="M2.8 10h18.4" {...STROKE} />
      <circle cx="17" cy="14.5" r="1.3" {...STROKE} />
    </>
  ),
  guide: (
    <>
      <path d="M12 3.2l2.5 5.3 5.8.8-4.2 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.2-4 5.8-.8z" {...STROKE} />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.6" {...STROKE} />
      <path d="M4.8 20a7.2 7.2 0 0114.4 0" {...STROKE} />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" {...STROKE} strokeWidth={2.2} />,
  spark: (
    <>
      <path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7z" {...STROKE} />
      <path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" {...STROKE} />
    </>
  ),
  arrow: <path d="M4 12h15M13.5 6.5L20 12l-6.5 5.5" {...STROKE} strokeWidth={2} />,
};

export function Icon({
  name,
  className = "size-5",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      {ICONS[name]}
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Chrome
   -------------------------------------------------------------------------- */

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
                    ? "bg-champagne-300 shadow-[0_0_10px_rgb(217_184_119_/_0.55)]"
                    : "bg-white/14"
                }`}
              />
              <span
                className={`mt-2 block truncate text-[0.625rem] font-bold uppercase tracking-[0.08em] transition-colors duration-500 sm:text-[0.6875rem] sm:tracking-[0.12em] ${
                  current
                    ? "text-white"
                    : reached
                      ? "text-champagne-200"
                      : "text-navy-300"
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
      className="flex shrink-0 items-center rounded-full border border-white/12 bg-white/6 p-0.5 backdrop-blur-md"
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
                ? "gold-chrome text-navy-950"
                : "text-navy-200 hover:text-white"
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
  icon,
  title,
  support,
}: {
  index: string;
  icon: string;
  title: string;
  support: string;
}) {
  return (
    <header className="mb-5 sm:mb-7">
      <div className="flex items-center gap-3">
        <span className="chrome-panel flex size-10 shrink-0 items-center justify-center rounded-2xl text-champagne-200 sm:size-11">
          <Icon name={icon} className="size-5 sm:size-[1.375rem]" />
        </span>
        <span className="text-[0.6875rem] font-bold tabular-nums tracking-[0.18em] text-champagne-300">
          {index}
        </span>
        <span aria-hidden className="chrome-rule h-px flex-1" />
      </div>
      <h2 className="mt-4 text-balance font-display text-[1.625rem] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[2.125rem]">
        {title}
      </h2>
      <p className="mt-2.5 max-w-[60ch] text-pretty text-[0.9375rem] leading-relaxed text-navy-200 sm:text-base">
        {support}
      </p>
    </header>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`chrome-panel rounded-express-lg p-5 sm:p-7 ${className}`}
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
  optional?: string;
}) {
  /* The optional badge is a sibling of the <label>, not a child of it. The
     form backend derives its export column titles from label text, so nesting
     the badge would export a column called "Kawasan / AreaPilihan". */
  return (
    <div className="mb-2 flex items-baseline gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[0.8125rem] font-bold tracking-wide text-white"
      >
        {children}
      </label>
      {optional ? (
        <span
          aria-hidden
          className="rounded-full border border-white/10 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-navy-200"
        >
          {optional}
        </span>
      ) : null}
    </div>
  );
}

/* Tap targets are 56px throughout: this journey is mostly thumbs. */
const CONTROL =
  "chrome-field h-14 w-full rounded-control px-4 text-[0.9375rem] font-medium text-white transition-all duration-200 [transition-timing-function:var(--ease-out-quart)] placeholder:font-normal placeholder:text-navy-300 hover:border-white/20 focus:border-champagne-300 focus:outline-none focus:ring-4 focus:ring-champagne-300/25";

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
      className={`${CONTROL} ${invalid ? "border-danger-300! focus:ring-danger-300/25!" : ""}`}
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
        className={`${CONTROL} cursor-pointer appearance-none pr-12`}
      >
        {options.map((option) => (
          /* The native menu paints on the OS surface, so its colours are set
             here rather than inherited from the dark field. */
          <option key={option.value} value={option.value} className="bg-navy-900 text-white">
            {option[lang]}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/6 text-champagne-200"
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

/**
 * A selectable tile backed by a real radio input: arrow-key navigation,
 * screen-reader grouping and backend field detection all come for free, and
 * the field name exists in the exported HTML where the form backend finds it.
 */
export function ChoiceTile({
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
  note?: string;
}) {
  return (
    <label
      className={`group relative flex cursor-pointer flex-col items-center justify-start gap-2 rounded-express px-2 py-4 text-center transition-all duration-300 [transition-timing-function:var(--ease-out-quart)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-champagne-300/35 sm:px-3 sm:py-5 ${
        checked ? "chrome-panel-lit" : "chrome-panel hover:border-white/20"
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
      {checked ? (
        <span
          aria-hidden
          className="gold-chrome absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full text-navy-950"
        >
          <svg viewBox="0 0 24 24" className="size-3">
            {ICONS.check}
          </svg>
        </span>
      ) : null}
      <span
        aria-hidden
        className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 sm:size-14 ${
          checked
            ? "bg-champagne-300/18 text-champagne-200"
            : "bg-white/6 text-navy-100 group-hover:text-white"
        }`}
      >
        <Icon name={value} className="size-6 sm:size-7" />
      </span>
      <span
        className={`text-[0.8125rem] font-bold leading-tight sm:text-sm ${
          checked ? "text-white" : "text-navy-100"
        }`}
      >
        {label}
      </span>
      {note ? (
        <span className="text-[0.6875rem] leading-tight text-navy-200">{note}</span>
      ) : null}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-1.5 text-[0.8125rem] font-semibold text-danger-300"
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

/** The primary action: polished gold with a highlight travelling across it. */
export function PrimaryButton({
  children,
  type = "button",
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`gold-chrome group relative isolate overflow-hidden rounded-control font-bold text-navy-950 transition-[filter,transform] duration-200 [transition-timing-function:var(--ease-out-quart)] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <span
        aria-hidden
        className="sweep pointer-events-none absolute inset-y-0 -z-10 w-1/4 bg-white/35 blur-md"
      />
      {children}
    </button>
  );
}

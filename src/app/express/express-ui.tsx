"use client";

import type { ReactNode } from "react";
import { COPY, LANGS, type Lang } from "@/lib/i18n";
import { useExTheme } from "@/lib/ex-theme";

/* --------------------------------------------------------------------------
   Express UI primitives.

   Colour comes from the semantic `ex-*` classes in globals.css, never from
   Tailwind palette utilities: those are fixed at build time and would pin the
   component to one theme. Anything that must flip between dark and bright
   reads a custom property instead.

   Type is set one notch lighter and one notch larger than a dark UI first
   suggests. Bold small text on a dark ground blooms and reads as heavy, so
   labels are 14px semibold rather than 13px bold.
   -------------------------------------------------------------------------- */

export const STEP_IDS = ["tanah", "rumah", "finance", "guide", "done"] as const;

/* --------------------------------------------------------------------------
   Icons, drawn at 24x24 on a 1.7px stroke so they hold their weight at tile
   size without turning into blobs.
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
    <path
      d="M12 3.2l2.5 5.3 5.8.8-4.2 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.2-4 5.8-.8z"
      {...STROKE}
    />
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
  moon: <path d="M20 14.2A8.4 8.4 0 019.8 4 8.4 8.4 0 1020 14.2z" {...STROKE} />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" {...STROKE} />
      <path
        d="M12 2.6v2.2M12 19.2v2.2M4.4 12H2.2M21.8 12h-2.2M6.3 6.3L4.8 4.8M19.2 19.2l-1.5-1.5M6.3 17.7l-1.5 1.5M19.2 4.8l-1.5 1.5"
        {...STROKE}
      />
    </>
  ),
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
   Frames and rules
   -------------------------------------------------------------------------- */

/**
 * Drafting-style corner marks. Four short L-shapes rather than a full border,
 * so a panel reads as framed without gaining a second outline.
 */
export function CornerMarks() {
  const shared =
    "corner-mark pointer-events-none absolute size-3.5 sm:size-4";
  return (
    <span aria-hidden>
      <span className={`${shared} left-2.5 top-2.5 border-l border-t`} />
      <span className={`${shared} right-2.5 top-2.5 border-r border-t`} />
      <span className={`${shared} bottom-2.5 left-2.5 border-b border-l`} />
      <span className={`${shared} bottom-2.5 right-2.5 border-b border-r`} />
    </span>
  );
}

/** A hairline with a lit node at its centre, used between sections. */
export function SectionDivider() {
  return (
    <div aria-hidden className="flex items-center justify-center py-2">
      <span className="chrome-rule h-px flex-1" />
      <span className="mx-3 flex items-center gap-1.5">
        <span className="chrome-node size-1 rounded-full opacity-70" />
        <span className="chrome-node size-1.5 rounded-full" />
        <span className="chrome-node size-1 rounded-full opacity-70" />
      </span>
      <span className="chrome-rule h-px flex-1" />
    </div>
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
                    ? "bg-champagne-400 shadow-[0_0_10px_rgb(194_151_66_/_0.5)]"
                    : "ex-chip"
                }`}
              />
              <span
                className={`mt-2 block truncate text-[0.6875rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-500 sm:text-[0.75rem] ${
                  current ? "ex-ink" : reached ? "ex-accent" : "ex-dim"
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
      className="ex-border ex-chip flex shrink-0 items-center rounded-full border p-0.5 backdrop-blur-md"
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
            className={`min-h-9 rounded-full px-3 py-2 text-[0.75rem] font-bold tracking-wide transition-colors duration-200 ${
              active ? "gold-chrome text-navy-950" : "ex-soft hover:opacity-80"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

/** Dark or bright. Reads the attribute on <html>, which an inline script set. */
export function ThemeToggle({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [theme, setTheme] = useExTheme();
  const next = theme === "dark" ? "bright" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${t.themeLabel}: ${theme === "dark" ? t.themeDark : t.themeBright}`}
      title={next === "bright" ? t.themeBright : t.themeDark}
      className="ex-border ex-chip ex-soft flex size-10 shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-200 hover:opacity-80"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} className="size-[1.125rem]" />
    </button>
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
        <span className="chrome-panel ex-accent flex size-11 shrink-0 items-center justify-center rounded-2xl sm:size-12">
          <Icon name={icon} className="size-[1.375rem] sm:size-6" />
        </span>
        <span className="ex-accent text-[0.75rem] font-bold tabular-nums tracking-[0.18em]">
          {index}
        </span>
        <span aria-hidden className="chrome-rule h-px flex-1" />
      </div>
      <h2 className="ex-ink display-lg mt-4 text-balance text-[1.875rem] sm:text-[2.375rem]">
        {title}
      </h2>
      <p className="ex-soft mt-2.5 max-w-[62ch] text-pretty text-[1rem] leading-relaxed sm:text-[1.0625rem]">
        {support}
      </p>
    </header>
  );
}

export function Panel({
  children,
  framed = true,
  className = "",
}: {
  children: ReactNode;
  framed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`chrome-panel relative rounded-express-lg p-5 sm:p-7 ${className}`}
    >
      {framed ? <CornerMarks /> : null}
      {children}
    </div>
  );
}

export function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="ex-ink mb-2 block text-[0.875rem] font-semibold tracking-wide"
    >
      {children}
    </label>
  );
}

/* Tap targets are 56px throughout: this journey is mostly thumbs. */
const CONTROL =
  "chrome-field ex-ink h-14 w-full rounded-control px-4 text-[1rem] font-medium transition-all duration-200 [transition-timing-function:var(--ease-out-quart)] focus:border-champagne-300 focus:outline-none focus:ring-4 focus:ring-champagne-300/25";

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
      className={`${CONTROL} ${invalid ? "border-danger-400!" : ""}`}
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
          <option key={option.value} value={option.value}>
            {option[lang]}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="ex-accent ex-border pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border"
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
        checked ? "chrome-panel-lit" : "chrome-panel"
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
          checked ? "ex-accent-wash ex-accent" : "ex-chip ex-soft"
        }`}
      >
        <Icon name={value} className="size-6 sm:size-7" />
      </span>
      <span
        className={`text-[0.875rem] font-semibold leading-tight sm:text-[0.9375rem] ${
          checked ? "ex-ink" : "ex-soft"
        }`}
      >
        {label}
      </span>
      {note ? <span className="ex-dim text-[0.75rem] leading-tight">{note}</span> : null}
    </label>
  );
}

/* --------------------------------------------------------------------------
   Marketing furniture
   -------------------------------------------------------------------------- */

/** Small gold label above a section heading. One per band, never per block. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="ex-accent text-[0.75rem] font-bold uppercase tracking-[0.2em]">
      {children}
    </p>
  );
}

/** Outlined pill with a lit dot, as used above the hero headline. */
export function PillBadge({ children }: { children: ReactNode }) {
  return (
    <p className="ex-accent ex-border inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] sm:text-[0.75rem]">
      <span aria-hidden className="size-1.5 rounded-full bg-champagne-400" />
      {children}
    </p>
  );
}

/**
 * A bento cell. `wide` spans two columns on desktop, which is what stops the
 * grid reading as four identical boxes.
 */
export function BentoCard({
  icon,
  title,
  body,
  wide = false,
  tinted = false,
}: {
  icon: string;
  title: string;
  body: string;
  wide?: boolean;
  tinted?: boolean;
}) {
  return (
    <div
      className={`chrome-panel relative flex flex-col rounded-express-lg p-6 sm:p-7 ${
        wide ? "lg:col-span-2" : ""
      } ${tinted ? "ex-accent-wash" : ""}`}
    >
      <span className="ex-chip ex-accent mb-5 flex size-12 items-center justify-center rounded-2xl">
        <Icon name={icon} className="size-6" />
      </span>
      <h3 className="ex-ink display-md text-[1.125rem] sm:text-[1.25rem]">{title}</h3>
      <p className="ex-soft mt-2.5 text-pretty text-[0.9375rem] leading-relaxed">{body}</p>
    </div>
  );
}

/** A process card carrying its own number as a badge over the icon tile. */
export function StepCard({
  index,
  icon,
  title,
  body,
}: {
  index: number;
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <li className="chrome-panel relative flex flex-col rounded-express-lg p-6 text-center sm:p-7">
      <span className="relative mx-auto mb-5">
        <span className="ex-chip ex-accent flex size-14 items-center justify-center rounded-2xl">
          <Icon name={icon} className="size-7" />
        </span>
        <span className="gold-chrome absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full text-[0.6875rem] font-bold tabular-nums text-navy-950">
          {index}
        </span>
      </span>
      <h3 className="ex-ink display-md text-[1.0625rem] sm:text-[1.125rem]">{title}</h3>
      <p className="ex-soft mt-2.5 text-pretty text-[0.9375rem] leading-relaxed">{body}</p>
    </li>
  );
}

/**
 * The hero's product preview. It shows a real calculator result rather than a
 * decorative shape, and says plainly that it is an example so nobody reads it
 * as their own number.
 */
export function PreviewCard({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <figure className="chrome-panel relative overflow-hidden rounded-express-lg p-5 sm:p-6">
      <span aria-hidden className="mb-5 flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </span>
      <figcaption className="ex-dim text-[0.6875rem] font-bold uppercase tracking-[0.16em]">
        {t.mockTitle}
      </figcaption>
      <p className="ex-accent display-lg mt-2.5 text-[1.5rem] sm:text-[1.875rem]">
        {t.mockRange}
      </p>
      <dl className="mt-5 space-y-2.5">
        {t.mockRows.map((row) => (
          <div
            key={row.label}
            className="ex-border flex items-center justify-between gap-4 border-b pb-2.5 text-[0.875rem] last:border-b-0"
          >
            <dt className="ex-soft">{row.label}</dt>
            <dd className="ex-ink font-bold">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="ex-dim mt-4 text-[0.75rem] leading-relaxed">{t.mockFoot}</p>
    </figure>
  );
}

/** Footer language pills, as on the reference site. */
export function LangPills({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
}) {
  return (
    <div role="group" aria-label={COPY[lang].langLabel} className="flex items-center gap-2">
      {LANGS.map((entry) => {
        const active = entry.code === lang;
        return (
          <button
            key={entry.code}
            type="button"
            onClick={() => onChange(entry.code)}
            aria-pressed={active}
            className={`min-h-9 rounded-full px-4 py-2 text-[0.75rem] font-bold tracking-wide transition-colors duration-200 ${
              active ? "gold-chrome text-navy-950" : "ex-chip ex-soft hover:opacity-80"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="ex-danger mt-2 flex items-start gap-1.5 text-[0.875rem] font-semibold">
      <svg aria-hidden viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0">
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

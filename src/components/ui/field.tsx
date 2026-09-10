import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

const CONTROL =
  "w-full rounded-control border border-parchment-300 bg-white px-3.5 text-sm text-ink-800 placeholder:text-ink-300 transition-colors focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 disabled:bg-parchment-100";

export function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[0.8125rem] font-semibold text-ink-800"
    >
      {children}
      {required && (
        <span className="ml-1 text-danger" aria-hidden>
          *
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  );
}

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-ink-400">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  className = "",
  invalid,
  ...rest
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={`${CONTROL} h-11 ${invalid ? "border-danger focus:border-danger focus:ring-red-100" : ""} ${className}`}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export function SelectInput({
  className = "",
  invalid,
  children,
  ...rest
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        className={`${CONTROL} h-11 appearance-none pr-10 ${invalid ? "border-danger" : ""} ${className}`}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
      />
    </div>
  );
}

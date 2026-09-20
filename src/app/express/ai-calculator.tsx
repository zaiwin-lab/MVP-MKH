"use client";

import { useEffect, useRef, useState } from "react";
import {
  INDICATIVE_RATE,
  calculateEligibility,
  formatRM,
} from "@/lib/eligibility";
import { COPY, type Lang } from "@/lib/i18n";
import { PrimaryButton } from "./express-ui";

/* --------------------------------------------------------------------------
   Optional 60-second financing estimate.

   Three deliberate constraints:
     1. It never blocks the journey. It is a dialog over the page; closing it
        leaves the form exactly as it was.
     2. The numbers are real. This calls the same DSR model the main portal
        uses — no invented "AI approval", because a customer who is told they
        qualify and is later refused has been misled by us, not by a bank.
     3. It lives outside the <form>. Nested forms are invalid HTML and would
        break the lead submission.
   -------------------------------------------------------------------------- */

/** Midpoint of the selected financing band, used to assess their target DSR. */
const TARGET_BUDGET: Record<string, number> = {
  "Below RM200K": 180_000,
  "RM200K – RM400K": 300_000,
  "RM400K – RM600K": 500_000,
  "RM600K – RM800K": 700_000,
  "Belum Pasti": 300_000,
};

const TENURE_YEARS = 30;

export function AiCalculator({
  open,
  onClose,
  financingTarget,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  financingTarget: string;
  lang: Lang;
}) {
  const t = COPY[lang];
  const [income, setIncome] = useState("");
  const [commitments, setCommitments] = useState("");
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const incomeValue = Number(income) || 0;
  const commitmentsValue = Number(commitments) || 0;
  const ageValue = Number(age) || 0;
  const ready = incomeValue > 0 && ageValue >= 18 && ageValue <= 65;

  const result =
    submitted && ready
      ? calculateEligibility({
          monthlyIncome: incomeValue,
          existingCommitments: commitmentsValue,
          age: ageValue,
          preferredBudget: TARGET_BUDGET[financingTarget] ?? 300_000,
          financingPeriodYears: TENURE_YEARS,
        })
      : null;

  return (
    <div
      className="fixed inset-0 z-(--z-modal) flex items-end justify-center bg-navy-950/85 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-calc-title"
        className="chrome-panel express-ground max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-express-lg p-6 sm:rounded-express-lg sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-champagne-300">
              {t.calcKicker}
            </p>
            <h2
              id="ai-calc-title"
              className="mt-1.5 font-display text-[1.5rem] font-bold leading-tight text-white"
            >
              {t.calcTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.calcCloseLabel}
            className="-mr-1.5 -mt-1.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 20 20" className="size-5">
              <path
                d="M5 5l10 10M15 5L5 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[0.875rem] leading-relaxed text-navy-200">
          {t.calcIntro}
        </p>

        <div className="mt-6 space-y-4">
          <CalcField
            id="calc-income"
            label={t.calcIncome}
            value={income}
            onChange={setIncome}
            placeholder={t.calcIncomePlaceholder}
            inputRef={firstFieldRef}
          />
          <CalcField
            id="calc-commitments"
            label={t.calcCommitments}
            value={commitments}
            onChange={setCommitments}
            placeholder={t.calcCommitmentsPlaceholder}
          />
          <CalcField
            id="calc-age"
            label={t.calcAge}
            value={age}
            onChange={setAge}
            placeholder={t.calcAgePlaceholder}
          />
        </div>

        {submitted && !ready ? (
          <p className="mt-4 text-[0.8125rem] font-semibold text-danger-300">
            {t.calcInvalid}
          </p>
        ) : null}

        {result ? (
          <div className="chrome-panel-lit mt-6 rounded-express p-5">
            {result.overCommitted ? (
              <p className="text-[0.9375rem] font-semibold leading-relaxed text-white">
                {t.calcOverCommitted}
              </p>
            ) : (
              <>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-champagne-700">
                  {t.calcResultLabel}
                </p>
                <p className="mt-2 font-display text-[1.75rem] font-bold leading-tight text-champagne-200 sm:text-[2rem]">
                  {formatRM(result.lowerFinancing)} &ndash;{" "}
                  {formatRM(result.upperFinancing)}
                </p>
                <dl className="mt-4 space-y-1.5 text-[0.8125rem] text-navy-200">
                  <div className="flex justify-between gap-4">
                    <dt>{t.calcInstalment}</dt>
                    <dd className="font-bold text-white">
                      {formatRM(result.indicativeInstalment)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t.calcTenure}</dt>
                    <dd className="font-bold text-white">
                      {result.effectiveTenureYears} {t.calcYears}
                      {result.tenureWasCapped ? ` (${t.calcAgeCapped})` : ""}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t.calcTargetLabel(financingTarget)}</dt>
                    <dd className="font-bold text-white">
                      {result.budgetAssessment === "comfortable"
                        ? t.calcComfortable
                        : result.budgetAssessment === "within"
                          ? t.calcWithin
                          : t.calcStretched}
                    </dd>
                  </div>
                </dl>
              </>
            )}
            <p className="mt-4 border-t border-white/12 pt-3 text-[0.75rem] leading-relaxed text-navy-200">
              {t.calcDisclaimer(INDICATIVE_RATE, TENURE_YEARS)}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
          <PrimaryButton
            onClick={() => setSubmitted(true)}
            className="h-14 flex-1 text-[0.9375rem]"
          >
            {result ? t.calcRerun : t.calcRun}
          </PrimaryButton>
          <button
            type="button"
            onClick={onClose}
            className="h-14 rounded-control border border-white/14 px-6 text-[0.9375rem] font-bold text-navy-100 transition-colors duration-200 hover:bg-white/8 hover:text-white sm:flex-none"
          >
            {result ? t.calcDone : t.calcClose}
          </button>
        </div>
      </div>
    </div>
  );
}

function CalcField({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputRef,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.8125rem] font-bold tracking-wide text-white"
      >
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
        className="chrome-field h-14 w-full rounded-control px-4 text-[0.9375rem] font-medium text-white transition-colors duration-200 placeholder:font-normal placeholder:text-navy-300 hover:border-white/20 focus:border-champagne-300 focus:outline-none focus:ring-4 focus:ring-champagne-300/25"
      />
    </div>
  );
}

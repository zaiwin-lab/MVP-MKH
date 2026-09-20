"use client";

import { useEffect, useRef, useState } from "react";
import {
  INDICATIVE_RATE,
  MAX_TENURE_YEARS,
  calculateEligibility,
  formatRM,
} from "@/lib/eligibility";
import { COPY, type Lang } from "@/lib/i18n";
import { PrimaryButton } from "./express-ui";

/* --------------------------------------------------------------------------
   Optional financing estimate.

   Three constraints hold whatever else changes here:
     1. It never blocks the journey. Closing it leaves the form as it was.
     2. The numbers are real. This calls the same DSR model the main portal
        uses. A customer told they qualify and later refused has been misled
        by us, not by a bank, so nothing here is invented.
     3. It lives outside the <form>. Nested forms are invalid HTML and would
        break lead submission.
   -------------------------------------------------------------------------- */

/** Midpoint of the selected financing band, used to assess their target DSR. */
const TARGET_BUDGET: Record<string, number> = {
  "Below RM200K": 180_000,
  "RM200K – RM400K": 300_000,
  "RM400K – RM600K": 500_000,
  "RM600K – RM800K": 700_000,
  "Belum Pasti": 300_000,
};

const DEFAULT_TENURE = MAX_TENURE_YEARS;
const TENURE_CHOICES = [10, 15, 20, 25, 30].filter((y) => y <= MAX_TENURE_YEARS);

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
  const [tenure, setTenure] = useState(DEFAULT_TENURE);
  const [isJoint, setIsJoint] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState("");
  const [spouseCommitments, setSpouseCommitments] = useState("");
  const [spouseAge, setSpouseAge] = useState("");
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
  const ageValue = Number(age) || 0;
  const ready = incomeValue > 0 && ageValue >= 18 && ageValue <= 65;

  const result =
    submitted && ready
      ? calculateEligibility({
          monthlyIncome: incomeValue,
          existingCommitments: Number(commitments) || 0,
          age: ageValue,
          preferredBudget: TARGET_BUDGET[financingTarget] ?? 300_000,
          financingPeriodYears: tenure,
          joint: isJoint
            ? {
                monthlyIncome: Number(spouseIncome) || 0,
                existingCommitments: Number(spouseCommitments) || 0,
                age: Number(spouseAge) || 0,
              }
            : undefined,
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
            <p className="ex-accent text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">
              {t.calcKicker}
            </p>
            <h2
              id="ai-calc-title"
              className="ex-ink display-md mt-1.5 text-[1.5rem]"
            >
              {t.calcTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.calcCloseLabel}
            className="ex-soft ex-border -mr-1.5 -mt-1.5 flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-white/10"
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

        <p className="ex-soft mt-3 text-[0.9375rem] leading-relaxed">{t.calcIntro}</p>

        {/* Single or joint. A joint application changes what the numbers mean,
            so it is the first thing asked, not a checkbox at the bottom. */}
        <div className="mt-6">
          <p className="ex-ink mb-2 text-[0.875rem] font-semibold tracking-wide">
            {t.calcJointToggle}
          </p>
          <div role="group" className="grid grid-cols-2 gap-2.5">
            {[
              { value: false, label: t.calcSingle },
              { value: true, label: t.calcJoint },
            ].map((option) => (
              <button
                key={String(option.value)}
                type="button"
                aria-pressed={isJoint === option.value}
                onClick={() => setIsJoint(option.value)}
                className={`h-12 rounded-control text-[0.875rem] font-semibold transition-all duration-200 ${
                  isJoint === option.value
                    ? "chrome-panel-lit ex-ink"
                    : "chrome-field ex-soft hover:ex-border-strong"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {isJoint ? (
            <p className="ex-dim mt-2.5 text-[0.8125rem] leading-relaxed">
              {t.calcJointNote}
            </p>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
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

          {isJoint ? (
            <div className="ex-border space-y-4 rounded-express border border-dashed p-4">
              <CalcField
                id="calc-spouse-income"
                label={t.calcSpouseIncome}
                value={spouseIncome}
                onChange={setSpouseIncome}
                placeholder={t.calcIncomePlaceholder}
              />
              <CalcField
                id="calc-spouse-commitments"
                label={t.calcSpouseCommitments}
                value={spouseCommitments}
                onChange={setSpouseCommitments}
                placeholder={t.calcCommitmentsPlaceholder}
              />
              <CalcField
                id="calc-spouse-age"
                label={t.calcSpouseAge}
                value={spouseAge}
                onChange={setSpouseAge}
                placeholder={t.calcSpouseAgePlaceholder}
              />
            </div>
          ) : null}

          <div>
            <label
              htmlFor="calc-tenure"
              className="ex-ink mb-2 block text-[0.875rem] font-semibold tracking-wide"
            >
              {t.calcTenureLabel}
            </label>
            <div className="relative">
              <select
                id="calc-tenure"
                value={tenure}
                onChange={(event) => setTenure(Number(event.target.value))}
                className="chrome-field ex-ink h-14 w-full cursor-pointer appearance-none rounded-control px-4 pr-12 text-[1rem] font-medium transition-colors duration-200 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/25"
              >
                {TENURE_CHOICES.map((years) => (
                  <option key={years} value={years}>
                    {t.calcTenureYears(years)}
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
          </div>
        </div>

        {submitted && !ready ? (
          <p className="ex-danger mt-4 text-[0.875rem] font-semibold">{t.calcInvalid}</p>
        ) : null}

        {result ? (
          <div className="chrome-panel-lit mt-6 rounded-express p-5">
            {result.overCommitted ? (
              <p className="ex-ink text-[0.9375rem] font-semibold leading-relaxed">
                {t.calcOverCommitted}
              </p>
            ) : (
              <>
                <p className="ex-accent text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
                  {t.calcResultLabel}
                </p>
                <p className="ex-accent display-lg mt-2 text-[1.75rem] sm:text-[2rem]">
                  {formatRM(result.lowerFinancing)} &ndash;{" "}
                  {formatRM(result.upperFinancing)}
                </p>
                {result.isJoint ? (
                  <p className="ex-dim mt-1.5 text-[0.8125rem]">
                    {t.calcJointBasis(formatRM(result.householdIncome))}
                  </p>
                ) : null}
                <dl className="ex-soft mt-4 space-y-2 text-[0.875rem]">
                  <div className="flex justify-between gap-4">
                    <dt>{t.calcInstalment}</dt>
                    <dd className="ex-ink font-bold">
                      {formatRM(result.indicativeInstalment)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t.calcTenure}</dt>
                    <dd className="ex-ink text-right font-bold">
                      {result.effectiveTenureYears} {t.calcYears}
                      {result.tenureCapReason === "age" ? (
                        <span className="ex-dim block text-[0.75rem] font-normal">
                          {t.calcCappedByAge(result.effectiveTenureYears)}
                        </span>
                      ) : null}
                      {result.tenureCapReason === "product" ? (
                        <span className="ex-dim block text-[0.75rem] font-normal">
                          {t.calcCappedByProduct(MAX_TENURE_YEARS)}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t.calcTargetLabel(financingTarget)}</dt>
                    <dd className="ex-ink font-bold">
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
            <p className="ex-dim ex-border mt-4 border-t pt-3 text-[0.75rem] leading-relaxed">
              {t.calcDisclaimer(INDICATIVE_RATE, result.effectiveTenureYears)}
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
            className="ex-soft ex-border h-14 rounded-control border px-6 text-[0.9375rem] font-semibold transition-colors duration-200 hover:bg-white/8 sm:flex-none"
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
        className="ex-ink mb-2 block text-[0.875rem] font-semibold tracking-wide"
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
        className="chrome-field ex-ink h-14 w-full rounded-control px-4 text-[1rem] font-medium transition-colors duration-200 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/25"
      />
    </div>
  );
}

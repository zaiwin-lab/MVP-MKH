"use client";

import { useEffect, useRef, useState } from "react";
import {
  INDICATIVE_RATE,
  calculateEligibility,
  formatRM,
} from "@/lib/eligibility";

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
}: {
  open: boolean;
  onClose: () => void;
  financingTarget: string;
}) {
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-calc-title"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-express bg-white p-6 shadow-express-lg sm:rounded-express sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-champagne-600">
              ANGGARAN AWAL
            </p>
            <h2
              id="ai-calc-title"
              className="mt-1.5 font-display text-[1.375rem] leading-tight text-navy-900"
            >
              AI Financing Calculator
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup kalkulator"
            className="-mr-1.5 -mt-1.5 flex size-10 shrink-0 items-center justify-center rounded-full text-navy-400 transition-colors hover:bg-ivory-200 hover:text-navy-700"
          >
            <svg viewBox="0 0 20 20" className="size-5">
              <path
                d="M5 5l10 10M15 5L5 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[0.875rem] leading-relaxed text-navy-500">
          Isi tiga maklumat ringkas untuk anggaran awal. Ini bukan kelulusan
          pembiayaan.
        </p>

        <div className="mt-6 space-y-4">
          <CalcField
            id="calc-income"
            label="Pendapatan Kasar Bulanan (RM)"
            value={income}
            onChange={setIncome}
            placeholder="Contoh: 5000"
            inputRef={firstFieldRef}
          />
          <CalcField
            id="calc-commitments"
            label="Komitmen Bulanan Sedia Ada (RM)"
            value={commitments}
            onChange={setCommitments}
            placeholder="Contoh: 800 (kereta, PTPTN, kad kredit)"
          />
          <CalcField
            id="calc-age"
            label="Umur Anda"
            value={age}
            onChange={setAge}
            placeholder="Contoh: 32"
          />
        </div>

        {submitted && !ready ? (
          <p className="mt-4 text-[0.8125rem] font-medium text-danger">
            Masukkan pendapatan bulanan dan umur antara 18 hingga 65 untuk
            mendapatkan anggaran.
          </p>
        ) : null}

        {result ? (
          <div className="mt-6 rounded-express border border-champagne-200 bg-champagne-50 p-5">
            {result.overCommitted ? (
              <p className="text-[0.9375rem] font-semibold leading-relaxed text-navy-900">
                Berdasarkan angka ini, komitmen sedia ada anda sudah menggunakan
                sebahagian besar pendapatan. Consultant kami boleh bantu lihat
                pilihan yang ada.
              </p>
            ) : (
              <>
                <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-champagne-700">
                  ANGGARAN PEMBIAYAAN
                </p>
                <p className="mt-2 font-display text-[1.5rem] leading-tight text-navy-900 sm:text-[1.75rem]">
                  {formatRM(result.lowerFinancing)} &ndash;{" "}
                  {formatRM(result.upperFinancing)}
                </p>
                <dl className="mt-4 space-y-1.5 text-[0.8125rem] text-navy-600">
                  <div className="flex justify-between gap-4">
                    <dt>Anggaran ansuran bulanan</dt>
                    <dd className="font-semibold text-navy-900">
                      {formatRM(result.indicativeInstalment)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Tempoh</dt>
                    <dd className="font-semibold text-navy-900">
                      {result.effectiveTenureYears} tahun
                      {result.tenureWasCapped ? " (had umur 70)" : ""}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Sasaran anda ({financingTarget})</dt>
                    <dd className="font-semibold text-navy-900">
                      {result.budgetAssessment === "comfortable"
                        ? "Selesa"
                        : result.budgetAssessment === "within"
                          ? "Dalam julat"
                          : "Agak ketat"}
                    </dd>
                  </div>
                </dl>
              </>
            )}
            <p className="mt-4 border-t border-champagne-200 pt-3 text-[0.75rem] leading-relaxed text-navy-500">
              Anggaran sahaja, berdasarkan kadar indikatif {INDICATIVE_RATE}%
              setahun, margin 90% dan tempoh {TENURE_YEARS} tahun. Bukan
              kelulusan pembiayaan. Keputusan sebenar ditentukan oleh bank.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="champagne-face h-[3.25rem] flex-1 rounded-control text-[0.9375rem] font-semibold text-white transition-[filter] hover:brightness-105 active:brightness-95"
          >
            {result ? "Kira Semula" : "Kira Anggaran Saya"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-[3.25rem] rounded-control border border-navy-200 px-6 text-[0.9375rem] font-semibold text-navy-700 transition-colors hover:bg-ivory-100 sm:flex-none"
          >
            {result ? "Selesai — Teruskan" : "Tutup"}
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
        className="mb-2 block text-[0.8125rem] font-semibold tracking-wide text-navy-800"
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
        className="h-[3.25rem] w-full rounded-control border border-navy-200 bg-white px-4 text-[0.9375rem] text-navy-900 placeholder:text-navy-300 focus:border-champagne-400 focus:outline-none focus:ring-2 focus:ring-champagne-400/50"
      />
    </div>
  );
}

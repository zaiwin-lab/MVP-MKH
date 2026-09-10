"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  FileSearch,
  FileText,
  Handshake,
  Home as HomeIcon,
  Info,
  Leaf,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { ImageSlot } from "@/components/ui/image-slot";
import { Eyebrow, Note, ScriptMark } from "@/components/ui/primitives";
import { FINANCIAL_INSTITUTIONS } from "@/lib/content";
import { calculateEligibility, formatRM, INDICATIVE_RATE, type EligibilityResult } from "@/lib/eligibility";
import { generateReference, useJourney } from "@/lib/journey";

const OWN_BENEFITS = [
  {
    Icon: ShieldCheck,
    title: "Full control of your financial arrangement",
    body: "Use your preferred bank or financial institution",
  },
  {
    Icon: UserRound,
    title: "Flexible and straightforward process",
    body: "Proceed at your own pace",
  },
  {
    Icon: FileText,
    title: "Continue your home ownership journey",
    body: "With our guidance and support",
  },
];

const APPLY_STEPS = [
  {
    Icon: FileText,
    title: "Submit your information securely",
    body: "We will share with your selected financial institution",
  },
  {
    Icon: Search,
    title: "Get a preliminary eligibility assessment",
    body: "Based on the information and documents you provide",
  },
  {
    Icon: HomeIcon,
    title: "Take the next step with confidence",
    body: "Move forward once you receive feedback",
  },
];

const TRUST = [
  { Icon: HomeIcon, title: "A Home Within Reach", body: "More Malaysians, Brighter Tomorrows" },
  { Icon: Handshake, title: "Trusted Partnerships", body: "Reputable Financial Institutions" },
  { Icon: FileText, title: "Simple and Transparent", body: "Clear Steps, No Guesswork" },
  { Icon: Leaf, title: "Support at Every Step", body: "From Planning to Home Ownership" },
];

const AGES = Array.from({ length: 48 }, (_, i) => 18 + i);
const PERIODS = [10, 15, 20, 25, 30, 35];

export default function FinancingPage() {
  const router = useRouter();
  const { setFinancing, setReference } = useJourney();
  const [institution, setInstitution] = useState("");
  const [institutionError, setInstitutionError] = useState(false);

  function continueWithOwnFinancing() {
    setFinancing({ choice: "own" });
    // Own-financing applicants skip the document form, so their reference is
    // issued here — the confirmation screen always has one to quote.
    setReference(generateReference());
    router.push("/confirmation");
  }

  function continueToApplication() {
    if (!institution) {
      setInstitutionError(true);
      return;
    }
    const chosen = FINANCIAL_INSTITUTIONS.find((i) => i.id === institution);
    setFinancing({ choice: "bank", institution: chosen?.name });
    router.push("/financing/apply");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="relative isolate overflow-hidden bg-parchment-50">
          <ImageSlot
            src="/images/hero-financing.jpg"
            alt=""
            tone="home"
            priority
            className="absolute inset-0 -z-10 size-full"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-parchment-50 via-parchment-50/85 to-parchment-50/10" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-parchment-100 to-transparent" />

          <div className="shell relative py-10 md:py-12">
            <ScriptMark
              lines={["Same Land.", "A Brighter Tomorrow."]}
              className="absolute right-6 top-8 hidden xl:block"
            />
            <div className="max-w-3xl">
              <Eyebrow>Choose Financing</Eyebrow>
              <h1 className="mt-2 text-hero">
                Choose the Way Forward That{" "}
                <span className="text-gold-600">Works for You.</span>
              </h1>
              <p className="mt-3 text-base text-ink-500 md:text-lg">
                Continue with your own financing, or let us assess your
                preliminary financing eligibility.
              </p>
            </div>
          </div>
        </section>

        <section className="shell grid gap-4 pb-4 lg:grid-cols-3">
          {/* ------------------------------------------------- Own financing */}
          <article className="flex flex-col rounded-card border border-parchment-300 bg-white p-5 shadow-card">
            <span className="flex size-16 items-center justify-center rounded-full bg-forest-50">
              <Wallet className="size-8 text-forest-700" aria-hidden />
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink-900">
              Own Financing
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              I will fund the project through my own financial arrangement.
            </p>

            <ImageSlot
              src="/images/own-financing.jpg"
              alt=""
              tone="land"
              className="mt-4 h-40 w-full rounded-lg"
            />

            <ul className="mt-4 flex-1 space-y-3">
              {OWN_BENEFITS.map(({ Icon, title, body }) => (
                <li key={title} className="flex items-start gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-parchment-200">
                    <Icon className="size-4 text-forest-700" aria-hidden />
                  </span>
                  <span className="text-[0.8125rem] leading-tight">
                    <span className="block font-semibold text-ink-800">{title}</span>
                    <span className="mt-0.5 block text-ink-500">{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Button onClick={continueWithOwnFinancing} size="lg" className="mt-5 w-full">
              Continue With Own Financing <ArrowRight className="size-4" />
            </Button>
          </article>

          {/* ---------------------------------------------- Apply for finance */}
          <article className="flex flex-col rounded-card border border-parchment-300 bg-parchment-50 p-5 shadow-card">
            <span className="flex size-16 items-center justify-center rounded-full bg-gold-100">
              <FileSearch className="size-8 text-gold-700" aria-hidden />
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink-900">
              Apply for Financing
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              I want to submit my information and documents for a preliminary
              financing eligibility assessment.
            </p>

            <fieldset className="mt-4 rounded-lg border border-parchment-300 bg-white p-3.5">
              <legend className="px-1 text-[0.8125rem] font-semibold text-ink-800">
                Select Preferred Financial Institution
              </legend>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                {FINANCIAL_INSTITUTIONS.map((bank) => {
                  const selected = institution === bank.id;
                  return (
                    <label
                      key={bank.id}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-control border-2 bg-white px-3 py-3 transition-colors ${
                        selected ? "border-gold-500 bg-gold-50" : "border-parchment-300 hover:border-gold-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="institution"
                        value={bank.id}
                        checked={selected}
                        onChange={() => {
                          setInstitution(bank.id);
                          setInstitutionError(false);
                        }}
                        className="size-4 shrink-0 accent-gold-600"
                      />
                      <span className="leading-tight">
                        <span className="block font-display text-base font-bold text-ink-900">
                          {bank.name}
                        </span>
                        {bank.tagline && (
                          <span className="block text-[0.6875rem] text-ink-500">
                            {bank.tagline}
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
              {institutionError && (
                <p role="alert" className="mt-2 text-xs text-danger">
                  Select a financial institution to continue.
                </p>
              )}
            </fieldset>

            <ul className="mt-4 flex-1 space-y-3">
              {APPLY_STEPS.map(({ Icon, title, body }) => (
                <li key={title} className="flex items-start gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white">
                    <Icon className="size-4 text-gold-700" aria-hidden />
                  </span>
                  <span className="text-[0.8125rem] leading-tight">
                    <span className="block font-semibold text-ink-800">{title}</span>
                    <span className="mt-0.5 block text-ink-500">{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Button onClick={continueToApplication} size="lg" className="mt-5 w-full">
              Continue to Application <ArrowRight className="size-4" />
            </Button>
          </article>

          <EligibilityCalculator />
        </section>

        {/* ------------------------------------------------------ Trust strip */}
        <section className="shell pb-12">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-5 rounded-card border border-parchment-300 bg-white p-4 shadow-card">
            <ul className="flex flex-1 flex-wrap items-center justify-between gap-x-5 gap-y-5">
              {TRUST.map(({ Icon, title, body }) => (
                <li key={title} className="flex items-center gap-2.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-parchment-200">
                    <Icon className="size-5 text-forest-700" aria-hidden />
                  </span>
                  <span className="text-[0.8125rem] leading-tight">
                    <span className="block font-semibold text-ink-800">{title}</span>
                    <span className="text-ink-500">{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <ButtonLink href="/how-it-works" variant="outline">
              Learn How It Works <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </section>
      </main>

      <SiteFooter variant="pillars" />
    </div>
  );
}

/* ==========================================================================
   AI Financing Eligibility Calculator
   A transparent DSR estimate — see src/lib/eligibility.ts for the maths.
   ========================================================================== */

function EligibilityCalculator() {
  const [income, setIncome] = useState("");
  const [commitments, setCommitments] = useState("");
  const [age, setAge] = useState("");
  const [budget, setBudget] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState("");

  function check() {
    const monthlyIncome = Number(income);
    const existingCommitments = Number(commitments || 0);

    if (!monthlyIncome || monthlyIncome <= 0) {
      setError("Enter your gross monthly income.");
      setResult(null);
      return;
    }
    if (!age) {
      setError("Select your age.");
      setResult(null);
      return;
    }
    if (!period) {
      setError("Select a financing period.");
      setResult(null);
      return;
    }

    setError("");
    setResult(
      calculateEligibility({
        monthlyIncome,
        existingCommitments,
        age: Number(age),
        preferredBudget: Number(budget || 0),
        financingPeriodYears: Number(period),
      }),
    );
  }

  return (
    <article
      id="calculator"
      className="flex flex-col rounded-card border border-forest-200 bg-gradient-to-b from-forest-50/70 to-white p-5 shadow-card"
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1.5 text-[0.75rem] font-semibold text-forest-700">
        <Sparkles className="size-3.5" aria-hidden /> Free Initial Check
      </span>

      <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight text-ink-900">
        AI Financing Eligibility Calculator
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Get an indicative view of your financing eligibility in just a few
        simple details.
      </p>

      <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
        <Field id="income" label="Monthly Income (RM)">
          <TextInput
            id="income"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="e.g. 8,000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </Field>

        <Field id="commitments" label="Existing Commitments (RM)">
          <TextInput
            id="commitments"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="e.g. 1,500"
            value={commitments}
            onChange={(e) => setCommitments(e.target.value)}
          />
        </Field>

        <Field id="age" label="Age (Years)">
          <SelectInput id="age" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Select your age</option>
            {AGES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field id="budget" label="Preferred Home Budget (RM)">
          <TextInput
            id="budget"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="e.g. 500,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field id="period" label="Financing Period (Years)">
            <SelectInput
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="">Select period</option>
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p} years
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs text-danger">
          {error}
        </p>
      )}

      <Button onClick={check} variant="forest" size="lg" className="mt-4 w-full">
        Check My Indicative Eligibility <ArrowRight className="size-4" />
      </Button>

      <div className="mt-4 flex-1" aria-live="polite">
        {!result ? (
          <div className="flex items-center gap-3 rounded-lg bg-forest-50 px-4 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
              <BarChart3 className="size-5 text-forest-600" aria-hidden />
            </span>
            <p className="text-[0.8125rem] text-ink-600">
              Your indicative eligibility range will appear here.
            </p>
          </div>
        ) : result.overCommitted ? (
          <Note tone="warn" icon={<Info className="size-4 text-danger" aria-hidden />}>
            Your existing commitments already use the income a financier would
            assess. Reducing commitments, or adding a joint applicant, would
            change this result.
          </Note>
        ) : (
          <div className="rounded-lg border border-forest-200 bg-forest-50 p-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-forest-700">
              Indicative financing range
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-ink-900">
              {formatRM(result.lowerFinancing)} &ndash; {formatRM(result.upperFinancing)}
            </p>

            <dl className="mt-3 space-y-1.5 text-[0.8125rem]">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Property value it supports</dt>
                <dd className="font-semibold text-ink-800">
                  {formatRM(result.lowerPropertyValue)} &ndash;{" "}
                  {formatRM(result.upperPropertyValue)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Estimated monthly instalment</dt>
                <dd className="font-semibold text-ink-800">
                  {formatRM(result.indicativeInstalment)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Financing period used</dt>
                <dd className="font-semibold text-ink-800">
                  {result.effectiveTenureYears} years
                  {result.tenureWasCapped && " (age-capped)"}
                </dd>
              </div>
            </dl>

            {Number(budget) > 0 && (
              <p
                className={`mt-3 rounded border px-3 py-2 text-[0.75rem] ${
                  result.budgetAssessment === "stretched"
                    ? "border-gold-300 bg-gold-50 text-gold-800"
                    : "border-forest-200 bg-white text-forest-700"
                }`}
              >
                Your {formatRM(Number(budget))} budget implies a debt service
                ratio of about {result.budgetDsrPercent.toFixed(0)}%
                {result.budgetAssessment === "comfortable" &&
                  " — comfortably inside what financiers typically consider."}
                {result.budgetAssessment === "within" &&
                  " — within the range financiers typically consider."}
                {result.budgetAssessment === "stretched" &&
                  " — above the range financiers typically consider comfortable."}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 flex items-start gap-2 text-[0.6875rem] leading-snug text-ink-400">
        <Info className="mt-px size-3.5 shrink-0" aria-hidden />
        <span>
          The calculator provides an initial indication only, assuming a{" "}
          {INDICATIVE_RATE}% indicative rate and a 90% margin of finance. Final
          eligibility and approval are subject to the selected financial
          institution&rsquo;s assessment and policies.
        </span>
      </p>
    </article>
  );
}

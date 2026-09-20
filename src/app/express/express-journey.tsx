"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HornbillMark } from "@/components/brand";
import { SARAWAK_DIVISIONS } from "@/lib/content";
import { COPY, DEFAULT_LANG, type Lang } from "@/lib/i18n";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  CONSULTATION_MODES,
  FINANCING_TARGETS,
  HOME_NUMBERS,
  HOUSE_TYPES,
  INITIAL_STATUS,
  LEAD_DEFAULTS,
  generateLeadId,
  readAttribution,
  recordLanding,
  type Lead,
} from "@/lib/lead";
import { FORM_NAME, HONEYPOT_FIELD, submitLead } from "@/lib/submit-lead";
import { AiCalculator } from "./ai-calculator";
import {
  Card,
  FieldError,
  IconTile,
  Label,
  LangToggle,
  PhotoTile,
  ProgressRail,
  STEP_IDS,
  SectionHeading,
  Select,
  TextInput,
} from "./express-ui";

type Values = typeof LEAD_DEFAULTS;
type ErrorKey = "customer_name" | "phone" | "email" | "consent";
type Errors = Partial<Record<ErrorKey, string>>;

/* Loose on purpose. This is a lead form, not a KYC check, and a consultant
   will call the number. Rejecting a valid Malaysian format we failed to
   anticipate costs a real customer; accepting a slightly odd one costs
   nothing. */
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Sarawak divisions are place names, so they read the same in both languages. */
const DIVISION_OPTIONS = SARAWAK_DIVISIONS.map((name) => ({
  value: name,
  ms: name,
  en: name,
}));

function validate(values: Values, consent: boolean, lang: Lang): Errors {
  const t = COPY[lang];
  const errors: Errors = {};
  if (!values.customer_name.trim()) errors.customer_name = t.errName;
  if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = t.errPhone;
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = t.errEmail;
  if (!consent) errors.consent = t.errConsent;
  return errors;
}

export function ExpressJourney() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [values, setValues] = useState<Values>(LEAD_DEFAULTS);
  const [consent, setConsent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [leadId, setLeadId] = useState("");
  const [calcOpen, setCalcOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const t = COPY[lang];

  /* Attribution is captured on arrival and read back at submit. This writes
     to sessionStorage only, no state, so the introducer stays invisible to
     the customer and survives a refresh or a detour into the calculator. */
  useEffect(() => {
    recordLanding();
  }, []);

  /* The <html lang> attribute has to follow the toggle, or a screen reader
     keeps pronouncing English copy with Malay phonetics. */
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  /* Light the rail from whichever section is crossing the middle of the
     viewport. Purely decorative: if the observer never fires, the rail stays
     on step one and nothing about the journey breaks. */
  useEffect(() => {
    if (status === "done") return;

    const sections = STEP_IDS.map((id) =>
      document.getElementById(`section-${id}`),
    ).filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = sections.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActiveStep(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [status]);

  const set = useCallback(
    <K extends keyof Values>(key: K) =>
      (value: Values[K]) => {
        setValues((previous) => ({ ...previous, [key]: value }));
      },
    [],
  );

  /* Derived, not stored. Errors are a pure function of the current values, so
     computing them during render keeps a corrected field clearing itself
     immediately without an effect writing state back into the component. */
  const errors: Errors = attempted ? validate(values, consent, lang) : {};

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const found = validate(values, consent, lang);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document
        .getElementById("section-done")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById(firstKey)?.focus({ preventScroll: true });
      return;
    }

    /* A bot that filled the hidden field gets a success screen and nothing
       else. Failing loudly here would only teach it to try again. */
    if (honeypotRef.current?.value) {
      setStatus("done");
      return;
    }

    const attribution = readAttribution();
    const reference = generateLeadId();
    const lead: Lead = {
      lead_id: reference,
      introducer_id: attribution.introducer_id,
      source: attribution.source,
      division: values.division,
      area: values.area.trim(),
      land_size: values.land_size.trim(),
      remark: values.remark.trim(),
      house_type: values.house_type || "Belum Pasti",
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      financing_target: values.financing_target,
      consultation_preference: values.consultation_preference || "Belum Pasti",
      customer_name: values.customer_name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      home_number: values.home_number,
      consent: "Ya",
      landed_at: attribution.landed_at,
      created_at: new Date().toISOString(),
      status: INITIAL_STATUS,
    };

    setStatus("sending");
    try {
      await submitLead(lead);
      setLeadId(reference);
      setStatus("done");
      setActiveStep(STEP_IDS.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      /* Never show the success screen on a failed send: a customer who
         believes they have registered will not try again. */
      setStatus("error");
    }
  }

  const done = status === "done";

  return (
    <div className="min-h-dvh bg-ivory-100">
      <StickyHeader
        activeStep={activeStep}
        showRail={!done}
        lang={lang}
        onLang={setLang}
      />

      {done ? (
        <SuccessPanel leadId={leadId} name={values.customer_name.trim()} lang={lang} />
      ) : (
        <>
          <Hero lang={lang} />
          <Reasons lang={lang} />
          <main id="main" className="shell max-w-3xl pb-20 pt-12 sm:pb-28 sm:pt-16">
            <form
              name={FORM_NAME}
              method="POST"
              action="/express/"
              data-netlify="true"
              netlify-honeypot={HONEYPOT_FIELD}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-14 sm:space-y-20"
            >
              {/* Present in the exported HTML so the form backend detects every
                  column; the real values are attached at submit time. */}
              <input type="hidden" name="form-name" value={FORM_NAME} />
              {["lead_id", "introducer_id", "source", "landed_at", "created_at", "status"].map(
                (field) => (
                  <input key={field} type="hidden" name={field} defaultValue="" />
                ),
              )}
              <p className="hidden" aria-hidden>
                <label>
                  Jangan isi ruangan ini
                  <input
                    ref={honeypotRef}
                    name={HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </p>

              <LandSection values={values} set={set} lang={lang} />
              <HomeSection values={values} set={set} lang={lang} />
              <FinancingSection
                values={values}
                set={set}
                lang={lang}
                onOpenCalculator={() => setCalcOpen(true)}
              />
              <GuideSection values={values} set={set} lang={lang} />
              <AboutSection
                values={values}
                set={set}
                lang={lang}
                consent={consent}
                setConsent={setConsent}
                errors={errors}
              />
              <FinalCta
                lang={lang}
                status={status}
                errorCount={attempted ? Object.keys(errors).length : 0}
              />
            </form>
          </main>
        </>
      )}

      <ExpressFooter lang={lang} />

      {/* Outside the <form>: nested forms are invalid HTML. */}
      <AiCalculator
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        financingTarget={values.financing_target}
        lang={lang}
      />
    </div>
  );
}

/* ==========================================================================
   Chrome
   ========================================================================== */

function StickyHeader({
  activeStep,
  showRail,
  lang,
  onLang,
}: {
  activeStep: number;
  showRail: boolean;
  lang: Lang;
  onLang: (next: Lang) => void;
}) {
  return (
    <header className="sticky top-0 z-(--z-sticky) border-b border-navy-100 bg-ivory-100/92 backdrop-blur-md">
      <div className="shell max-w-5xl py-3 sm:py-3.5">
        <div className="flex items-center gap-2.5">
          <HornbillMark tone="dark" className="h-7 w-auto shrink-0 sm:h-8" />
          <span className="truncate font-display text-[0.9375rem] font-bold tracking-tight text-navy-900 sm:text-[1.0625rem]">
            My Kenyalang Homes
          </span>
          <span className="ml-auto" />
          <LangToggle lang={lang} onChange={onLang} />
        </div>
        {showRail ? (
          <div className="mt-3 sm:mt-3.5">
            <ProgressRail activeIndex={activeStep} lang={lang} />
          </div>
        ) : null}
      </div>
    </header>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="navy-depth relative overflow-hidden text-white">
      {/* A single wide champagne glow behind the type, so the gradient reads
          as light falling on a surface rather than a flat colour ramp. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[34rem] rounded-full bg-champagne-500/10 blur-3xl"
      />
      <div className="shell relative max-w-5xl py-12 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <p className="rise text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-navy-300">
              {t.brandPartners}
            </p>
            <p className="rise mt-4 inline-flex items-center gap-2 rounded-full border border-champagne-500/35 bg-champagne-500/12 px-3.5 py-1.5 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-champagne-300 [animation-delay:60ms]">
              <span aria-hidden className="size-1.5 rounded-full bg-champagne-400" />
              {t.expressBadge}
            </p>
            <h1 className="rise mt-6 text-balance font-display text-[2.25rem] font-bold leading-[1.04] tracking-[-0.025em] text-white [animation-delay:120ms] sm:text-[3.25rem]">
              {t.heroTitle}
              <span className="mt-2 block text-champagne-300">{t.heroTitleAccent}</span>
            </h1>
            <p className="rise mt-6 max-w-[54ch] text-pretty text-[0.9375rem] leading-[1.7] text-navy-200 [animation-delay:180ms] sm:text-[1.0625rem]">
              {t.heroBody}
            </p>
            <div className="rise mt-8 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
              <a
                href="#section-tanah"
                className="champagne-face inline-flex h-14 items-center gap-2 rounded-control px-7 text-[0.9375rem] font-bold text-navy-950 shadow-champagne transition-[filter,transform] duration-200 [transition-timing-function:var(--ease-out-quart)] hover:brightness-110 active:translate-y-px"
              >
                {t.heroCta}
                <svg aria-hidden viewBox="0 0 20 20" className="size-4">
                  <path
                    d="M4 10h11M10.5 5.5L15 10l-4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {t.trust.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-navy-100"
                  >
                    <svg aria-hidden viewBox="0 0 14 14" className="size-3.5 text-champagne-400">
                      <path
                        d="M2.5 7.3l3 3 6-6.6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <figure className="rise relative [animation-delay:300ms]">
            <img
              src="/images/homes/home-04.jpg"
              alt={t.heroPhotoAlt}
              width={800}
              height={500}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full rounded-express-lg object-cover shadow-express-xl ring-1 ring-white/10 sm:aspect-[8/5]"
            />
          </figure>
        </div>

        {/* Three facts that answer the only objections an ad visitor has. */}
        <dl className="rise mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-express border border-white/10 bg-white/10 [animation-delay:360ms]">
          {t.statValues.map((value, i) => (
            <div key={t.statLabels[i]} className="bg-navy-900/60 px-3 py-4 text-center sm:py-5">
              <dt className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-navy-300">
                {t.statLabels[i]}
              </dt>
              <dd className="mt-1.5 font-display text-[1.125rem] font-bold text-champagne-300 sm:text-[1.375rem]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Reasons({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="border-b border-navy-100 bg-white">
      <div className="shell max-w-5xl py-12 sm:py-16">
        <h2 className="text-balance font-display text-[1.5rem] font-bold leading-tight tracking-tight text-navy-900 sm:text-[2rem]">
          {t.reasonsTitle}
        </h2>
        <ol className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-7">
          {t.reasons.map((reason, i) => (
            <li key={reason.title} className="flex gap-4">
              <span
                aria-hidden
                className="font-display text-[1.75rem] font-bold leading-none tabular-nums text-champagne-500"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[1.0625rem] font-bold leading-snug text-navy-900">
                  {reason.title}
                </h3>
                <p className="mt-1.5 text-pretty text-[0.875rem] leading-relaxed text-navy-600">
                  {reason.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ExpressFooter({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <footer className="border-t border-navy-100 bg-ivory-200">
      <div className="shell max-w-5xl py-10 text-center">
        <HornbillMark tone="dark" className="mx-auto h-8 w-auto opacity-60" />
        <p className="mt-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-navy-600">
          {t.brandPartners}
        </p>
        <p className="mx-auto mt-3 max-w-[60ch] text-pretty text-[0.75rem] leading-relaxed text-navy-500">
          {t.footerNote}
        </p>
      </div>
    </footer>
  );
}

/* ==========================================================================
   Sections
   ========================================================================== */

type SectionProps = {
  values: Values;
  set: <K extends keyof Values>(key: K) => (value: Values[K]) => void;
  lang: Lang;
};

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={`section-${id}`} className="scroll-mt-32">
      {children}
    </section>
  );
}

function LandSection({ values, set, lang }: SectionProps) {
  const t = COPY[lang];
  return (
    <Section id="tanah">
      <SectionHeading index="01" title={t.landTitle} support={t.landSupport} />
      <figure className="mb-5 overflow-hidden rounded-express shadow-express">
        <img
          src="/images/land/find-land.jpg"
          alt={t.landPhotoAlt}
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
          className="h-36 w-full object-cover sm:h-44"
        />
      </figure>
      <Card>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="division" optional={t.optional}>
              {t.fieldDivision}
            </Label>
            <Select
              id="division"
              name="division"
              value={values.division}
              onChange={set("division")}
              options={DIVISION_OPTIONS}
              lang={lang}
            />
          </div>
          <div>
            <Label htmlFor="area" optional={t.optional}>
              {t.fieldArea}
            </Label>
            <TextInput
              id="area"
              name="area"
              value={values.area}
              onChange={set("area")}
              placeholder={t.fieldAreaPlaceholder}
            />
          </div>
          <div>
            <Label htmlFor="land_size" optional={t.optional}>
              {t.fieldLandSize}
            </Label>
            <TextInput
              id="land_size"
              name="land_size"
              value={values.land_size}
              onChange={set("land_size")}
              placeholder={t.fieldLandSizePlaceholder}
            />
          </div>
          <div>
            <Label htmlFor="remark" optional={t.optional}>
              {t.fieldRemark}
            </Label>
            <TextInput
              id="remark"
              name="remark"
              value={values.remark}
              onChange={set("remark")}
              placeholder={t.fieldRemarkPlaceholder}
            />
          </div>
        </div>
      </Card>
    </Section>
  );
}

function HomeSection({ values, set, lang }: SectionProps) {
  const t = COPY[lang];
  return (
    <Section id="rumah">
      <SectionHeading index="02" title={t.homeTitle} support={t.homeSupport} />
      <Card>
        <fieldset>
          <legend className="mb-3 text-[0.8125rem] font-bold tracking-wide text-navy-800">
            {t.fieldHouseType}
          </legend>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {HOUSE_TYPES.map((type) => (
              <PhotoTile
                key={type.value}
                name="house_type"
                value={type.value}
                checked={values.house_type === type.value}
                onChange={set("house_type")}
                label={type[lang]}
                photo={type.photo}
                alt={type[lang]}
              />
            ))}
          </div>
        </fieldset>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="bedrooms">{t.fieldBedrooms}</Label>
            <Select
              id="bedrooms"
              name="bedrooms"
              value={values.bedrooms}
              onChange={set("bedrooms")}
              options={BEDROOM_OPTIONS}
              lang={lang}
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">{t.fieldBathrooms}</Label>
            <Select
              id="bathrooms"
              name="bathrooms"
              value={values.bathrooms}
              onChange={set("bathrooms")}
              options={BATHROOM_OPTIONS}
              lang={lang}
            />
          </div>
        </div>
      </Card>
    </Section>
  );
}

function FinancingSection({
  values,
  set,
  lang,
  onOpenCalculator,
}: SectionProps & { onOpenCalculator: () => void }) {
  const t = COPY[lang];
  return (
    <Section id="finance">
      <SectionHeading index="03" title={t.financeTitle} support={t.financeSupport} />
      <Card>
        <Label htmlFor="financing_target">{t.fieldFinancing}</Label>
        <Select
          id="financing_target"
          name="financing_target"
          value={values.financing_target}
          onChange={set("financing_target")}
          options={FINANCING_TARGETS}
          lang={lang}
        />
      </Card>

      {/* Optional, and visibly so. It sits outside the card to read as an
          aside rather than a step, and it never gates submission. */}
      <div className="navy-depth relative mt-4 overflow-hidden rounded-express shadow-express-lg">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-champagne-500/15 blur-2xl"
        />
        <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
          <div className="min-w-0 flex-1">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-champagne-400">
              {t.calcKicker}
            </p>
            <p className="mt-2.5 font-display text-[1.125rem] font-bold leading-snug text-white sm:text-[1.25rem]">
              {t.calcPrompt}
            </p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-navy-200">
              {t.calcBody}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCalculator}
            className="champagne-face inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-control px-6 py-3.5 text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-navy-950 shadow-champagne transition-[filter,transform] duration-200 hover:brightness-110 active:translate-y-px"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="size-4">
              <rect
                x="4"
                y="2.5"
                width="12"
                height="15"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M7 6.5h6M7 10h2M7 13.2h2M12 10v3.2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            {t.calcCta}
          </button>
        </div>
      </div>
    </Section>
  );
}

function GuideSection({ values, set, lang }: SectionProps) {
  const t = COPY[lang];
  return (
    <Section id="guide">
      <SectionHeading index="04" title={t.guideTitle} support={t.guideSupport} />
      <Card>
        <fieldset>
          <legend className="sr-only">{t.guideLegend}</legend>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {CONSULTATION_MODES.map((mode) => (
              <IconTile
                key={mode.value}
                name="consultation_preference"
                value={mode.value}
                checked={values.consultation_preference === mode.value}
                onChange={set("consultation_preference")}
                label={mode[lang]}
                note={mode.note[lang]}
              />
            ))}
          </div>
        </fieldset>
      </Card>
    </Section>
  );
}

function AboutSection({
  values,
  set,
  lang,
  consent,
  setConsent,
  errors,
}: SectionProps & {
  consent: boolean;
  setConsent: (value: boolean) => void;
  errors: Errors;
}) {
  const t = COPY[lang];
  return (
    <Section id="done">
      <SectionHeading index="05" title={t.aboutTitle} support={t.aboutSupport} />
      <Card>
        <div className="space-y-5">
          <div>
            <Label htmlFor="customer_name">{t.fieldName}</Label>
            <TextInput
              id="customer_name"
              name="customer_name"
              value={values.customer_name}
              onChange={set("customer_name")}
              placeholder={t.fieldNamePlaceholder}
              autoComplete="name"
              invalid={Boolean(errors.customer_name)}
              describedBy={errors.customer_name ? "customer_name-error" : undefined}
            />
            {errors.customer_name ? (
              <FieldError id="customer_name-error">{errors.customer_name}</FieldError>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">{t.fieldPhone}</Label>
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={set("phone")}
                placeholder="012-345 6789"
                autoComplete="tel"
                invalid={Boolean(errors.phone)}
                describedBy={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone ? <FieldError id="phone-error">{errors.phone}</FieldError> : null}
            </div>
            <div>
              <Label htmlFor="email">{t.fieldEmail}</Label>
              <TextInput
                id="email"
                name="email"
                type="email"
                inputMode="email"
                value={values.email}
                onChange={set("email")}
                placeholder="nama@email.com"
                autoComplete="email"
                invalid={Boolean(errors.email)}
                describedBy={errors.email ? "email-error" : undefined}
              />
              {errors.email ? <FieldError id="email-error">{errors.email}</FieldError> : null}
            </div>
          </div>

          <div>
            <Label htmlFor="home_number">{t.fieldHomeNumber}</Label>
            <Select
              id="home_number"
              name="home_number"
              value={values.home_number}
              onChange={set("home_number")}
              options={HOME_NUMBERS}
              lang={lang}
            />
          </div>

          <div
            className={`rounded-control border-[1.5px] p-4 transition-colors duration-200 ${
              errors.consent ? "border-danger bg-danger/5" : "border-navy-100 bg-ivory-100"
            }`}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                aria-invalid={Boolean(errors.consent) || undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-px size-6 shrink-0 accent-champagne-500"
              />
              <span className="text-[0.8125rem] leading-relaxed text-navy-700">
                {t.consentText}
              </span>
            </label>
            {errors.consent ? (
              <FieldError id="consent-error">{errors.consent}</FieldError>
            ) : null}
          </div>
        </div>
      </Card>
    </Section>
  );
}

function FinalCta({
  lang,
  status,
  errorCount,
}: {
  lang: Lang;
  status: "idle" | "sending" | "done" | "error";
  errorCount: number;
}) {
  const t = COPY[lang];
  return (
    <div className="text-center">
      <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-champagne-700">
        <svg aria-hidden viewBox="0 0 14 14" className="size-3.5">
          <path
            d="M2.5 7.3l3 3 6-6.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t.ctaKicker}
      </p>
      <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-navy-700">
        {t.ctaBody}
        <br />
        <span className="text-navy-500">{t.ctaNoDocs}</span>
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="champagne-face mt-7 inline-flex h-16 w-full items-center justify-center gap-2.5 rounded-control text-[0.9375rem] font-bold uppercase tracking-[0.05em] text-navy-950 shadow-champagne transition-[filter,transform] duration-200 [transition-timing-function:var(--ease-out-quart)] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:h-[4.25rem] sm:text-[1.0625rem]"
      >
        {status === "sending" ? t.submitting : t.submit}
        {status === "sending" ? null : (
          <svg aria-hidden viewBox="0 0 20 20" className="size-[1.125rem]">
            <path
              d="M4 10h11M10.5 5.5L15 10l-4.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div aria-live="polite" className="min-h-6">
        {errorCount > 0 ? (
          <p className="mt-3.5 text-[0.8125rem] font-semibold text-danger">
            {t.errorCount(errorCount)}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-3.5 text-[0.8125rem] font-semibold text-danger">{t.sendFailed}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ==========================================================================
   Success
   ========================================================================== */

function SuccessPanel({
  leadId,
  name,
  lang,
}: {
  leadId: string;
  name: string;
  lang: Lang;
}) {
  const t = COPY[lang];
  const firstName = name.split(/\s+/)[0] ?? "";
  return (
    <main id="main" className="relative isolate overflow-hidden bg-navy-950">
      <img
        src="/images/kuching-sunset.jpg"
        alt={t.successPhotoAlt}
        width={1600}
        height={900}
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <span aria-hidden className="photo-scrim absolute inset-0 -z-10" />

      <div className="shell max-w-5xl py-16 text-white sm:py-24">
        <div className="rise flex size-16 items-center justify-center rounded-full border border-champagne-400/40 bg-champagne-500/20 backdrop-blur-sm sm:size-18">
          <svg aria-hidden viewBox="0 0 24 24" className="size-8 text-champagne-300 sm:size-9">
            <path
              d="M4 12.5l5 5L20 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="rise mt-7 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-champagne-300 [animation-delay:60ms]">
          {t.successKicker}
        </p>
        <h1 className="rise mt-4 text-balance font-display text-[2.125rem] font-bold leading-[1.06] tracking-[-0.025em] text-white [animation-delay:120ms] sm:text-[3rem]">
          {t.successTitle(firstName)}
        </h1>
        <p className="rise mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-navy-100 [animation-delay:180ms]">
          {t.successBody}
        </p>

        {leadId ? (
          <div className="rise mt-8 inline-flex flex-col rounded-express border border-white/15 bg-navy-950/55 px-6 py-4 backdrop-blur-sm [animation-delay:240ms]">
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-navy-200">
              {t.referenceLabel}
            </span>
            <span className="mt-1 font-display text-[1.5rem] font-bold tracking-wide text-champagne-300">
              {leadId}
            </span>
          </div>
        ) : null}

        <ol className="mt-12 space-y-5 border-t border-white/15 pt-10">
          {t.nextSteps.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-champagne-500/20 font-display text-[0.75rem] font-bold tabular-nums text-champagne-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-pretty text-[0.9375rem] leading-relaxed text-white/90">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-[60ch] text-pretty border-t border-white/15 pt-8 text-[0.8125rem] leading-relaxed text-navy-200">
          {t.successFooter}
        </p>
      </div>
    </main>
  );
}

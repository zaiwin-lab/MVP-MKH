"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EXPRESS_CONTACT, SARAWAK_DIVISIONS } from "@/lib/content";
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
  type Option,
} from "@/lib/lead";
import { FORM_NAME, HONEYPOT_FIELD, submitLead } from "@/lib/submit-lead";
import { AiCalculator } from "./ai-calculator";
import {
  ChoiceTile,
  FieldError,
  Icon,
  Label,
  LangToggle,
  Panel,
  PrimaryButton,
  ProgressRail,
  STEP_IDS,
  BentoCard,
  Eyebrow,
  KobisSignature,
  LangPills,
  PillBadge,
  PreviewCard,
  SectionDivider,
  SectionHeading,
  ServiceBubbles,
  StepCard,
  Select,
  TextInput,
  ThemeToggle,
  whatsappLink,
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
/** Sarawak divisions are place names: the same string in every language. */
const DIVISION_OPTIONS: Option[] = SARAWAK_DIVISIONS.map((name) => ({
  value: name,
  ms: name,
  en: name,
  zh: name,
  iba: name,
}));

const SECTION_ICONS = ["land", "1 Tingkat", "wallet", "guide", "user"];

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
     viewport. Purely decorative: if the observer never fires the rail stays
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

  /* The consultant should open the chat already knowing who this is. Only
     answered fields go in: a brief padded with "Belum Pasti" is noise. */
  const waDetails = [
    `${t.fieldName}: ${values.customer_name.trim() || "-"}`,
    `${t.fieldPhone}: ${values.phone.trim() || "-"}`,
    `${t.fieldDivision}: ${values.division}`,
    values.area.trim() ? `${t.fieldArea}: ${values.area.trim()}` : "",
    values.land_size.trim() ? `${t.fieldLandSize}: ${values.land_size.trim()}` : "",
    values.house_type ? `${t.fieldHouseType}: ${values.house_type}` : "",
    `${t.fieldBedrooms}: ${values.bedrooms}`,
    `${t.fieldFinancing}: ${values.financing_target}`,
    values.consultation_preference
      ? `${t.guideLegend}: ${values.consultation_preference}`
      : "",
    values.remark.trim() ? `${t.fieldRemark}: ${values.remark.trim()}` : "",
  ].filter(Boolean);
  /* The blank line is built in rather than filtered: joining the details
     first keeps `filter(Boolean)` from eating the separator. */
  const waBrief = `${t.waIntro(leadId || "-")}\n\n${waDetails.join("\n")}`;
  const waHref = whatsappLink(EXPRESS_CONTACT.whatsapp, waBrief);

  return (
    <div className="express-root express-ground relative isolate min-h-dvh">
      <span aria-hidden className="express-grain pointer-events-none fixed inset-0 -z-10" />

      <StickyHeader
        activeStep={activeStep}
        showRail={!done}
        lang={lang}
        onLang={setLang}
      />

      {done ? (
        <SuccessPanel
          leadId={leadId}
          name={values.customer_name.trim()}
          lang={lang}
          waHref={waHref}
        />
      ) : (
        <>
          <Hero lang={lang} />
          <Reasons lang={lang} />
          <Process lang={lang} />
          <main id="main" className="shell max-w-4xl pb-20 pt-6 sm:pb-28 sm:pt-10">
            <form
              name={FORM_NAME}
              method="POST"
              action="/express/"
              data-netlify="true"
              netlify-honeypot={HONEYPOT_FIELD}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-10 sm:space-y-14"
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
              <SectionDivider />
              <HomeSection values={values} set={set} lang={lang} />
              <SectionDivider />
              <FinancingSection
                values={values}
                set={set}
                lang={lang}
                onOpenCalculator={() => setCalcOpen(true)}
              />
              <SectionDivider />
              <GuideSection values={values} set={set} lang={lang} />
              <SectionDivider />
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

      <ExpressFooter lang={lang} onLang={setLang} />

      <ServiceBubbles
        lang={lang}
        onCalculator={() => setCalcOpen(true)}
        whatsappHref={waHref}
      />

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
  const t = COPY[lang];
  return (
    <header className="ex-border sticky top-0 z-(--z-sticky) border-b bg-[var(--ex-base)]/80 backdrop-blur-xl">
      <div className="shell max-w-6xl py-3">
        <div className="flex items-center gap-3">
          <span className="min-w-0 leading-none">
            <span className="ex-ink block truncate font-express text-[1rem] font-extrabold tracking-[-0.02em] sm:text-[1.125rem]">
              My Kenyalang Homes
            </span>
            <span className="ex-dim mt-1 hidden text-[0.625rem] font-bold uppercase tracking-[0.14em] sm:block">
              {t.expressBadge}
            </span>
          </span>

          <span className="ml-auto flex items-center gap-2">
            <LangToggle lang={lang} onChange={onLang} />
            <ThemeToggle lang={lang} />
            <PrimaryButton
              onClick={() =>
                document
                  .getElementById("section-tanah")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hidden h-11 items-center gap-2 px-5 text-[0.8125rem] md:inline-flex"
            >
              {t.heroCta}
              <Icon name="arrow" className="size-4" />
            </PrimaryButton>
          </span>
        </div>
        {showRail ? (
          <div className="mt-3">
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
    <section className="relative overflow-hidden">
      <div className="shell relative max-w-6xl pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div>
            <span className="rise inline-block">
              <PillBadge>{t.expressBadge}</PillBadge>
            </span>
            <h1 className="rise ex-ink display-xl mt-6 text-balance text-[2.75rem] [animation-delay:80ms] sm:text-[4.25rem]">
              {t.heroTitle}
              <span className="ex-accent mt-1 block">{t.heroTitleAccent}</span>
            </h1>
            <p className="rise ex-soft mt-6 max-w-[52ch] text-pretty text-[1.0625rem] leading-[1.65] [animation-delay:140ms] sm:text-[1.125rem]">
              {t.heroBody}
            </p>
            <p className="rise ex-accent mt-6 text-[0.6875rem] font-bold uppercase tracking-[0.18em] [animation-delay:180ms]">
              &#10022; {t.poweredBy} &#10022;
            </p>

            <div className="rise mt-8 flex flex-col gap-3 [animation-delay:220ms] sm:flex-row sm:items-center">
              <PrimaryButton
                onClick={() =>
                  document
                    .getElementById("section-tanah")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex h-14 items-center justify-center gap-2 px-7 text-[0.9375rem]"
              >
                {t.heroCta}
                <Icon name="arrow" className="size-4" />
              </PrimaryButton>
              <a
                href="#section-process"
                className="ex-border ex-ink inline-flex h-14 items-center justify-center rounded-control border px-7 text-[0.9375rem] font-semibold transition-colors duration-200 hover:opacity-80"
              >
                {t.heroSecondary}
              </a>
            </div>

            <ul className="rise mt-9 grid gap-3 [animation-delay:280ms] sm:grid-cols-3">
              {t.heroProofs.map((proof) => (
                <li key={proof.label} className="flex items-start gap-2.5">
                  <Icon name="check" className="ex-accent mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="ex-ink block text-[0.875rem] font-bold">
                      {proof.label}
                    </span>
                    <span className="ex-dim block text-[0.8125rem] leading-snug">
                      {proof.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rise [animation-delay:340ms]">
            <PreviewCard lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Reasons({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const icons = ["land", "1 Tingkat", "wallet", "guide"];
  return (
    <section className="band-raised">
      <div className="shell max-w-6xl py-16 sm:py-24">
        <div className="text-center">
          <Eyebrow>{t.reasonsEyebrow}</Eyebrow>
          <h2 className="ex-ink display-lg mx-auto mt-4 max-w-[20ch] text-balance text-[1.875rem] sm:text-[2.75rem]">
            {t.reasonsTitle}
            <span className="ex-dim block">{t.reasonsTitleTwo}</span>
          </h2>
          <p className="ex-soft mx-auto mt-5 max-w-[52ch] text-pretty text-[1rem] leading-relaxed sm:text-[1.0625rem]">
            {t.reasonsLede}
          </p>
        </div>

        {/* Asymmetric on purpose: four equal boxes read as a template. */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.reasons.map((reason, i) => (
            <BentoCard
              key={reason.title}
              icon={icons[i]}
              title={reason.title}
              body={reason.body}
              wide={i === 0 || i === 3}
              tinted={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const icons = ["user", "wallet", "Phone Call"];
  return (
    <section id="section-process" className="scroll-mt-28">
      <div className="shell max-w-6xl py-16 sm:py-24">
        <div className="text-center">
          <Eyebrow>{t.processEyebrow}</Eyebrow>
          <h2 className="ex-ink display-lg mt-4 text-balance text-[1.875rem] sm:text-[2.75rem]">
            {t.processTitle}
          </h2>
          <p className="ex-soft mx-auto mt-5 max-w-[52ch] text-pretty text-[1rem] leading-relaxed sm:text-[1.0625rem]">
            {t.processLede}
          </p>
        </div>
        <ol className="mt-12 grid gap-4 sm:grid-cols-3">
          {t.process.map((step, i) => (
            <StepCard
              key={step.title}
              index={i + 1}
              icon={icons[i]}
              title={step.title}
              body={step.body}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ExpressFooter({
  lang,
  onLang,
}: {
  lang: Lang;
  onLang: (next: Lang) => void;
}) {
  const t = COPY[lang];
  return (
    <footer className="ex-border border-t">
      <div className="shell max-w-6xl pb-24 pt-10">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="flex items-center gap-3">
            <span className="leading-none">
              <span className="ex-ink block font-express text-[1rem] font-extrabold tracking-[-0.02em]">
                My Kenyalang Homes
              </span>
              <span className="ex-dim mt-1 block text-[0.625rem] font-bold uppercase tracking-[0.14em]">
                {t.brandPartners}
              </span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="ex-dim text-[0.625rem] font-bold uppercase tracking-[0.16em]">
              {t.footerLanguage}
            </span>
            <LangPills lang={lang} onChange={onLang} />
          </div>

          <div className="max-w-[38ch]">
            <p className="ex-dim text-pretty text-[0.75rem] leading-relaxed">
              {t.footerNote}
            </p>
            <p className="ex-dim mt-1.5 text-[0.75rem]">
              &copy; {new Date().getFullYear()} My Kenyalang Homes. {t.footerRights}
            </p>
            <p className="-ml-3 mt-1">
              <KobisSignature lang={lang} href={EXPRESS_CONTACT.kobisUrl} />
            </p>
          </div>
        </div>
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
      <SectionHeading
        index="01"
        icon={SECTION_ICONS[0]}
        title={t.landTitle}
        support={t.landSupport}
      />
      <Panel>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="division">
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
            <Label htmlFor="area">
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
            <Label htmlFor="land_size">
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
            <Label htmlFor="remark">
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
      </Panel>
    </Section>
  );
}

function HomeSection({ values, set, lang }: SectionProps) {
  const t = COPY[lang];
  return (
    <Section id="rumah">
      <SectionHeading
        index="02"
        icon={SECTION_ICONS[1]}
        title={t.homeTitle}
        support={t.homeSupport}
      />
      <Panel>
        <fieldset>
          <legend className="ex-ink mb-3 text-[0.875rem] font-semibold tracking-wide">
            {t.fieldHouseType}
          </legend>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {HOUSE_TYPES.map((type) => (
              <ChoiceTile
                key={type.value}
                name="house_type"
                value={type.value}
                checked={values.house_type === type.value}
                onChange={set("house_type")}
                label={type[lang]}
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
      </Panel>
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
      <SectionHeading
        index="03"
        icon={SECTION_ICONS[2]}
        title={t.financeTitle}
        support={t.financeSupport}
      />
      <Panel>
        <Label htmlFor="financing_target">{t.fieldFinancing}</Label>
        <Select
          id="financing_target"
          name="financing_target"
          value={values.financing_target}
          onChange={set("financing_target")}
          options={FINANCING_TARGETS}
          lang={lang}
        />

        {/* Optional, and visibly so. Inside the panel but below a rule, so it
            reads as an aside to the field rather than a step of its own. */}
        <div className="ex-border mt-6 border-t pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <span
              aria-hidden
              className="ex-accent-wash ex-accent flex size-11 shrink-0 items-center justify-center rounded-2xl"
            >
              <Icon name="spark" className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="ex-accent text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
                {t.calcKicker}
              </p>
              <p className="ex-ink display-md mt-1.5 text-[1.125rem]">
                {t.calcPrompt}
              </p>
              <p className="ex-soft mt-1 text-[0.875rem] leading-relaxed">
                {t.calcBody}
              </p>
            </div>
            <PrimaryButton
              onClick={onOpenCalculator}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 px-5 text-[0.8125rem] uppercase tracking-[0.06em]"
            >
              <Icon name="spark" className="size-4" />
              {t.calcCta}
            </PrimaryButton>
          </div>
        </div>
      </Panel>
    </Section>
  );
}

function GuideSection({ values, set, lang }: SectionProps) {
  const t = COPY[lang];
  return (
    <Section id="guide">
      <SectionHeading
        index="04"
        icon={SECTION_ICONS[3]}
        title={t.guideTitle}
        support={t.guideSupport}
      />
      <Panel>
        <fieldset>
          <legend className="sr-only">{t.guideLegend}</legend>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {CONSULTATION_MODES.map((mode) => (
              <ChoiceTile
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
      </Panel>
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
      <SectionHeading
        index="05"
        icon={SECTION_ICONS[4]}
        title={t.aboutTitle}
        support={t.aboutSupport}
      />
      <Panel>
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
            className={`rounded-control border p-4 transition-colors duration-200 ${
              errors.consent
                ? "border-danger-400 bg-danger-400/10"
                : "ex-border ex-chip"
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
                className="mt-px size-6 shrink-0 accent-amber-400"
              />
              <span className="ex-soft text-[0.875rem] leading-relaxed">
                {t.consentText}
              </span>
            </label>
            {errors.consent ? (
              <FieldError id="consent-error">{errors.consent}</FieldError>
            ) : null}
          </div>
        </div>
      </Panel>
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
      <p className="ex-accent inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.18em]">
        <Icon name="check" className="size-3.5" />
        {t.ctaKicker}
      </p>
      <h2 className="ex-ink display-lg mx-auto mt-4 max-w-[16ch] text-balance text-[1.875rem] sm:text-[2.5rem]">
        {t.closerTitle}
        <span className="ex-accent block">{t.closerTitleTwo}</span>
      </h2>
      <p className="ex-soft mx-auto mt-4 max-w-[48ch] text-pretty text-[1rem] leading-relaxed">
        {t.closerLede}
      </p>
      <p className="ex-dim mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed">
        {t.ctaBody} {t.ctaNoDocs}
      </p>

      <PrimaryButton
        type="submit"
        disabled={status === "sending"}
        className="mt-7 inline-flex h-16 w-full items-center justify-center gap-2.5 text-[0.9375rem] uppercase tracking-[0.05em] sm:h-[4.25rem] sm:text-[1.0625rem]"
      >
        {status === "sending" ? t.submitting : t.submit}
        {status === "sending" ? null : <Icon name="arrow" className="size-[1.125rem]" />}
      </PrimaryButton>

      <div aria-live="polite" className="min-h-6">
        {errorCount > 0 ? (
          <p className="ex-danger mt-3.5 text-[0.875rem] font-semibold">
            {t.errorCount(errorCount)}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-3.5 text-[0.8125rem] font-semibold text-danger-300">
            {t.sendFailed}
          </p>
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
  waHref,
}: {
  leadId: string;
  name: string;
  lang: Lang;
  waHref: string | null;
}) {
  const t = COPY[lang];
  const firstName = name.split(/\s+/)[0] ?? "";
  return (
    <main id="main" className="shell max-w-5xl py-16 sm:py-24">
      <div className="rise gold-chrome flex size-16 items-center justify-center rounded-2xl text-navy-950 sm:size-18">
        <Icon name="check" className="size-8 sm:size-9" />
      </div>

      <p className="rise ex-accent mt-7 text-[0.75rem] font-semibold uppercase tracking-[0.2em] [animation-delay:60ms]">
        {t.successKicker}
      </p>
      <h1 className="rise ex-ink display-xl mt-4 max-w-[16ch] text-balance text-[2.5rem] [animation-delay:120ms] sm:text-[3.5rem]">
        {t.successTitle(firstName)}
      </h1>
      <p className="rise ex-soft mt-4 max-w-lg text-[1.125rem] leading-relaxed [animation-delay:180ms]">
        {t.successBody}
      </p>

      {leadId ? (
        <div className="rise chrome-panel relative mt-8 inline-flex flex-col rounded-express px-7 py-5 [animation-delay:240ms]">
          <span className="ex-dim text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">
            {t.referenceLabel}
          </span>
          <span className="ex-accent display-lg mt-1.5 text-[1.75rem] tracking-[0.01em]">
            {leadId}
          </span>
        </div>
      ) : null}

      <ol className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {t.nextSteps.map((step, index) => (
          <li key={step} className="chrome-panel relative flex gap-3.5 rounded-express p-5 sm:p-6">
            <span className="ex-accent-wash ex-accent flex size-7 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="ex-soft text-pretty text-[0.9375rem] leading-relaxed">
              {step}
            </span>
          </li>
        ))}
      </ol>

      {waHref ? (
        <div className="chrome-panel mt-10 flex flex-col gap-4 rounded-express-lg p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
          <div className="min-w-0 flex-1">
            <h2 className="ex-ink display-md text-[1.125rem]">{t.waHandoffTitle}</h2>
            <p className="ex-soft mt-2 text-pretty text-[0.9375rem] leading-relaxed">
              {t.waHandoffBody}
            </p>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-control bg-[#25d366] px-6 text-[0.9375rem] font-bold text-[#04301a] transition-transform duration-200 hover:-translate-y-0.5"
          >
            {t.waHandoffCta}
            <Icon name="arrow" className="size-4" />
          </a>
        </div>
      ) : null}

      <p className="ex-dim mt-10 max-w-[60ch] text-pretty text-[0.875rem] leading-relaxed">
        {t.successFooter}
      </p>
    </main>
  );
}

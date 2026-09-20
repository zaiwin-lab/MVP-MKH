"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HornbillMark } from "@/components/brand";
import { SARAWAK_DIVISIONS } from "@/lib/content";
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
  Label,
  ProgressRail,
  STEPS,
  SectionHeading,
  Select,
  TextInput,
  Tile,
} from "./express-ui";

type Values = typeof LEAD_DEFAULTS;
type Errors = Partial<Record<"customer_name" | "phone" | "email" | "consent", string>>;

/* Loose on purpose. This is a lead form, not a KYC check — a consultant will
   call the number. Rejecting a valid Malaysian format we failed to anticipate
   costs a real customer; accepting a slightly odd one costs nothing. */
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values, consent: boolean): Errors {
  const errors: Errors = {};
  if (!values.customer_name.trim()) {
    errors.customer_name = "Sila masukkan nama penuh anda.";
  }
  if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Sila masukkan no. telefon yang boleh dihubungi.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Sila masukkan alamat email yang sah.";
  }
  if (!consent) {
    errors.consent = "Sila tandakan persetujuan untuk kami hubungi anda.";
  }
  return errors;
}

export function ExpressJourney() {
  const [values, setValues] = useState<Values>(LEAD_DEFAULTS);
  const [consent, setConsent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [leadId, setLeadId] = useState("");
  const [calcOpen, setCalcOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  /* Attribution is captured on arrival and read back at submit. This writes to
     sessionStorage only — no state — so the introducer stays invisible to the
     customer and survives a refresh or a detour into the calculator. */
  useEffect(() => {
    recordLanding();
  }, []);

  /* Light the rail from whichever section is crossing the middle of the
     viewport. Purely decorative: if the observer never fires, the rail simply
     stays on step one and nothing about the journey breaks. */
  useEffect(() => {
    if (status === "done") return;

    const sections = STEPS.map((step) =>
      document.getElementById(`section-${step.id}`),
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
  const errors: Errors = attempted ? validate(values, consent) : {};

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const found = validate(values, consent);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.focus();
      document
        .getElementById("section-done")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      setActiveStep(STEPS.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      /* Never show the success screen on a failed send — a customer who
         believes they have registered will not try again. */
      setStatus("error");
    }
  }

  return (
    <div className="min-h-dvh bg-ivory-100">
      <StickyHeader activeStep={activeStep} showRail={status !== "done"} />

      {status === "done" ? (
        <SuccessPanel leadId={leadId} name={values.customer_name.trim()} />
      ) : (
        <>
          <Hero />
          <main id="main" className="shell max-w-3xl pb-16 pt-10 sm:pb-24 sm:pt-14">
            <form
              name={FORM_NAME}
              method="POST"
              action="/express/"
              data-netlify="true"
              netlify-honeypot={HONEYPOT_FIELD}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-12 sm:space-y-16"
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

              <LandSection values={values} set={set} />
              <HomeSection values={values} set={set} />
              <FinancingSection
                values={values}
                set={set}
                onOpenCalculator={() => setCalcOpen(true)}
              />
              <GuideSection values={values} set={set} />
              <AboutSection
                values={values}
                set={set}
                consent={consent}
                setConsent={setConsent}
                errors={errors}
              />

              <FinalCta status={status} errorCount={attempted ? Object.keys(errors).length : 0} />
            </form>
          </main>
        </>
      )}

      <ExpressFooter />

      {/* Outside the <form>: nested forms are invalid HTML. */}
      <AiCalculator
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        financingTarget={values.financing_target}
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
}: {
  activeStep: number;
  showRail: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-ivory-100/95 backdrop-blur-sm">
      <div className="shell max-w-3xl py-3 sm:py-4">
        <div className="flex items-center gap-2.5">
          <HornbillMark tone="dark" className="h-7 w-auto shrink-0 sm:h-8" />
          <span className="font-display text-[0.9375rem] font-bold tracking-tight text-navy-900 sm:text-[1.0625rem]">
            My Kenyalang Homes
          </span>
          <span className="ml-auto shrink-0 rounded-full border border-champagne-300 bg-champagne-50 px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-champagne-700 sm:text-[0.625rem]">
            Express
          </span>
        </div>
        {showRail ? (
          <div className="mt-3 sm:mt-4">
            <ProgressRail activeIndex={activeStep} />
          </div>
        ) : null}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-navy-900 text-white">
      <div className="shell max-w-3xl py-12 sm:py-16">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-navy-300 sm:text-[0.6875rem]">
          EG Megah Holdings &times; KOBIS Berhad
        </p>
        <p className="mt-3 inline-flex items-center rounded-full border border-champagne-500/40 bg-champagne-500/10 px-3 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-champagne-300 sm:text-[0.625rem]">
          Express Journey
        </p>
        <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-white sm:text-[2.875rem]">
          Jom Kita Mulakan!
          <span className="mt-1.5 block text-champagne-300">
            Perjalanan Membina Rumah Impian Anda.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-navy-200 sm:text-base">
          Kongsikan beberapa maklumat ringkas. Kami akan memahami tanah, pilihan
          rumah dan sasaran pembiayaan anda &mdash; kemudian team kami guide
          langkah seterusnya.
        </p>
        <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5">
          {["Percuma", "Ringkas", "Dipandu"].map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-navy-100 sm:text-[0.8125rem]"
            >
              <svg aria-hidden viewBox="0 0 14 14" className="size-3.5 text-champagne-400">
                <path
                  d="M2.5 7.3l3 3 6-6.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ExpressFooter() {
  return (
    <footer className="border-t border-navy-100 bg-ivory-200">
      <div className="shell max-w-3xl py-8 text-center">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-navy-500">
          EG Megah Holdings &times; KOBIS Berhad
        </p>
        <p className="mt-2 text-[0.75rem] leading-relaxed text-navy-400">
          My Kenyalang Homes &mdash; Express Journey. Maklumat yang anda
          kongsikan digunakan untuk menghubungi anda berkenaan pemilikan rumah
          dan pembiayaan sahaja.
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
};

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={`section-${id}`} className="scroll-mt-32">
      {children}
    </section>
  );
}

function LandSection({ values, set }: SectionProps) {
  return (
    <Section id="tanah">
      <SectionHeading
        index="01"
        title="Tanah Anda"
        support="Tak pasti? Tak mengapa — semua ruangan ini adalah pilihan."
      />
      <Card>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="division" optional>
              Bahagian / Division
            </Label>
            <Select
              id="division"
              name="division"
              value={values.division}
              onChange={set("division")}
              options={SARAWAK_DIVISIONS}
            />
          </div>
          <div>
            <Label htmlFor="area" optional>
              Kawasan / Area
            </Label>
            <TextInput
              id="area"
              name="area"
              value={values.area}
              onChange={set("area")}
              placeholder="Contoh: Samariang / Matang / Satok"
            />
          </div>
          <div>
            <Label htmlFor="land_size" optional>
              Anggaran Saiz Tanah
            </Label>
            <TextInput
              id="land_size"
              name="land_size"
              value={values.land_size}
              onChange={set("land_size")}
              placeholder="Contoh: 0.5 acre / 8 points / 3,000 sq ft"
            />
          </div>
          <div>
            <Label htmlFor="remark" optional>
              Catatan / Remark
            </Label>
            <TextInput
              id="remark"
              name="remark"
              value={values.remark}
              onChange={set("remark")}
              placeholder="Apa-apa maklumat tambahan"
            />
          </div>
        </div>
      </Card>
    </Section>
  );
}

function HomeSection({ values, set }: SectionProps) {
  return (
    <Section id="rumah">
      <SectionHeading
        index="02"
        title="Rumah Pilihan Anda"
        support="Beri kami gambaran ringkas rumah impian anda."
      />
      <Card>
        <fieldset>
          <legend className="mb-3 text-[0.8125rem] font-semibold tracking-wide text-navy-800">
            Jenis Rumah
          </legend>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {HOUSE_TYPES.map((type) => (
              <Tile
                key={type.value}
                name="house_type"
                value={type.value}
                checked={values.house_type === type.value}
                onChange={set("house_type")}
                icon={type.icon}
                label={type.label}
              />
            ))}
          </div>
        </fieldset>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="bedrooms">Jumlah Bilik</Label>
            <Select
              id="bedrooms"
              name="bedrooms"
              value={values.bedrooms}
              onChange={set("bedrooms")}
              options={BEDROOM_OPTIONS}
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">Bilik Air / Tandas</Label>
            <Select
              id="bathrooms"
              name="bathrooms"
              value={values.bathrooms}
              onChange={set("bathrooms")}
              options={BATHROOM_OPTIONS}
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
  onOpenCalculator,
}: SectionProps & { onOpenCalculator: () => void }) {
  return (
    <Section id="finance">
      <SectionHeading
        index="03"
        title="Sasaran Pembiayaan"
        support="Pilih anggaran pembiayaan yang anda sasarkan."
      />
      <Card>
        <Label htmlFor="financing_target">Anggaran Pembiayaan</Label>
        <Select
          id="financing_target"
          name="financing_target"
          value={values.financing_target}
          onChange={set("financing_target")}
          options={FINANCING_TARGETS}
        />
      </Card>

      {/* Optional, and visibly so. It sits outside the card to read as an
          aside rather than a step, and it never gates submission. */}
      <div className="mt-4 overflow-hidden rounded-express border border-champagne-300 bg-navy-900">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-champagne-400 sm:text-[0.625rem]">
              &#10024; Optional &bull; Check within 60 seconds
            </p>
            <p className="mt-2 font-display text-[1.0625rem] leading-snug text-white sm:text-[1.1875rem]">
              Nak tahu anggaran kelayakan anda?
            </p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-navy-200">
              Cuba AI Financing Calculator untuk anggaran awal.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCalculator}
            className="champagne-face h-12 shrink-0 rounded-control px-5 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-white transition-[filter] hover:brightness-110 active:brightness-95"
          >
            &#129302; Try AI &rarr;
          </button>
        </div>
      </div>
    </Section>
  );
}

function GuideSection({ values, set }: SectionProps) {
  return (
    <Section id="guide">
      <SectionHeading
        index="04"
        title="Bagaimana Anda Mahu Kami Guide?"
        support="Pilih kaedah konsultasi yang paling sesuai untuk anda."
      />
      <Card>
        <fieldset>
          <legend className="sr-only">Kaedah konsultasi</legend>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {CONSULTATION_MODES.map((mode) => (
              <Tile
                key={mode.value}
                name="consultation_preference"
                value={mode.value}
                checked={values.consultation_preference === mode.value}
                onChange={set("consultation_preference")}
                icon={mode.icon}
                label={mode.label}
                note={mode.note}
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
  consent,
  setConsent,
  errors,
}: SectionProps & {
  consent: boolean;
  setConsent: (value: boolean) => void;
  errors: Errors;
}) {
  return (
    <Section id="done">
      <SectionHeading
        index="05"
        title="Tentang Anda"
        support="Supaya kami boleh daftarkan anda dan guide langkah seterusnya."
      />
      <Card>
        <div className="space-y-5">
          <div>
            <Label htmlFor="customer_name">Nama Penuh</Label>
            <TextInput
              id="customer_name"
              name="customer_name"
              value={values.customer_name}
              onChange={set("customer_name")}
              placeholder="Nama seperti dalam IC"
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
              <Label htmlFor="phone">No. Telefon</Label>
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
              <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="home_number">Ini Adalah Rumah:</Label>
            <Select
              id="home_number"
              name="home_number"
              value={values.home_number}
              onChange={set("home_number")}
              options={HOME_NUMBERS}
            />
          </div>

          <div className="rounded-control border border-navy-100 bg-ivory-100 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                aria-invalid={Boolean(errors.consent) || undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-0.5 size-5 shrink-0 accent-champagne-500"
              />
              <span className="text-[0.8125rem] leading-relaxed text-navy-600">
                Saya bersetuju untuk dihubungi oleh My Kenyalang Homes berkenaan
                pemilikan rumah dan pembiayaan.
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
  status,
  errorCount,
}: {
  status: "idle" | "sending" | "done" | "error";
  errorCount: number;
}) {
  return (
    <div className="text-center">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-champagne-600">
        Anda Hampir Selesai &#10003;
      </p>
      <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-navy-600">
        Hantar sekali. Kami guide langkah seterusnya.
        <br />
        <span className="text-navy-400">Tiada dokumen diperlukan sekarang.</span>
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="champagne-face mt-6 h-[3.75rem] w-full rounded-control text-[0.9375rem] font-bold uppercase tracking-[0.06em] text-white shadow-express transition-[filter] hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:text-base"
      >
        {status === "sending" ? "Menghantar…" : "Hantar & Mulakan Perjalanan Saya →"}
      </button>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {errorCount > 0 ? (
          <p className="mt-3 text-[0.8125rem] font-medium text-danger">
            Sila lengkapkan {errorCount} ruangan di atas.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-3 text-[0.8125rem] font-medium text-danger">
            Maaf, penghantaran tidak berjaya. Sila semak sambungan internet anda
            dan cuba sekali lagi.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ==========================================================================
   Success
   ========================================================================== */

const NEXT_STEPS = [
  "Consultant kami akan menghubungi anda mengikut kaedah pilihan anda.",
  "Email rasmi Process Flow + Documents Checklist akan dihantar.",
  "Anda bersedia untuk proses semakan & submission pembiayaan.",
  "EG Megah boleh menyediakan cadangan rumah berdasarkan keperluan dan sasaran pembiayaan anda.",
];

function SuccessPanel({ leadId, name }: { leadId: string; name: string }) {
  const firstName = name.split(/\s+/)[0] ?? "";
  return (
    <main id="main" className="bg-navy-900">
      <div className="shell max-w-3xl py-16 sm:py-24">
        <div className="flex size-14 items-center justify-center rounded-full border border-champagne-500/40 bg-champagne-500/15 sm:size-16">
          <svg aria-hidden viewBox="0 0 24 24" className="size-7 text-champagne-300 sm:size-8">
            <path
              d="M4 12.5l5 5L20 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-7 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-champagne-400 sm:text-[0.6875rem]">
          Your Journey Has Started
        </p>
        <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2.75rem]">
          Terima Kasih{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-navy-200">
          Maklumat anda telah diterima.
        </p>

        {leadId ? (
          <div className="mt-8 inline-flex flex-col rounded-express border border-navy-700 bg-navy-800 px-5 py-4">
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-navy-300">
              Rujukan Anda
            </span>
            <span className="mt-1 font-display text-[1.375rem] tracking-wide text-champagne-300">
              {leadId}
            </span>
          </div>
        ) : null}

        <ol className="mt-12 space-y-5 border-t border-navy-700 pt-10">
          {NEXT_STEPS.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="shrink-0 font-display text-[0.9375rem] font-bold leading-relaxed tabular-nums text-champagne-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.9375rem] leading-relaxed text-navy-100">{step}</span>
            </li>
          ))}
        </ol>

        <p className="mt-12 border-t border-navy-700 pt-8 text-[0.8125rem] leading-relaxed text-navy-300">
          Tiada dokumen diperlukan sekarang. Simpan nombor rujukan anda untuk
          memudahkan rujukan bersama consultant kami.
        </p>
      </div>
    </main>
  );
}

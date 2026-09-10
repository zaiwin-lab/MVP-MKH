"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Check,
  CircleAlert,
  Clock,
  Coins,
  FileText,
  FolderClosed,
  GraduationCap,
  IdCard,
  Landmark,
  MapPin,
  PencilLine,
  Sparkles,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { ImageSlot } from "@/components/ui/image-slot";
import { Eyebrow, Note, ScriptMark } from "@/components/ui/primitives";
import { EMPLOYMENT_SECTORS } from "@/lib/content";
import { generateReference, useJourney } from "@/lib/journey";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED = [".pdf", ".jpg", ".jpeg", ".png"];

/**
 * Document categories and the keywords that route a dropped file into them.
 * This is deliberately simple filename matching — anything unrecognised falls
 * through to Supporting Documents rather than being silently discarded.
 */
const CATEGORIES = [
  { id: "mykad", label: "MyKad", Icon: IdCard, required: true, keywords: ["mykad", "ic", "identity", "kad"] },
  { id: "payslips", label: "Latest Payslips", Icon: FileText, required: true, keywords: ["payslip", "salary", "gaji", "slip"] },
  { id: "bank", label: "Bank Statements", Icon: Landmark, required: true, keywords: ["bank", "statement", "penyata"] },
  { id: "epf", label: "EPF Statement", Icon: BarChart3, required: true, keywords: ["epf", "kwsp", "provident"] },
  { id: "title", label: "Land Title", Icon: FileText, required: true, keywords: ["title", "geran", "land", "hakmilik"] },
  { id: "supporting", label: "Supporting Documents", Icon: FolderClosed, required: false, keywords: [] },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];
type StoredFile = { name: string; size: number; category: CategoryId };

function categorise(filename: string): CategoryId {
  const lower = filename.toLowerCase();
  for (const category of CATEGORIES) {
    if (category.keywords.some((keyword) => lower.includes(keyword))) {
      return category.id;
    }
  }
  return "supporting";
}

type Errors = Partial<Record<string, string>>;

export default function FinancingApplicationPage() {
  const router = useRouter();
  const { journey, setReference } = useJourney();
  const inputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [mykad, setMykad] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [employer, setEmployer] = useState("");
  const [income, setIncome] = useState("");
  const [commitments, setCommitments] = useState("");
  const [jointApplicant, setJointApplicant] = useState("");

  const [files, setFiles] = useState<StoredFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [fileNotice, setFileNotice] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const filesByCategory = useMemo(() => {
    const map = new Map<CategoryId, StoredFile[]>();
    for (const file of files) {
      map.set(file.category, [...(map.get(file.category) ?? []), file]);
    }
    return map;
  }, [files]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted: StoredFile[] = [];
    const rejected: string[] = [];

    for (const file of Array.from(list)) {
      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!ACCEPTED.includes(extension)) {
        rejected.push(`${file.name} (unsupported format)`);
      } else if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} (over 10MB)`);
      } else {
        accepted.push({
          name: file.name,
          size: file.size,
          category: categorise(file.name),
        });
      }
    }

    setFiles((current) => [...current, ...accepted]);
    setFileNotice(
      rejected.length > 0 ? `Not added: ${rejected.join(", ")}` : "",
    );
  }

  function removeFile(name: string) {
    setFiles((current) => current.filter((file) => file.name !== name));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const next: Errors = {};
    if (!fullName.trim()) next.fullName = "Enter your full name as per MyKad.";
    if (!/^\d{6}-?\d{2}-?\d{4}$/.test(mykad.replace(/\s/g, ""))) {
      next.mykad = "Enter a 12-digit MyKad number, e.g. 900101-13-1234.";
    }
    if (!/^[0-9\s+-]{9,15}$/.test(mobile.trim())) {
      next.mobile = "Enter a valid mobile number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!sector) next.sector = "Select your employment sector.";
    if (!employer.trim()) next.employer = "Enter your employer's name.";
    if (!income || Number(income) <= 0) {
      next.income = "Enter your gross monthly income.";
    }
    if (commitments === "" || Number(commitments) < 0) {
      next.commitments = "Enter your existing monthly commitments (enter 0 if none).";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    // No backend yet: the reference is issued client-side so the confirmation
    // screen has something real to show. Wire to the intake API when ready.
    setReference(generateReference());
    router.push("/confirmation");
  }

  const missingRequired = CATEGORIES.filter(
    (c) => c.required && !filesByCategory.has(c.id),
  ).length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="relative isolate overflow-hidden bg-parchment-50">
          <ImageSlot
            src="/images/hero-financing-form.jpg"
            alt=""
            tone="civic"
            priority
            className="absolute inset-0 -z-10 size-full"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-parchment-50 via-parchment-50/85 to-parchment-50/10" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-parchment-100 to-transparent" />

          <div className="shell relative py-10 md:py-12">
            <ScriptMark
              lines={["Homes for", "A Brighter Tomorrow."]}
              className="absolute right-6 top-8 hidden xl:block"
            />
            <div className="max-w-3xl">
              <Eyebrow>Financing</Eyebrow>
              <h1 className="mt-2 text-hero">
                Submit Once. Let the{" "}
                <span className="text-gold-600">Smart Document Box</span> Guide
                You.
              </h1>
              <p className="mt-3 text-base text-ink-500 md:text-lg">
                Provide your details and upload the required documents for a
                preliminary financing eligibility assessment.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="shell grid gap-4 pb-14 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {/* ------------------------------------------ Your information */}
            <div className="rounded-card border border-parchment-300 bg-white p-5 shadow-card md:p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-parchment-200">
                  <UserRound className="size-5 text-ink-800" aria-hidden />
                </span>
                <div>
                  <h2 className="text-title">Your Information</h2>
                  <p className="text-[0.8125rem] text-ink-500">
                    Tell us a bit about yourself so we can start your financing
                    assessment.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <fieldset>
                  <legend className="mb-3 font-display text-base font-bold text-ink-900">
                    Personal Details
                  </legend>
                  <div className="space-y-3.5">
                    <Field id="fullName" label="Full Name" required error={errors.fullName}>
                      <TextInput
                        id="fullName"
                        value={fullName}
                        invalid={Boolean(errors.fullName)}
                        placeholder="As per MyKad"
                        autoComplete="name"
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Field>

                    <Field id="mykad" label="MyKad Number" required error={errors.mykad}>
                      <TextInput
                        id="mykad"
                        value={mykad}
                        invalid={Boolean(errors.mykad)}
                        placeholder="e.g. 900101-13-1234"
                        inputMode="numeric"
                        onChange={(e) => setMykad(e.target.value)}
                      />
                    </Field>

                    <Field id="mobile" label="Mobile Number" required error={errors.mobile}>
                      <TextInput
                        id="mobile"
                        type="tel"
                        value={mobile}
                        invalid={Boolean(errors.mobile)}
                        placeholder="e.g. 012-345 6789"
                        autoComplete="tel"
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </Field>

                    <Field id="email" label="Email" required error={errors.email}>
                      <TextInput
                        id="email"
                        type="email"
                        value={email}
                        invalid={Boolean(errors.email)}
                        placeholder="e.g. name@email.com"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-3 font-display text-base font-bold text-ink-900">
                    Employment &amp; Financial Details
                  </legend>
                  <div className="space-y-3.5">
                    <Field id="sector" label="Employment Sector" required error={errors.sector}>
                      <SelectInput
                        id="sector"
                        value={sector}
                        invalid={Boolean(errors.sector)}
                        onChange={(e) => setSector(e.target.value)}
                      >
                        <option value="">Please select</option>
                        {EMPLOYMENT_SECTORS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>

                    <Field id="employer" label="Employer" required error={errors.employer}>
                      <TextInput
                        id="employer"
                        value={employer}
                        invalid={Boolean(errors.employer)}
                        placeholder="e.g. Company Sdn Bhd"
                        autoComplete="organization"
                        onChange={(e) => setEmployer(e.target.value)}
                      />
                    </Field>

                    <Field
                      id="income"
                      label="Gross Monthly Income (RM)"
                      required
                      error={errors.income}
                    >
                      <TextInput
                        id="income"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={income}
                        invalid={Boolean(errors.income)}
                        placeholder="e.g. 5,000"
                        onChange={(e) => setIncome(e.target.value)}
                      />
                    </Field>

                    <Field
                      id="commitments"
                      label="Existing Monthly Commitments (RM)"
                      required
                      error={errors.commitments}
                    >
                      <TextInput
                        id="commitments"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={commitments}
                        invalid={Boolean(errors.commitments)}
                        placeholder="e.g. 1,000"
                        onChange={(e) => setCommitments(e.target.value)}
                      />
                    </Field>

                    <Field id="jointApplicant" label="Joint Applicant">
                      <SelectInput
                        id="jointApplicant"
                        value={jointApplicant}
                        onChange={(e) => setJointApplicant(e.target.value)}
                      >
                        <option value="">Please select</option>
                        <option value="none">No joint applicant</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Child</option>
                      </SelectInput>
                    </Field>
                  </div>
                </fieldset>
              </div>
            </div>

            {/* -------------------------------------- Smart Document Box */}
            <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
              <div className="rounded-card border border-parchment-300 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-parchment-200">
                    <FileText className="size-5 text-ink-800" aria-hidden />
                  </span>
                  <div className="min-w-[12rem] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-title">Smart Document Box</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-[0.6875rem] font-semibold text-gold-700">
                        <Sparkles className="size-3" aria-hidden /> AI Assisted
                      </span>
                    </div>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-500">
                      Drop your documents here — we&rsquo;ll identify and
                      organise them into the right categories.
                    </p>
                  </div>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    addFiles(e.dataTransfer.files);
                  }}
                  className={`mt-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    dragging
                      ? "border-gold-500 bg-gold-50"
                      : "border-parchment-400 bg-parchment-50"
                  }`}
                >
                  <UploadCloud
                    className="mx-auto size-10 text-ink-300"
                    aria-hidden
                  />
                  <p className="mt-2 text-sm font-semibold text-ink-700">
                    Drop your documents here
                  </p>
                  <p className="text-[0.8125rem] text-ink-500">
                    or{" "}
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="underline decoration-gold-400 underline-offset-2 hover:text-gold-700"
                    >
                      click to browse files
                    </button>
                  </p>
                  <p className="mt-1.5 text-xs text-ink-400">
                    PDF, JPG, PNG (Max 10MB per file)
                  </p>

                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED.join(",")}
                    className="sr-only"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>

                {fileNotice && (
                  <p role="alert" className="mt-2 text-xs text-danger">
                    {fileNotice}
                  </p>
                )}

                {files.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {files.map((file) => (
                      <li
                        key={file.name}
                        className="flex items-center gap-2 rounded border border-parchment-200 bg-parchment-50 px-3 py-2 text-[0.75rem]"
                      >
                        <FileText className="size-3.5 shrink-0 text-ink-400" aria-hidden />
                        <span className="min-w-0 flex-1 truncate text-ink-700">
                          {file.name}
                        </span>
                        <span className="shrink-0 text-ink-400">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(file.name)}
                          aria-label={`Remove ${file.name}`}
                          className="shrink-0 rounded p-0.5 text-ink-400 hover:bg-parchment-200 hover:text-danger"
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() =>
                    document.getElementById("submit-panel")?.scrollIntoView({ block: "center" })
                  }
                >
                  <Check className="size-4" /> Review My Submission
                </Button>
              </div>

              {/* ------------------------------------ Detected documents */}
              <div className="rounded-card border border-parchment-300 bg-parchment-50 p-4 shadow-card">
                <h3 className="text-[0.9375rem] font-bold text-ink-900">
                  Detected Documents
                </h3>

                <ul className="mt-3 space-y-2" aria-live="polite">
                  {CATEGORIES.map(({ id, label, Icon, required }) => {
                    const matched = filesByCategory.get(id);
                    const count = matched?.length ?? 0;
                    const status = count > 0 ? "Uploaded" : required ? "Missing" : "Optional";
                    const styles =
                      count > 0
                        ? "bg-forest-100 text-forest-700"
                        : required
                          ? "bg-gold-100 text-gold-700"
                          : "bg-parchment-200 text-ink-500";

                    return (
                      <li
                        key={id}
                        className="flex items-center gap-2 rounded-control bg-white px-2.5 py-2"
                      >
                        <Icon className="size-4 shrink-0 text-ink-500" aria-hidden />
                        <span className="min-w-0 flex-1 truncate text-[0.75rem] text-ink-700">
                          {label}
                          {count > 1 && (
                            <span className="text-ink-400"> ({count})</span>
                          )}
                        </span>
                        <span
                          className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ${styles}`}
                        >
                          {count > 0 ? (
                            <Check className="size-3" aria-hidden />
                          ) : (
                            <Clock className="size-3" aria-hidden />
                          )}
                          {status}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {missingRequired > 0 && (
                  <p className="mt-3 text-[0.6875rem] leading-snug text-ink-500">
                    {missingRequired} required{" "}
                    {missingRequired === 1 ? "document is" : "documents are"}{" "}
                    still outstanding. You can submit now and send them later.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------- Summary rail */}
          <aside id="submit-panel" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-parchment-300 bg-white p-4 shadow-card">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-parchment-200">
                  <PencilLine className="size-5 text-ink-800" aria-hidden />
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold text-ink-900">
                    Your Selection Summary
                  </h2>
                  <p className="text-[0.8125rem] text-ink-500">
                    Here&rsquo;s what you&rsquo;re applying for.
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                <SummaryRow
                  href="/choose-land"
                  Icon={MapPin}
                  label="Selected Land"
                  primary={journey.land?.location ?? "Not selected"}
                  secondary={journey.land?.titleStatus || "Residential Land"}
                  image="/images/land/own-land.jpg"
                  tone="land"
                />
                <SummaryRow
                  href="/choose-home"
                  Icon={Banknote}
                  label="Selected Home"
                  primary={journey.home?.code ?? "Not selected"}
                  secondary={journey.home?.name ?? "Choose a design"}
                  image="/images/homes/home-02.jpg"
                  tone="home"
                />
                <SummaryRow
                  href="/financing"
                  Icon={Coins}
                  label="Financing Choice"
                  primary={
                    journey.financing?.choice === "own"
                      ? "Own Financing"
                      : "Bank Financing"
                  }
                  secondary={journey.financing?.institution ?? "Preferred institution"}
                />
              </ul>

              <Button type="submit" size="lg" className="mt-4 w-full">
                Submit for Preliminary Assessment <ArrowRight className="size-4" />
              </Button>

              <div className="mt-3 flex items-start gap-2.5 rounded-control bg-parchment-100 px-3 py-3">
                <Clock className="mt-px size-5 shrink-0 text-ink-500" aria-hidden />
                <p className="text-[0.75rem] leading-snug text-ink-600">
                  We will review your submission and update you on the outcome
                  within <span className="font-semibold">2 weeks</span>.
                </p>
              </div>

              <div className="mt-2">
                <Note
                  tone="warn"
                  icon={<CircleAlert className="size-4 text-danger" aria-hidden />}
                >
                  Submission does not guarantee financing approval. Additional
                  documents may be requested.
                </Note>
              </div>

              <div className="mt-3 flex items-start gap-2.5 border-t border-parchment-200 pt-3">
                <GraduationCap className="mt-0.5 size-5 shrink-0 text-ink-500" aria-hidden />
                <p className="text-[0.75rem] leading-snug text-ink-600">
                  <span className="block font-semibold text-ink-800">Need Help?</span>
                  Learn more about the financing process in How It Works.
                  <Link
                    href="/how-it-works"
                    className="mt-1 flex items-center gap-1 font-medium text-gold-700 hover:underline"
                  >
                    Go to How It Works <ArrowRight className="size-3" />
                  </Link>
                </p>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <SiteFooter variant="pillars" />
    </div>
  );
}

function SummaryRow({
  href,
  Icon,
  label,
  primary,
  secondary,
  image,
  tone = "home",
}: {
  href: string;
  Icon: typeof MapPin;
  label: string;
  primary: string;
  secondary: string;
  image?: string;
  tone?: "land" | "home" | "civic";
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2.5 rounded-control border border-parchment-200 p-2 transition-colors hover:border-gold-300 hover:bg-gold-50/40"
      >
        {image ? (
          <ImageSlot src={image} alt="" tone={tone} className="size-12 shrink-0 rounded" />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded bg-parchment-200">
            <Coins className="size-5 text-ink-500" aria-hidden />
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <Icon className="size-3.5 shrink-0 text-gold-600" aria-hidden />
            <span className="truncate text-[0.8125rem] font-semibold text-ink-800">
              {label}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-[0.75rem] text-ink-600">
            {primary}
          </span>
          <span className="block truncate text-[0.6875rem] text-ink-400">
            {secondary}
          </span>
        </span>
      </Link>
    </li>
  );
}

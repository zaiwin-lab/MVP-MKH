"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleCheckBig,
  Download,
  FileText,
  Home as HomeIcon,
  Landmark,
  Mail,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button, ButtonLink } from "@/components/ui/button";
import { ImageSlot } from "@/components/ui/image-slot";
import { Eyebrow } from "@/components/ui/primitives";
import { useJourney, type FinancingChoice } from "@/lib/journey";

const OWN_TIMELINE = [
  { Icon: FileText, title: "Selection Summary Received", body: "We've received your submission." },
  { Icon: Users, title: "Project Team Review", body: "Our team will review your details." },
  { Icon: FileText, title: "Official Documents Prepared", body: "We will prepare your Letter of Intent and project information." },
  { Icon: Mail, title: "Email Issued Within 1 Week", body: "You will receive an email with the next steps and documents." },
];

const BANK_TIMELINE = [
  { Icon: FileText, title: "Application Received", body: "Your details and documents are with us." },
  { Icon: Users, title: "Preliminary Review", body: "We check your submission is complete." },
  { Icon: Landmark, title: "Shared With Your Institution", body: "Your selected financier assesses eligibility." },
  { Icon: Mail, title: "Outcome Within 2 Weeks", body: "We update you on the preliminary assessment." },
];

export default function ConfirmationPage() {
  const { journey, hydrated } = useJourney();

  // The tab follows the applicant's actual choice until they pick another,
  // so it needs no effect to stay in sync with the stored journey.
  const [chosenTab, setChosenTab] = useState<FinancingChoice | null>(null);
  const tab: FinancingChoice = chosenTab ?? journey.financing?.choice ?? "own";

  const reference = journey.reference;
  const isOwn = tab === "own";
  const timeline = isOwn ? OWN_TIMELINE : BANK_TIMELINE;

  // Someone who opens this URL directly has no submission behind it. Say so
  // rather than inventing a reference number they could try to quote at us.
  if (hydrated && !reference) {
    return <NoSubmission />;
  }

  function downloadSummary() {
    const lines = [
      "MY KENYALANG HOMES — SUBMISSION SUMMARY",
      "=======================================",
      `Reference:        ${reference}`,
      `Generated:        ${new Date().toLocaleString("en-MY")}`,
      "",
      "LAND",
      `  Ownership:      ${journey.land?.ownership ?? "—"}`,
      `  Location:       ${journey.land?.location ?? "—"}`,
      `  Lot size:       ${journey.land?.lotSize ?? "—"}`,
      `  Title status:   ${journey.land?.titleStatus || "—"}`,
      `  Registered to:  ${journey.land?.registeredOwner || "—"}`,
      "",
      "HOME",
      `  Design:         ${journey.home?.code ?? "—"}`,
      `  Name:           ${journey.home?.name ?? "—"}`,
      "",
      "FINANCING",
      `  Pathway:        ${journey.financing?.choice === "own" ? "Own Financing" : "Bank Financing"}`,
      `  Institution:    ${journey.financing?.institution ?? "—"}`,
      "",
      "This summary confirms receipt of your selections. It is not a",
      "financing approval and does not constitute an offer.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${reference ?? "MKH"}-summary.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="relative isolate overflow-hidden bg-parchment-50">
          <ImageSlot
            src="/images/hero-confirmation.jpg"
            alt=""
            tone="home"
            priority
            className="absolute inset-0 -z-10 size-full"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-parchment-50 via-parchment-50/85 to-parchment-50/10" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-parchment-100 to-transparent" />

          <div className="shell relative py-10 md:py-14">
            <div className="max-w-3xl">
              <Eyebrow>Your Application</Eyebrow>
              <h1 className="mt-2 text-hero">
                Congratulations &mdash;
                <br />
                Your Home Journey Is Officially{" "}
                <span className="text-gold-600">Underway.</span>
              </h1>
              <p className="mt-3 text-base text-ink-500 md:text-lg">
                Thank you for choosing My Kenyalang Homes. We&rsquo;re excited to
                be part of your journey towards a brighter tomorrow.
              </p>
            </div>
          </div>
        </section>

        <section className="shell pb-14">
          <div className="overflow-hidden rounded-card border border-parchment-300 bg-white shadow-card">
            {/* --------------------------------------------------- Tabs */}
            <div role="tablist" aria-label="Financing pathway" className="grid gap-px bg-parchment-200 sm:grid-cols-2">
              {(
                [
                  { id: "own" as const, Icon: HomeIcon, title: "Own Financing", body: "Self-financed purchase" },
                  { id: "bank" as const, Icon: Landmark, title: "Financing Application", body: "Apply for bank financing" },
                ]
              ).map(({ id, Icon, title, body }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    type="button"
                    id={`tab-${id}`}
                    aria-selected={active}
                    aria-controls={`panel-${id}`}
                    onClick={() => setChosenTab(id)}
                    className={`flex items-center justify-center gap-3 px-5 py-4 text-left transition-colors ${
                      active
                        ? "border-b-2 border-gold-500 bg-forest-700 text-white"
                        : "bg-parchment-50 text-ink-600 hover:bg-parchment-100"
                    }`}
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        active ? "bg-white/15" : "bg-white"
                      }`}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-lg font-bold">{title}</span>
                      <span className={`block text-[0.75rem] ${active ? "text-white/75" : "text-ink-500"}`}>
                        {body}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* -------------------------------------------------- Panel */}
            <div
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              className="grid gap-6 p-5 md:p-7 lg:grid-cols-[18rem_1fr]"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <span className="relative flex size-28 items-center justify-center rounded-full bg-forest-50">
                  <span className="absolute inset-2 rounded-full bg-forest-700" />
                  <CircleCheckBig className="relative size-12 text-white" aria-hidden />
                </span>

                <h2 className="mt-5 font-display text-2xl font-bold leading-snug text-ink-900">
                  {isOwn
                    ? "Your land, home and self-financing selections have been received."
                    : "Your financing application and documents have been received."}
                </h2>

                <p className="mt-3 text-[0.8125rem] text-ink-500">
                  Reference:{" "}
                  <span className="font-semibold tracking-wide text-ink-800">
                    {reference ?? "\u2014"}
                  </span>
                </p>
              </div>

              <div className="rounded-card border border-parchment-300 bg-parchment-50">
                <div className="flex items-start gap-3 border-b border-parchment-200 p-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-100">
                    <CalendarDays className="size-6 text-gold-700" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink-900">
                      What Happens Next
                    </h3>
                    <p className="mt-1 text-[0.875rem] text-ink-600">
                      {isOwn ? (
                        <>
                          Within <span className="font-semibold">1 week</span>, we
                          will email your Letter of Intent, project plan, payment
                          and financing arrangement details, and the next
                          documents required to proceed.
                        </>
                      ) : (
                        <>
                          We will review your information and documents for a
                          preliminary financing eligibility assessment and update
                          you on the outcome within{" "}
                          <span className="font-semibold">2 weeks</span>.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <ol className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  {timeline.map(({ Icon, title, body }, index) => (
                    <li key={title} className="relative text-center">
                      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest-50">
                        <Icon className="size-6 text-forest-700" aria-hidden />
                      </span>
                      <p className="mt-2.5 font-display text-[0.9375rem] font-bold leading-tight text-ink-900">
                        {title}
                      </p>
                      <p className="mt-1 text-[0.75rem] leading-snug text-ink-500">
                        {body}
                      </p>

                      {index < timeline.length - 1 && (
                        <ChevronRight
                          aria-hidden
                          className="absolute -right-2.5 top-4 hidden size-5 text-ink-300 sm:block lg:block"
                        />
                      )}
                    </li>
                  ))}
                </ol>

                <div className="flex flex-wrap justify-center gap-3 border-t border-parchment-200 p-5">
                  <Button onClick={downloadSummary} size="lg">
                    <Download className="size-4" /> Download Submission Summary
                  </Button>
                  <ButtonLink href="/" variant="outline" size="lg">
                    <HomeIcon className="size-4" /> Return to Home
                  </ButtonLink>
                </div>
              </div>
            </div>

            {/* ------------------------------------------- Cross-link strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-parchment-200 bg-parchment-100 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                  {isOwn ? (
                    <Landmark className="size-5 text-ink-700" aria-hidden />
                  ) : (
                    <HomeIcon className="size-5 text-ink-700" aria-hidden />
                  )}
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-base font-bold text-ink-900">
                    {isOwn ? "Financing Application" : "Own Financing"}
                  </span>
                  <span className="block text-[0.75rem] text-ink-500">
                    {isOwn ? "Apply for bank financing" : "Self-financed purchase"}
                  </span>
                </span>
              </div>

              <p className="min-w-[16rem] flex-1 text-[0.8125rem] text-ink-600">
                {isOwn
                  ? "If you selected bank financing, we will review your information and documents for a preliminary financing eligibility assessment and update you on the outcome within 2 weeks."
                  : "Prefer to fund the project yourself? You can continue with your own financial arrangement at any time."}
              </p>

              <ButtonLink
                href={isOwn ? "/financing/apply" : "/financing"}
                variant="outline"
              >
                {isOwn ? "View Financing Journey" : "View Own Financing"}{" "}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="compact" />
    </div>
  );
}

/** Shown when the confirmation page is opened without a submission behind it. */
function NoSubmission() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center">
        <div className="shell py-20 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-parchment-200">
            <FileText className="size-7 text-ink-500" aria-hidden />
          </span>
          <h1 className="mt-5 text-display">No submission to show yet.</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-500">
            This page confirms a completed selection. Start with your land and
            we&rsquo;ll bring you back here once everything is submitted.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/choose-land" size="lg">
              Start My Journey <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/" variant="outline" size="lg">
              <HomeIcon className="size-4" /> Return to Home
            </ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter variant="compact" />
    </div>
  );
}

import type { Metadata } from "next";
import {
  ArrowRight,
  FileText,
  Flag,
  Home as HomeIcon,
  Landmark,
  Mail,
  Mountain,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ButtonLink } from "@/components/ui/button";
import { ImageSlot } from "@/components/ui/image-slot";
import { PageHero } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From your land to your new home — a clear, guided five-step journey through land selection, home design, financing, submission and next steps.",
};

const STEPS = [
  {
    n: 1,
    Icon: Mountain,
    title: "Choose Your Land",
    body: "Use your own land, family or third-party land, or explore available land.",
  },
  {
    n: 2,
    Icon: HomeIcon,
    title: "Choose Your Home",
    body: "Select from six thoughtfully designed homes or request a custom design.",
  },
  {
    n: 3,
    Icon: ReceiptText,
    title: "Choose Your Financing",
    body: "Proceed with your own financing or apply through a financial institution.",
  },
  {
    n: 4,
    Icon: FileText,
    title: "Submit Your Details",
    body: "Confirm your choices. Financing applicants upload the required documents securely.",
  },
  {
    n: 5,
    Icon: Mail,
    title: "Congratulations!",
    body: "Let's Start Building Your Dream Home!",
    celebrate: true,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <PageHero
          eyebrow="How It Works"
          title="From Your Land to Your"
          accent="New Home."
          lead="A clear, guided journey designed to move you forward with confidence."
          image={
            <ImageSlot
              src="/images/hero-how-it-works.jpg"
              alt=""
              tone="civic"
              priority
              className="size-full"
            />
          }
        />

        <section className="shell pb-14">
          <div className="rounded-card border border-parchment-300 bg-white p-5 shadow-card md:p-7">
            <h2 className="text-title">Your Journey in Five Simple Steps</h2>

            {/* --------------------------------------------------- Timeline */}
            <ol className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map(({ n, Icon, title, body, celebrate }, index) => (
                <li key={n} className="relative text-center">
                  <div className="relative mx-auto w-fit">
                    <span
                      className={`flex size-[4.5rem] items-center justify-center rounded-full ${
                        celebrate ? "bg-gold-50" : "bg-forest-50"
                      }`}
                    >
                      <Icon
                        className={`size-8 ${celebrate ? "text-gold-700" : "text-ink-800"}`}
                        aria-hidden
                      />
                    </span>

                    <span className="absolute -left-3 -top-2 flex size-7 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-white">
                      {n}
                    </span>

                    {celebrate && (
                      <>
                        <Sparkles
                          aria-hidden
                          className="absolute -right-4 -top-2 size-5 text-gold-400"
                        />
                        <Sparkles
                          aria-hidden
                          className="absolute -bottom-1 -right-5 size-3.5 text-gold-300"
                        />
                      </>
                    )}
                  </div>

                  <h3
                    className={`mt-3.5 font-display text-lg font-bold leading-tight ${
                      celebrate ? "text-gold-700" : "text-ink-900"
                    }`}
                  >
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-500">
                    {body}
                  </p>

                  {/* Connector, drawn between steps on wide screens only. */}
                  {index < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[calc(50%+2.75rem)] top-9 hidden h-px w-[calc(100%-5.5rem)] bg-gold-300 lg:block"
                    />
                  )}
                </li>
              ))}
            </ol>

            {/* ------------------------------------------ Financing pathways */}
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <article className="relative isolate overflow-hidden rounded-card border-2 border-forest-600 p-5 text-white">
                <ImageSlot
                  src="/images/own-financing-wide.jpg"
                  alt=""
                  tone="land"
                  className="absolute inset-0 -z-10 size-full"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-800 via-forest-800/90 to-forest-800/40" />

                <span className="flex size-14 items-center justify-center rounded-full bg-white">
                  <HomeIcon className="size-7 text-forest-800" aria-hidden />
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-white">
                  Using Your Own Financing
                </h3>
                <p className="mt-2 max-w-md text-[0.875rem] leading-snug text-white/85">
                  Your selections are confirmed. Within 1 week, we will email
                  your Letter of Intent, project plan, payment arrangement and
                  the next documents required.
                </p>
              </article>

              <article className="relative isolate overflow-hidden rounded-card border border-parchment-300 bg-white p-5">
                <ImageSlot
                  src="/images/bank-financing-wide.jpg"
                  alt=""
                  tone="civic"
                  className="absolute inset-0 -z-10 size-full opacity-30"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/90 to-white/50" />

                <div className="flex items-start gap-3">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-parchment-200">
                    <Landmark className="size-7 text-ink-800" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink-900">
                      Applying Through a Financial Institution
                    </h3>
                    <p className="mt-2 max-w-md text-[0.875rem] leading-snug text-ink-600">
                      Check your indicative financing eligibility, then submit
                      your information and supporting documents through the
                      Smart Document Box. We will update you on the preliminary
                      assessment outcome within 2 weeks, subject to the
                      financial institution&rsquo;s assessment.
                    </p>

                    <ButtonLink
                      href="/financing#calculator"
                      variant="outline"
                      className="mt-3.5"
                    >
                      Try AI Eligibility Calculator <ArrowRight className="size-4" />
                    </ButtonLink>

                    <p className="mt-3 text-[0.6875rem] text-ink-400">
                      Indicative calculations and preliminary assessments are
                      not financing approvals.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* ------------------------------------------------------- CTA */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-card bg-parchment-100 p-5">
              <span className="flex size-12 items-center justify-center rounded-full bg-gold-100">
                <Flag className="size-6 text-gold-600" aria-hidden />
              </span>
              <p className="font-display text-2xl font-bold text-ink-900">
                Ready to begin your home journey?
              </p>
              <ButtonLink href="/choose-land" size="lg">
                Start With My Land <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="pillars" />
    </div>
  );
}

import { ArrowRight, Calculator, ChevronRight, Cpu, FileText, Home as HomeIcon, Leaf, Mountain, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ButtonLink } from "@/components/ui/button";
import { ImageSlot } from "@/components/ui/image-slot";
import { Eyebrow, ScriptMark } from "@/components/ui/primitives";

const JOURNEY = [
  {
    href: "/choose-land",
    n: 1,
    title: "Choose Your Land",
    body: "Own land, family land or find a suitable location.",
    image: "/images/journey/land.jpg",
    tone: "land" as const,
  },
  {
    href: "/choose-home",
    n: 2,
    title: "Choose Your Home",
    body: "Explore six home designs or choose a custom option.",
    image: "/images/journey/home.jpg",
    tone: "home" as const,
  },
  {
    href: "/financing",
    n: 3,
    title: "Choose Your Financing",
    body: "Use your own financing or submit for a preliminary financing eligibility assessment.",
    image: "/images/journey/financing.jpg",
    tone: "document" as const,
  },
];

const PROMISES = [
  { Icon: Leaf, title: "Built for Sarawak", body: "Homes for stronger communities." },
  { Icon: Users, title: "For Malaysian Families", body: "Real homes for real life." },
  { Icon: HomeIcon, title: "Trusted Partnership", body: "EG Megah Holdings × KOBIS Berhad." },
  { Icon: Mountain, title: "A Brighter Sarawak", body: "Growing together for tomorrow." },
];

const CALCULATOR_ASSURANCES = [
  { Icon: Calculator, title: "Fast", body: "and easy" },
  { Icon: FileText, title: "Private", body: "and secure" },
  { Icon: ShieldCheck, title: "No obligation", body: "to proceed" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative isolate overflow-hidden">
          <ImageSlot
            src="/images/hero-family.jpg"
            alt="A family standing in front of their new Sarawak home"
            tone="home"
            priority
            className="absolute inset-0 -z-10 size-full"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-parchment-50 via-parchment-50/90 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-parchment-100 to-transparent" />

          <div className="shell relative py-14 md:py-20">
            <ScriptMark
              lines={["Same Land.", "A Brighter Tomorrow."]}
              className="absolute right-6 top-8 hidden [text-shadow:0_1px_12px_rgb(253_252_249_/_0.9)] xl:block"
            />

            <div className="max-w-xl">
              <Eyebrow>Homes for a Brighter Sarawak</Eyebrow>
              <h1 className="mt-2 text-hero">
                Your Land. Your Home.
                <br />
                <span className="text-gold-600">Your Way Forward.</span>
              </h1>
              <p className="mt-4 max-w-lg text-base text-ink-500 md:text-lg">
                Choose your land, discover the right home and find a financing
                pathway — all in one trusted place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/choose-land" size="lg">
                  Start My Journey <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href="/financing#calculator" variant="outline" size="lg">
                  <Calculator className="size-4" /> Check My Financing Eligibility
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- Three steps */}
        <section className="shell -mt-2 pb-4" aria-label="How the journey works">
          <ol className="grid gap-4 md:grid-cols-3">
            {JOURNEY.map((step, index) => (
              <li key={step.href} className="relative">
                <Link
                  href={step.href}
                  className="group flex h-full items-center gap-4 rounded-card border border-parchment-300 bg-white p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-float"
                >
                  <ImageSlot
                    src={step.image}
                    alt=""
                    tone={step.tone}
                    className="size-[4.5rem] shrink-0 rounded-lg"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-full bg-forest-700 text-xs font-bold text-white">
                        {step.n}
                      </span>
                      <span className="font-display text-lg font-bold text-ink-900">
                        {step.title}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[0.8125rem] leading-snug text-ink-500">
                      {step.body}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-500" />
                </Link>

                {index < JOURNEY.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 text-ink-300 md:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- AI calculator CTA */}
        <section className="shell py-4">
          <div className="overflow-hidden rounded-card border border-forest-200 bg-gradient-to-r from-forest-50 via-forest-50 to-parchment-100">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5 p-5 md:p-6">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-white">
                <Cpu className="size-7" aria-hidden />
              </span>

              <div className="min-w-[16rem] flex-1">
                <Eyebrow>Plan Smarter Today</Eyebrow>
                <h2 className="mt-1 text-title">AI Financing Eligibility Calculator</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Get an instant initial indication before you apply.
                </p>
              </div>

              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {CALCULATOR_ASSURANCES.map(({ Icon, title, body }) => (
                  <li key={title} className="flex items-center gap-2.5">
                    <Icon className="size-5 shrink-0 text-forest-600" aria-hidden />
                    <span className="text-[0.8125rem] leading-tight text-ink-600">
                      <span className="block font-semibold text-ink-800">{title}</span>
                      {body}
                    </span>
                  </li>
                ))}
              </ul>

              <ButtonLink href="/financing#calculator" variant="forest" size="lg">
                Try the AI Calculator <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ Promises */}
        <section className="relative isolate overflow-hidden pt-10">
          <div className="shell">
            <h2 className="text-center text-display">
              A clearer pathway from land selection to financing submission.
            </h2>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROMISES.map(({ Icon, title, body }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-parchment-200">
                    <Icon className="size-5 text-forest-600" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-display text-base font-bold text-ink-900">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-ink-500">
                      {body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sunset skyline closing the page, echoed by the footer beneath it. */}
          <div className="relative mt-10 h-56 md:h-72">
            <ImageSlot
              src="/images/kuching-sunset.jpg"
              alt="The Kuching waterfront at sunset"
              tone="civic"
              className="absolute inset-0 size-full"
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-parchment-100 to-transparent" />
            {/* The sky in this photograph is bright, so the white script needs
                its own scrim rather than relying on a drop shadow. */}
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-forest-900/55 to-transparent md:block" />
            <div className="shell relative flex h-full items-end justify-end pb-8">
              <ScriptMark
                lines={["More Than Homes.", "A Brighter Sarawak."]}
                className="hidden text-white [text-shadow:0_1px_10px_rgb(8_37_27_/_0.7)] md:block"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="compact" />
    </div>
  );
}

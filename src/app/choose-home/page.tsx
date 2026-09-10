"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  BarChart3,
  Check,
  ChevronRight,
  Coins,
  Home as HomeIcon,
  MapPin,
  PencilRuler,
  Ruler,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button, ButtonLink } from "@/components/ui/button";
import { ImageSlot } from "@/components/ui/image-slot";
import { Eyebrow } from "@/components/ui/primitives";
import { HOME_DESIGNS, type HomeDesign } from "@/lib/content";
import { useJourney } from "@/lib/journey";

const SPECS = [
  { key: "builtUpArea", label: "Built-up Area", Icon: Ruler },
  { key: "bedrooms", label: "Bedrooms", Icon: BedDouble },
  { key: "bathrooms", label: "Bathrooms", Icon: Bath },
  { key: "indicativePrice", label: "Indicative Price", Icon: Coins },
] as const;

const CUSTOM_STEPS = [
  { Icon: PencilRuler, label: "Your Ideas" },
  { Icon: Users, label: "Our Design Team" },
  { Icon: HomeIcon, label: "A Home Uniquely Yours" },
];

export default function ChooseHomePage() {
  const router = useRouter();
  const { journey, setHome, hydrated } = useJourney();
  const [comparing, setComparing] = useState(false);

  const selectedId = journey.home?.id;

  function choose(design: HomeDesign) {
    setHome({ id: design.id, code: design.code, name: design.name });
  }

  function chooseAndContinue(design: HomeDesign) {
    choose(design);
    router.push("/financing");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* ------------------------------------------------- Hero + land card */}
        <section className="relative isolate overflow-hidden bg-parchment-50">
          <ImageSlot
            src="/images/hero-homes.jpg"
            alt=""
            tone="civic"
            priority
            className="absolute inset-0 -z-10 size-full"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-parchment-50 via-parchment-50/85 to-parchment-50/20" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-parchment-100 to-transparent" />

          <div className="shell relative flex flex-wrap items-start justify-between gap-6 py-10 md:py-12">
            <div className="max-w-2xl">
              <Eyebrow>Choose Home</Eyebrow>
              <h1 className="mt-2 text-hero">
                Choose the Home You&rsquo;ll{" "}
                <span className="text-gold-600">Love</span> Coming Back To.
              </h1>
              <p className="mt-3 text-base text-ink-500 md:text-lg">
                Six thoughtfully planned designs, with one custom path for
                something uniquely yours.
              </p>
            </div>

            <SelectedLandCard
              hydrated={hydrated}
              location={journey.land?.location}
              titleStatus={journey.land?.titleStatus}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- Home grid */}
        <section className="shell py-2" aria-label="Home designs">
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {HOME_DESIGNS.map((design) => {
              const isSelected = selectedId === design.id;
              return (
                <li key={design.id}>
                  <article
                    className={`flex h-full flex-col overflow-hidden rounded-card border-2 bg-white shadow-card transition-all ${
                      isSelected
                        ? "border-forest-600"
                        : "border-transparent hover:-translate-y-0.5 hover:shadow-float"
                    }`}
                  >
                    <div className="relative m-2 mb-0">
                      <ImageSlot
                        src={design.image}
                        alt={`${design.code} — ${design.name}`}
                        tone="home"
                        className="h-44 w-full rounded-lg"
                      />
                      {isSelected && (
                        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-forest-700 px-2.5 py-1 text-[0.6875rem] font-semibold text-white">
                          <Check className="size-3" aria-hidden /> Selected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3.5">
                      <h2 className="font-display text-xl font-bold text-ink-900">
                        {design.code}
                      </h2>
                      <p className="text-[0.8125rem] text-ink-500">{design.name}</p>

                      <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-3 border-t border-parchment-200 pt-3 sm:grid-cols-4">
                        {SPECS.map(({ key, label, Icon }) => (
                          <div key={key} className="flex items-start gap-1">
                            <Icon
                              className="mt-0.5 size-3.5 shrink-0 text-ink-400"
                              aria-hidden
                            />
                            {/* Labels stay on one line; the placeholder value
                                "To Be Confirmed" is the widest string these
                                columns ever hold, so it sets the type size. */}
                            <div className="min-w-0">
                              <dt className="truncate text-[0.625rem] leading-tight text-ink-500">
                                {label}
                              </dt>
                              <dd className="truncate text-[0.625rem] leading-tight text-ink-400">
                                {design[key]}
                              </dd>
                            </div>
                          </div>
                        ))}
                      </dl>

                      <Button
                        onClick={() => chooseAndContinue(design)}
                        variant={isSelected ? "forest" : "gold"}
                        className="mt-3.5 w-full"
                      >
                        {isSelected ? "Continue With This Home" : "Choose This Home"}
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ----------------------------------------------------- Custom home */}
        <section className="shell py-3">
          <div className="overflow-hidden rounded-card border border-parchment-300 bg-white shadow-card">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-5 p-3">
              <ImageSlot
                src="/images/custom-home.jpg"
                alt=""
                tone="land"
                className="h-24 w-full shrink-0 rounded-lg sm:w-64"
              />

              <div className="min-w-[14rem] flex-1">
                <h2 className="font-display text-2xl font-bold text-ink-900">
                  Custom Home
                </h2>
                <p className="mt-0.5 text-sm text-ink-500">
                  Share your vision with our design team.
                </p>
              </div>

              <ol className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-lg bg-parchment-100 px-4 py-3">
                {CUSTOM_STEPS.map(({ Icon, label }, index) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex flex-col items-center gap-1 text-center">
                      <Icon className="size-5 text-ink-700" aria-hidden />
                      <span className="text-[0.6875rem] text-ink-500">{label}</span>
                    </span>
                    {index < CUSTOM_STEPS.length - 1 && (
                      <ChevronRight
                        className="size-4 text-ink-300"
                        aria-hidden
                      />
                    )}
                  </li>
                ))}
              </ol>

              <ButtonLink href="/financing" variant="outline">
                Get Started <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Compare + next */}
        <section className="shell pb-12 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setComparing((v) => !v)}
              aria-expanded={comparing}
              aria-controls="comparison"
            >
              <BarChart3 className="size-4" />
              {comparing ? "Hide Comparison" : "Compare Homes"}
            </Button>

            <ButtonLink href="/financing" size="lg">
              Continue to Financing <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          {comparing && (
            <div
              id="comparison"
              className="mt-4 overflow-x-auto rounded-card border border-parchment-300 bg-white shadow-card"
            >
              <table className="w-full min-w-[44rem] text-left text-sm">
                <caption className="sr-only">
                  Specifications compared across all six home designs
                </caption>
                <thead>
                  <tr className="border-b border-parchment-200">
                    <th scope="col" className="p-3 text-[0.8125rem] font-semibold text-ink-800">
                      Design
                    </th>
                    {SPECS.map(({ key, label }) => (
                      <th
                        key={key}
                        scope="col"
                        className="p-3 text-[0.8125rem] font-semibold text-ink-800"
                      >
                        {label}
                      </th>
                    ))}
                    <th scope="col" className="p-3">
                      <span className="sr-only">Select</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {HOME_DESIGNS.map((design) => (
                    <tr
                      key={design.id}
                      className="border-b border-parchment-200 last:border-0"
                    >
                      <th scope="row" className="p-3 font-semibold text-ink-800">
                        {design.code}
                        <span className="block text-[0.75rem] font-normal text-ink-500">
                          {design.name}
                        </span>
                      </th>
                      {SPECS.map(({ key }) => (
                        <td key={key} className="p-3 text-[0.8125rem] text-ink-400">
                          {design[key]}
                        </td>
                      ))}
                      <td className="p-3">
                        <Button size="sm" onClick={() => choose(design)}>
                          {selectedId === design.id ? "Selected" : "Select"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <SiteFooter variant="pillars" />
    </div>
  );
}

/** Floating summary of the land chosen in the previous step. */
function SelectedLandCard({
  hydrated,
  location,
  titleStatus,
}: {
  hydrated: boolean;
  location?: string;
  titleStatus?: string;
}) {
  return (
    <aside className="w-full max-w-[19rem] rounded-card border border-parchment-300 bg-white/95 p-3 shadow-float backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-gold-500 text-white">
          <MapPin className="size-4" aria-hidden />
        </span>
        <p className="flex-1 text-[0.8125rem] font-semibold text-ink-800">
          Selected Land
        </p>
        <Link
          href="/choose-land"
          className="flex items-center gap-0.5 text-xs text-ink-500 transition-colors hover:text-gold-600"
        >
          Edit <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <ImageSlot src="/images/land/own-land.jpg" alt="" tone="land" className="h-16 w-full rounded" />
        <ImageSlot src="/images/land/find-land.jpg" alt="" tone="civic" className="h-16 w-full rounded" />
      </div>

      <div className="mt-2.5 flex items-end justify-between gap-2">
        <p className="text-[0.8125rem] leading-tight">
          <span className="block font-semibold text-ink-800">
            {hydrated ? (location ?? "No land selected") : " "}
          </span>
          <span className="block text-xs text-ink-500">
            {hydrated ? (titleStatus || "Residential Land") : " "}
          </span>
        </p>

        {hydrated && location && (
          <p className="flex shrink-0 items-center gap-1 text-xs font-medium text-forest-600">
            <Check className="size-3.5" aria-hidden /> Land Selected
          </p>
        )}
      </div>
    </aside>
  );
}

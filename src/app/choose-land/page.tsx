"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Handshake, Info, MapPin, Trees } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { ImageSlot } from "@/components/ui/image-slot";
import { Note, PageHero } from "@/components/ui/primitives";
import { SARAWAK_DIVISIONS, TITLE_STATUSES } from "@/lib/content";
import { useJourney, type LandOwnership } from "@/lib/journey";

const OPTIONS: {
  id: LandOwnership;
  Icon: typeof Trees;
  title: string;
  body: string;
  image: string;
  tone: "land" | "home" | "civic";
}[] = [
  {
    id: "own",
    Icon: Trees,
    title: "I Own the Land",
    body: "Upload title later.",
    image: "/images/land/own-land.jpg",
    tone: "land",
  },
  {
    id: "third-party",
    Icon: Handshake,
    title: "Use Family or Third-Party Land",
    body: "Owner consent required.",
    image: "/images/land/family-land.jpg",
    tone: "home",
  },
  {
    id: "help-me-find",
    Icon: MapPin,
    title: "Help Me Find Land",
    body: "Explore available market options.",
    image: "/images/land/find-land.jpg",
    tone: "civic",
  },
];

type Errors = Partial<Record<"location" | "lotSize" | "titleStatus" | "registeredOwner", string>>;

export default function ChooseLandPage() {
  const router = useRouter();
  const { journey, setLand } = useJourney();

  const [ownership, setOwnership] = useState<LandOwnership>("own");
  const [location, setLocation] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [titleStatus, setTitleStatus] = useState("");
  const [registeredOwner, setRegisteredOwner] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  // Someone still looking for land has no title or owner to declare yet.
  const seekingLand = ownership === "help-me-find";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const next: Errors = {};
    if (!location) next.location = "Select where the land is located.";
    if (!lotSize.trim()) next.lotSize = "Enter the approximate lot size.";
    if (!seekingLand && !titleStatus) next.titleStatus = "Select the title status.";
    if (!seekingLand && !registeredOwner.trim()) {
      next.registeredOwner = "Enter the registered owner's full name as per title.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setLand({ ownership, location, lotSize, titleStatus, registeredOwner });
    router.push("/choose-home");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <PageHero
          eyebrow="Choose Land"
          title="Start With the Land That Fits"
          accent="Your Story."
          lead="Tell us where your future home will stand."
          image={
            <ImageSlot
              src="/images/hero-land.jpg"
              alt=""
              tone="civic"
              priority
              className="size-full"
            />
          }
        />

        <form onSubmit={handleSubmit} className="shell pb-14">
          {/* --------------------------------------------- Ownership pathway */}
          <fieldset>
            <legend className="sr-only">How will you provide the land?</legend>
            <div className="grid gap-4 md:grid-cols-3">
              {OPTIONS.map(({ id, Icon, title, body, image, tone }) => {
                const selected = ownership === id;
                return (
                  <label
                    key={id}
                    className={`group cursor-pointer rounded-card border-2 bg-white p-3 shadow-card transition-all ${
                      selected
                        ? "border-forest-600 bg-forest-50/40"
                        : "border-transparent hover:border-gold-300"
                    }`}
                  >
                    <span className="relative block">
                      <ImageSlot
                        src={image}
                        alt=""
                        tone={tone}
                        className="h-36 w-full rounded-lg"
                      />
                      <span className="absolute left-3 top-3 flex size-12 items-center justify-center rounded-full bg-white/95 shadow-sm">
                        <Icon className="size-6 text-forest-700" aria-hidden />
                      </span>
                    </span>

                    <span className="mt-3 flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="ownership"
                        value={id}
                        checked={selected}
                        onChange={() => setOwnership(id)}
                        className="mt-1 size-4 shrink-0 accent-forest-600"
                      />
                      <span>
                        <span className="block font-display text-lg font-bold text-ink-900">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-[0.8125rem] text-ink-500">
                          {body}
                        </span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* -------------------------------------------------- Land details */}
          <div className="mt-5 rounded-card border border-parchment-300 bg-white p-5 shadow-card md:p-7">
            <h2 className="text-title">Tell Us About the Land</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <Field
                id="location"
                label="Land Location"
                required
                error={errors.location}
              >
                <SelectInput
                  id="location"
                  value={location}
                  invalid={Boolean(errors.location)}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select state, division or area</option>
                  {SARAWAK_DIVISIONS.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field
                id="lotSize"
                label="Approximate Lot Size"
                required
                error={errors.lotSize}
              >
                <TextInput
                  id="lotSize"
                  value={lotSize}
                  invalid={Boolean(errors.lotSize)}
                  placeholder="e.g. 6000 sq ft"
                  onChange={(e) => setLotSize(e.target.value)}
                />
              </Field>

              <Field
                id="titleStatus"
                label="Title Status"
                required={!seekingLand}
                error={errors.titleStatus}
                hint={seekingLand ? "Not needed while you are still looking." : undefined}
              >
                <SelectInput
                  id="titleStatus"
                  value={titleStatus}
                  disabled={seekingLand}
                  invalid={Boolean(errors.titleStatus)}
                  onChange={(e) => setTitleStatus(e.target.value)}
                >
                  <option value="">Select title status</option>
                  {TITLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field
                id="registeredOwner"
                label="Registered Owner"
                required={!seekingLand}
                error={errors.registeredOwner}
                hint={seekingLand ? "Not needed while you are still looking." : undefined}
              >
                <TextInput
                  id="registeredOwner"
                  value={registeredOwner}
                  disabled={seekingLand}
                  invalid={Boolean(errors.registeredOwner)}
                  placeholder="Full name as per title"
                  onChange={(e) => setRegisteredOwner(e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Note
                icon={<Info className="size-4 text-gold-600" aria-hidden />}
              >
                Land information is subject to{" "}
                <span className="font-semibold text-gold-700">
                  document and technical verification
                </span>
                .
              </Note>
            </div>

            <div className="mt-6 flex justify-center">
              <Button type="submit" size="lg" className="w-full max-w-md">
                Save Land &amp; Choose My Home <ArrowRight className="size-4" />
              </Button>
            </div>

            {journey.land && (
              <p className="mt-3 text-center text-xs text-ink-400">
                Your previous land details are saved for this session.
              </p>
            )}
          </div>
        </form>
      </main>

      <SiteFooter variant="pillars" />
    </div>
  );
}

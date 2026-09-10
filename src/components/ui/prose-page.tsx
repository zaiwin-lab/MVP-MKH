import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ImageSlot } from "@/components/ui/image-slot";
import { PageHero } from "@/components/ui/primitives";

/** Shared layout for the text-led pages: legal notices and the help centre. */
export function ProsePage({
  eyebrow,
  title,
  accent,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          lead={lead}
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
          <div className="max-w-3xl rounded-card border border-parchment-300 bg-white p-6 shadow-card md:p-9">
            {children}
          </div>
        </section>
      </main>
      <SiteFooter variant="pillars" />
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-display text-xl font-bold text-ink-900">{heading}</h2>
      <div className="mt-2 space-y-3 text-[0.9375rem] leading-relaxed text-ink-600">
        {children}
      </div>
    </section>
  );
}

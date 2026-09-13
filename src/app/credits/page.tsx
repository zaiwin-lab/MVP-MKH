import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ProsePage, Section } from "@/components/ui/prose-page";
import { PHOTO_CREDITS } from "@/lib/credits";

export const metadata: Metadata = {
  title: "Photography Credits",
  description:
    "Attribution for the photography used on the My Kenyalang Homes portal.",
};

export default function CreditsPage() {
  return (
    <ProsePage
      eyebrow="Colophon"
      title="Photography"
      accent="Credits."
      lead="Where the images on this site come from."
    >
      <Section heading="Photographs">
        <p>
          The photographs of Kuching and Sarawak come from Wikimedia Commons
          under licences that permit commercial use. Those marked CC BY require
          attribution, which is given below.
        </p>
      </Section>

      <ul className="mt-6 space-y-4">
        {PHOTO_CREDITS.map((credit) => (
          <li
            key={credit.title}
            className="rounded-control border border-parchment-300 bg-parchment-50 p-4"
          >
            <p className="font-semibold text-ink-800">
              {credit.title.replace(/\.(jpg|jpeg|png)$/i, "")}
            </p>
            <p className="mt-1 text-[0.8125rem] text-ink-600">
              {credit.artist} &middot;{" "}
              <span className="font-medium">{credit.licence}</span>
            </p>
            <a
              href={credit.source}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1.5 inline-flex items-center gap-1 text-[0.8125rem] text-gold-700 hover:underline"
            >
              View on Wikimedia Commons
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </li>
        ))}
      </ul>

      <Section heading="Illustrations">
        <p>
          The architectural illustrations of the six home designs, and the
          drawings on the financing and custom-home panels, were made for this
          project.
        </p>
        <p>
          They are indicative representations of each design type, not
          photographs of built homes, and not construction drawings. Final
          designs, specifications and finishes are confirmed per project.
        </p>
      </Section>
    </ProsePage>
  );
}

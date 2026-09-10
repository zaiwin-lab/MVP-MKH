import type { Metadata } from "next";
import { CircleAlert } from "lucide-react";
import { ProsePage, Section } from "@/components/ui/prose-page";
import { Note } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that apply when you use the My Kenyalang Homes portal.",
};

export default function TermsPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Terms of"
      accent="Use."
      lead="The terms that apply when you use this portal."
    >
      <Note tone="warn" icon={<CircleAlert className="size-4 text-danger" aria-hidden />}>
        <span className="font-semibold">Draft pending legal review.</span> The
        clauses below reflect how the portal actually behaves. Binding terms must
        be settled with legal advisers before launch.
      </Note>

      <div className="mt-6">
        <Section heading="What this portal is">
          <p>
            My Kenyalang Homes is an information and application portal. It lets
            you record a land selection, choose a home design and submit
            information for a preliminary financing eligibility assessment.
          </p>
        </Section>

        <Section heading="What this portal is not">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              It is <strong className="text-ink-800">not an offer</strong> to sell
              land or to build a home.
            </li>
            <li>
              A submission is{" "}
              <strong className="text-ink-800">not a financing approval</strong>.
              Approval rests entirely with the financial institution you select,
              under its own assessment and policies.
            </li>
            <li>
              The AI Financing Eligibility Calculator gives an{" "}
              <strong className="text-ink-800">indicative estimate only</strong>,
              based on a standard debt service ratio calculation and assumed
              rates. It is not advice and not a quotation.
            </li>
          </ul>
        </Section>

        <Section heading="Information you provide">
          <p>
            You are responsible for the accuracy of the information and documents
            you submit. Land details, title status and ownership are subject to
            document and technical verification. Indicative prices and
            specifications shown for home designs are subject to confirmation.
          </p>
        </Section>

        <Section heading="Availability">
          <p>
            We aim to keep the portal available, but we do not guarantee
            uninterrupted access, and we may change or withdraw home designs,
            financing pathways or partner institutions.
          </p>
        </Section>

        <Section heading="Governing law">
          <p>
            To be confirmed — expected to be the laws of Malaysia, with the
            courts of Sarawak having jurisdiction.
          </p>
        </Section>
      </div>
    </ProsePage>
  );
}

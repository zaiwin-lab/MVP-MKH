import type { Metadata } from "next";
import { ProsePage, Section } from "@/components/ui/prose-page";
import { Note } from "@/components/ui/primitives";
import { CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How My Kenyalang Homes collects, uses and protects the personal data you provide through this portal.",
};

export default function PrivacyPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Privacy"
      accent="Policy."
      lead="How we handle the personal data you share with us."
    >
      <Note tone="warn" icon={<CircleAlert className="size-4 text-danger" aria-hidden />}>
        <span className="font-semibold">Draft pending legal review.</span> This
        page sets out the structure and the data the portal actually collects.
        The binding text must be settled by EG Megah Holdings and KOBIS Berhad
        with their legal advisers before launch.
      </Note>

      <div className="mt-6">
        <Section heading="What this policy covers">
          <p>
            This policy applies to My Kenyalang Homes, operated by EG Megah
            Holdings in partnership with KOBIS Berhad, and to the information you
            provide while using this portal to select land, choose a home design
            and explore financing.
          </p>
        </Section>

        <Section heading="What we collect">
          <p>The portal collects only what each step of the journey requires:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="text-ink-800">Land details</strong> — location,
              approximate lot size, title status and registered owner.
            </li>
            <li>
              <strong className="text-ink-800">Home selection</strong> — the
              design you choose, or a request for a custom design.
            </li>
            <li>
              <strong className="text-ink-800">Identity and contact details</strong>{" "}
              — full name, MyKad number, mobile number and email address.
            </li>
            <li>
              <strong className="text-ink-800">Employment and financial details</strong>{" "}
              — employment sector, employer, gross monthly income, existing
              monthly commitments and joint applicant status.
            </li>
            <li>
              <strong className="text-ink-800">Supporting documents</strong> —
              the files you upload through the Smart Document Box.
            </li>
          </ul>
          <p>
            The AI Financing Eligibility Calculator runs entirely in your browser.
            The figures you enter there are not transmitted to us or stored.
          </p>
        </Section>

        <Section heading="Why we collect it">
          <p>
            To process your home ownership application, to prepare your Letter of
            Intent and project documentation, and — where you choose to apply for
            financing — to share your submission with the financial institution
            you select for a preliminary eligibility assessment.
          </p>
        </Section>

        <Section heading="Who we share it with">
          <p>
            Your information is shared with the financial institution you
            explicitly select, and with service providers engaged to deliver your
            project. We do not sell personal data.
          </p>
        </Section>

        <Section heading="Your rights under the PDPA 2010">
          <p>
            Malaysia&rsquo;s Personal Data Protection Act 2010 gives you the right
            to access and correct your personal data, to withdraw consent, and to
            limit how your data is processed. Contact details for making such a
            request will be published here before launch.
          </p>
        </Section>

        <Section heading="Retention">
          <p>
            Retention periods must be confirmed against the record-keeping
            obligations that apply to the project and to the participating
            financial institutions.
          </p>
        </Section>
      </div>
    </ProsePage>
  );
}

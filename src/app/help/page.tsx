import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ProsePage, Section } from "@/components/ui/prose-page";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Help Centre",
  description:
    "Answers to common questions about choosing land, selecting a home design, financing pathways and what happens after you submit.",
};

const FAQS = [
  {
    q: "Do I need to own land before I start?",
    a: "No. You can proceed with land you own, land belonging to family or a third party (with the owner's consent), or ask us to help you find suitable land. Choose the option that matches your situation on the Choose Land step.",
  },
  {
    q: "Why do the home designs show “To Be Confirmed”?",
    a: "Built-up area, bedroom and bathroom counts and indicative pricing are confirmed per project, because they depend on your land, site conditions and the specification finally agreed. The design names and layouts are fixed; the figures follow.",
  },
  {
    q: "What is the difference between the two financing pathways?",
    a: "Own Financing means you fund the project through your own arrangement — you keep full control and we proceed straight to your Letter of Intent. Apply for Financing means we pass your information and documents to the financial institution you select for a preliminary eligibility assessment.",
  },
  {
    q: "Is the AI Eligibility Calculator a loan approval?",
    a: "No. It is an indicative estimate that runs in your browser using a standard debt service ratio calculation, an assumed indicative rate and a 90% margin of finance. Nothing you type into it is sent to us or to any bank. Only a financial institution can approve financing.",
  },
  {
    q: "What is the Smart Document Box?",
    a: "An upload area that sorts your documents into the right categories as you add them, so you can see at a glance what has been received and what is still outstanding. It accepts PDF, JPG and PNG files up to 10MB each.",
  },
  {
    q: "Can I submit before I have every document?",
    a: "Yes. Missing documents are flagged but do not block submission — we will tell you what is still needed. Providing everything up front does tend to shorten the assessment.",
  },
  {
    q: "How long does it take to hear back?",
    a: "If you proceed with your own financing, we email your Letter of Intent, project plan and payment arrangement details within 1 week. If you apply for financing, we update you on the preliminary assessment outcome within 2 weeks.",
  },
  {
    q: "Will my selections be saved if I close the tab?",
    a: "Your land, home and financing selections are kept for the current browser session, so refreshing or stepping back will not lose them. Closing the browser clears them, and nothing is stored on our servers until you submit.",
  },
];

export default function HelpPage() {
  return (
    <ProsePage
      eyebrow="Support"
      title="Help"
      accent="Centre."
      lead="Answers to the questions we are asked most often."
    >
      <div className="space-y-6">
        {FAQS.map(({ q, a }) => (
          <Section key={q} heading={q}>
            <p>{a}</p>
          </Section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 rounded-card bg-parchment-100 p-5">
        <p className="min-w-[14rem] flex-1 text-[0.9375rem] text-ink-600">
          Still have a question? The full journey is explained step by step in
          How It Works.
        </p>
        <ButtonLink href="/how-it-works">
          Go to How It Works <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    </ProsePage>
  );
}

# My Kenyalang Homes

**A guided build-on-your-own-land home journey for Sarawak families.**

[Open the verified live site](https://mkhomes.win)

> **Maturity:** Live pre-pilot lead-journey prototype  
> **Delivery:** Static Netlify experience with Netlify Forms capture and a signed Supabase lead mirror; no financial-institution integration  
> **Prepared by:** Zaiwin Kassim, MBA with the KOBIS AI Prodigy Team for KOBIS Berhad

My Kenyalang Homes demonstrates how a family can move through one clear digital journey:

**Choose Land -> Choose Home -> Choose Finance -> Submit**

The prototype is prepared for a Sarawak housing initiative involving EG Megah Holdings and KOBIS Berhad. Its public presence demonstrates product direction and technical capability; it does not by itself claim commissioning, regulatory approval, financing approval, completed sales, or production adoption.

## Business problem

The early home-ownership journey is usually fragmented. Families may need to understand land status, compare designs, estimate affordability, identify a financing path, assemble documents, and track what happens next across separate conversations and files.

This prototype brings those steps into one guided experience while keeping important decisions under human and institutional control.

## Intended users

- Sarawak families who own land, share family land, or need help identifying land
- Working adults exploring a build-on-your-own-land pathway
- Project coordinators managing enquiries and document readiness
- Housing developers and delivery partners evaluating a structured digital intake journey
- Financial institutions, subject to future agreements and approved integration

## What the prototype demonstrates

- Guided land, home and financing selection
- Six indicative home-design paths plus a custom-home option
- A client-side Debt Service Ratio eligibility estimate with stated assumptions
- A Smart Document Box with file type, size and category checks
- Cross-step selection memory using session storage
- A focused Express lead journey for mobile campaign traffic
- Netlify Forms as the lead-capture path of record
- Signed, idempotent Netlify webhook mirroring leads into Supabase Postgres
- Form validation and outstanding-document visibility
- Reference-number generation
- Downloadable submission summary
- Responsive layouts and accessibility foundations
- Transparent credits for sourced and AI-generated imagery

## Product journey

| Step | Route | What it demonstrates |
|---|---|---|
| Start | `/` | Value proposition, guided pathway and calculator entry point |
| 1 | `/choose-land` | Own land, family land or help-me-find-land pathways |
| 2 | `/choose-home` | Six home concepts, comparison and custom-home route |
| 3 | `/financing` | Own-finance or financing-assistance pathways and eligibility estimate |
| 4 | `/financing/apply` | Applicant information and document-readiness workflow |
| 5 | `/confirmation` | Reference number and indicative next steps |
| Guide | `/how-it-works` | The complete journey explained |
| Support | `/privacy`, `/terms`, `/help`, `/credits` | Draft notices, help and image disclosures |

Selections are managed in `src/lib/journey.tsx` and mirrored to `sessionStorage`. A refresh or back-button journey preserves the Selected Land card and Selection Summary. Nothing is stored server-side in this version.

## What is working today

- All public pages, navigation paths, validation rules and client-side journey state
- The live Express journey at [mkhomes.win](https://mkhomes.win)
- Netlify Forms capture with a repository-documented, end-to-end verified Supabase mirror
- JWS signature and body-hash verification, duplicate-submission protection and no browser-exposed service key
- The financing eligibility calculator in `src/lib/eligibility.ts`
- File handling, size and format checks, and filename-based document categorisation
- Reference-number generation and downloadable summary
- Static deployment from a Next.js export
- A licensed/disclosed image workflow, including a photo-import utility and public credits

## What is connected — and what is not

- **Lead capture is connected.** The live Express form submits to Netlify Forms. Repository evidence dated 21 September 2026 records a complete 21-field submission arriving in the Supabase `public.leads` mirror with introducer attribution and provenance.
- **The mirror is server-side.** A signed Netlify webhook writes with the service role; browser-facing keys were documented as denied read and write access.
- **The mirror is not a CRM.** There is no governed staff dashboard, role model, follow-up workflow or customer-service audit trail evidenced here.
- **No financial-institution integration.** No information is sent to a bank or lender.
- **No automated email.** Any response-time wording remains indicative until an approved notification workflow exists.
- **No approval decision.** The calculator is an estimate, not financial advice, eligibility confirmation or loan approval.
- **No verified production specifications.** Home specifications marked “To Be Confirmed” require authorised project data.
- **Legal and operational review remain incomplete.** Privacy, terms, retention, staff access and incident processes still require qualified approval.

## Strategic value

For KOBIS Berhad and the KOBIS AI Prodigy Team, this repository is reusable evidence of:

- Translating a multi-party business journey into a simple digital product
- Designing a conversion pathway from public interest to structured submission
- Combining eligibility logic, document readiness and guided decision-making
- Building a configurable foundation for future housing, land and financing initiatives
- Applying responsible AI-assisted delivery without overstating automation or approval authority

## Delivery role

**Zaiwin Kassim, MBA** leads product strategy, stakeholder alignment, customer-journey definition, solution direction and delivery review with the **KOBIS AI Prodigy Team**.

AI tools may accelerate design and implementation. Human judgment remains responsible for requirements, claims, testing, privacy decisions and release readiness.

## Technology

| Layer | Implementation |
|---|---|
| Framework | Next.js 16 and React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State | React store with sessionStorage persistence |
| Eligibility logic | Deterministic client-side Debt Service Ratio calculation |
| Lead capture | Netlify Forms |
| Lead mirror | Supabase Postgres via signed Edge Function webhook |
| Deployment | Static export hosted on Netlify |
| Media workflow | Optimised image import with attribution/disclosure support |

The public site remains a static export. Its Supabase service-role key stays in the Edge Function environment and is not shipped to the browser.

## Production-source reconciliation required

The repository explicitly records that the live `mkhomes.win` build was produced outside this Git history and differs in its social image, robots rules, default language and root route. Deploying the repository as-is could overwrite those live-only changes.

Before the next production deployment:

1. capture the exact current Netlify source or deployment artifact;
2. compare it against this default branch;
3. restore verified live-only changes into Git with the current commit date;
4. rebuild and test the form, referral attribution, calculator and webhook;
5. deploy only from the reconciled default branch.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
npm run lint     # eslint
```

## Content and design maintenance

- `src/lib/content.ts` contains home designs, navigation, Sarawak divisions, title statuses, employment sectors and financing choices.
- `src/lib/eligibility.ts` contains the calculator assumptions and deterministic eligibility logic.
- `src/lib/credits.ts` records image credits and disclosure text.
- `public/images/README.md` maps media slots and replacement requirements.
- `DESIGN.md` records the visual system, accessibility commitments and design rationale.
- `supabase/README.md` documents the Netlify Forms → signed webhook → Postgres mirror and its verification evidence.

## Responsible-use requirements

Before any pilot or production use:

1. Replace indicative prices, specifications and response times with authorised information.
2. Obtain written approval for partner names, brands, product representations and financial-institution references.
3. Have qualified advisers review financing wording, privacy notices and terms.
4. Add governed staff authentication and authorization, consent, retention, deletion and incident controls around the existing server-side lead mirror.
5. Test accessibility, mobile journeys, calculations, uploads and failure states.
6. Keep a human reviewer in control of every eligibility, financing and submission decision.
7. Do not upload confidential or personal documents to the public demonstration.

## Licence guidance

No open-source licence is declared for this repository. Public visibility does not grant permission to copy, reuse or redistribute the code, branding, content or imagery.

Before selecting a licence, confirm ownership and reuse rights for partner branding, generated imagery, sourced photographs and project-specific content. A proprietary or portfolio-use notice is safer unless all relevant owners explicitly approve open-source release.

## Validation status

The repository demonstrates a live public lead journey and contains documented backend-verification evidence. The public site was independently reachable at [mkhomes.win](https://mkhomes.win) on 27 September 2026. The repository does **not** claim verified user totals, completed home applications, financing approvals, revenue, production-wide security, endorsement or operational adoption.

The highest-priority validation is now source reconciliation: bring the deployed build back under Git control, then run an approved end-to-end test covering the form, referral code, Netlify record, signed webhook, Supabase row and authorised staff follow-up.

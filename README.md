# My Kenyalang Homes

**A guided build-on-your-own-land home journey for Sarawak families.**

[Open the verified live site](https://mkhomes.win)

> **Maturity:** Live pre-pilot lead journey · partial recovery record · production/source reconciliation incomplete  
> **Delivery:** Static Next.js source plus a dated compiled-site recovery snapshot; Netlify Forms and a signed Supabase mirror are documented, while the current manual/API production deploy is not attached to a Git commit  
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
- A root rewrite that makes the Express journey the campaign front door while retaining the clean `mkhomes.win` address
- A dated compiled-output snapshot that can support emergency restoration but is not editable source
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
| Start | `/` | Campaign lead journey served through the `/express/` rewrite while retaining the root URL |
| 1 | `/choose-land` | Own land, family land or help-me-find-land pathways |
| 2 | `/choose-home` | Six home concepts, comparison and custom-home route |
| 3 | `/financing` | Own-finance or financing-assistance pathways and eligibility estimate |
| 4 | `/financing/apply` | Applicant information and document-readiness workflow |
| 5 | `/confirmation` | Reference number and indicative next steps |
| Guide | `/how-it-works` | The complete journey explained |
| Support | `/privacy`, `/terms`, `/help`, `/credits` | Draft notices, help and image disclosures |

Selections are managed in `src/lib/journey.tsx` and mirrored to `sessionStorage`. A refresh or back-button journey preserves the Selected Land card and Selection Summary. Those selections remain browser-local; the separate Express lead form submits through the documented server-side capture path.

## What is working today

- All public pages, navigation paths, validation rules and client-side journey state
- The live Express journey at [mkhomes.win](https://mkhomes.win)
- A 28 September 2026 best-effort snapshot of the compiled live pages, static chunks, fonts, metadata and social image under `snapshots/live-2026-09-28/`
- Repository-side root-routing and metadata changes intended to align future builds with the current campaign front door
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

GitHub now contains two forms of recovery evidence:

1. the editable application source and the 28 September root-routing corrections; and
2. a best-effort compiled snapshot of the pages and assets that `mkhomes.win` served on 28 September 2026.

This is meaningful recovery progress, but it is **not** a complete production-source record.

Netlify’s current production deploy, `6ab9aaa3cdaaa081cfc5f605`, was published on 28 September 2026 through a manual/API deploy. It has no attached Git commit or commit URL, no recorded source ZIP, and includes three deployed functions—`mkhomes-ref-api`, `mkhomes-ref-go` and `mkhomes-stats-api`—whose source is absent from this repository.

The compiled snapshot is emergency restoration evidence, not editable source. It also records two path entries that would need correction before it could be served directly.

Before the next production deployment:

1. obtain the exact editable source and all three function sources used for the current live deploy;
2. compare them file-by-file with this default branch and the compiled snapshot;
3. remove secrets and record every live-only difference;
4. rebuild and test the root journey, referral attribution, calculator, forms, webhook and Supabase mirror;
5. deploy from the reconciled default branch with an attached Git commit;
6. retain the dated snapshot as provenance, not as the primary application source.

## Contribution provenance

Six application/recovery commits added on 28 September 2026 are on the default branch but use `claude` as both GitHub author and committer. Their history should not be rewritten. Future accepted work should be committed from the `zaiwin-lab` account or an email verified on that account, with an AI co-author trailer where appropriate.

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

The repository demonstrates a live public lead journey and contains documented backend-verification and recovery evidence. The public site and current Netlify production record were reverified on 28 September 2026. The repository does **not** claim verified user totals, completed home applications, financing approvals, revenue, production-wide security, endorsement or operational adoption.

The highest-priority validation is now complete source reconciliation: recover the three deployed functions and editable live source, bring the next production deploy under Git control, then run an approved end-to-end test covering the form, referral code, Netlify record, signed webhook, Supabase row and authorised staff follow-up.

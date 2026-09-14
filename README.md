# My Kenyalang Homes

**A guided build-on-your-own-land home journey for Sarawak families.**

[Open the live demonstration](https://my-kenyalang-homes.netlify.app)

> **Maturity:** Working front-end prototype (pre-pilot)  
> **Delivery:** Static public demonstration; no production backend or external financial-institution integration  
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
- The financing eligibility calculator in `src/lib/eligibility.ts`
- File handling, size and format checks, and filename-based document categorisation
- Reference-number generation and downloadable summary
- Static deployment from a Next.js export
- A licensed/disclosed image workflow, including a photo-import utility and public credits

## What is not yet connected

- **No backend or database.** Submitting advances the prototype journey but does not transmit an application to an organisation.
- **No financial-institution integration.** Choices can be demonstrated, but no information is sent to a bank or lender.
- **No automated email.** Any response-time wording is indicative until an approved email workflow exists.
- **No approval decision.** The calculator is an estimate, not financial advice, eligibility confirmation or loan approval.
- **No verified production specifications.** Home specifications that remain “To Be Confirmed” require authorised project data.
- **No completed legal review.** Privacy and terms pages are drafts until reviewed by qualified advisers.
- **No production security claim.** A backend version would require authentication, permissions, encrypted storage, retention rules, audit logging and security testing.

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
| Deployment | Static export hosted on Netlify |
| Media workflow | Optimised image import with attribution/disclosure support |

The static export is configured with `output: "export"`, so `out/` can be served by a static host. Adding API routes, middleware, authentication or server-side persistence requires moving to an appropriate runtime and completing security review.

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

## Responsible-use requirements

Before any pilot or production use:

1. Replace indicative prices, specifications and response times with authorised information.
2. Obtain written approval for partner names, brands, product representations and financial-institution references.
3. Have qualified advisers review financing wording, privacy notices and terms.
4. Implement secure server-side storage, authentication, consent, retention and deletion controls.
5. Test accessibility, mobile journeys, calculations, uploads and failure states.
6. Keep a human reviewer in control of every eligibility, financing and submission decision.
7. Do not upload confidential or personal documents to the public demonstration.

## Licence guidance

No open-source licence is declared for this repository. Public visibility does not grant permission to copy, reuse or redistribute the code, branding, content or imagery.

Before selecting a licence, confirm ownership and reuse rights for partner branding, generated imagery, sourced photographs and project-specific content. A proprietary or portfolio-use notice is safer unless all relevant owners explicitly approve open-source release.

## Validation status

The repository demonstrates a working front-end journey and documented technical checks. It does **not** yet claim verified users, completed applications, financing approvals, revenue, production security, client endorsement or operational adoption.

Meaningful next validation should include authorised usability sessions, recorded defects, calculation review, document-flow testing and a written decision on pilot scope.

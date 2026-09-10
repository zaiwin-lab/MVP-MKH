# My Kenyalang Homes — Portal

Home ownership portal for a Sarawak housing project by **EG Megah Holdings ×
KOBIS Berhad**. It guides a family from land selection through home design and
a financing pathway to a submitted application.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
npm run lint     # eslint
```

Deployed at **https://my-kenyalang-homes.netlify.app**.

The build is a static export (`output: "export"`), so `out/` can be served by
any static host. That holds only while every route is prerendered — adding an
API route or middleware means moving to a Node runtime.

## The journey

| Step | Route | What it does |
|---|---|---|
| — | `/` | Landing page: the three-step pathway and the calculator entry point |
| 1 | `/choose-land` | Ownership pathway (own / family / help me find) plus land details |
| 2 | `/choose-home` | Six home designs, a comparison table and the custom-home path |
| 3 | `/financing` | Own financing vs. bank application, and the AI Eligibility Calculator |
| 4 | `/financing/apply` | Applicant details and the Smart Document Box |
| 5 | `/confirmation` | Reference number and what happens next |
| — | `/how-it-works` | The five-step journey explained |
| — | `/privacy`, `/terms`, `/help` | Legal notices and the help centre |

Selections are held in `src/lib/journey.tsx` and mirrored to `sessionStorage`,
so a refresh or a back-button trip keeps the Selected Land card and the
Selection Summary rail populated. Nothing is stored server-side.

## What is real and what is not

**Real, working today**
- Every page, form, validation rule and navigation path
- The AI Financing Eligibility Calculator — a genuine Debt Service Ratio
  calculation (`src/lib/eligibility.ts`), run entirely in the browser
- The Smart Document Box — real file handling, size and format limits, and
  filename-based routing into document categories
- Reference number generation and the downloadable submission summary

**Not yet wired**
- **No backend.** Submitting does not send anything anywhere; it generates a
  reference and advances to the confirmation screen. An intake API, a database
  and document storage are still needed.
- **No bank integration.** Affin Bank and Bank Rakyat are presented as choices
  and recorded, but nothing is transmitted to either. That requires commercial
  agreements and their APIs.
- **No email.** The "we will email you within 1 week / 2 weeks" promises are
  copy, not automation.
- **Home specifications** all read "To Be Confirmed" — they come from
  `HOME_DESIGNS` in `src/lib/content.ts` and are ready for real figures.
- **Legal pages** are drafts pending review by legal advisers.
- **Photography** is placeholder gradients — see `public/images/README.md`.

## Editing content without touching components

`src/lib/content.ts` holds the home designs, navigation, Sarawak divisions,
title statuses, employment sectors and financial institutions.
`public/images/README.md` maps every photo slot to its path and subject.

## Design

`DESIGN.md` records the palette, type scale, layout rules and accessibility
commitments, with the reasoning behind them.

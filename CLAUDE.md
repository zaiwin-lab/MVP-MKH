# My Kenyalang Homes — project context

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. See `README.md`
for what runs and what is still stubbed, and `DESIGN.md` for the design system.

## Commands

```bash
npm run dev | build | lint
```

`npm run build` produces a **static export** in `out/` (`output: "export"` in
`next.config.ts`), so `next start` does not apply — serve `out/` with any static
server. Adding an API route, middleware or a server action means dropping the
export and moving to a Node runtime; `next.config.ts` records what to change.

## Conventions

- **Design tokens live in `src/app/globals.css`** under `@theme`. Use the
  semantic scales (`forest`, `gold`, `ink`, `parchment`) — never raw hex in
  components.
- **Font variables belong on `<html>`**, not `<body>`. The `--font-*` tokens are
  declared on `:root` and reference them; a custom property is substituted where
  it is declared, so moving them lower silently breaks every heading.
- **Never put a responsive `hidden` on a `Button`/`ButtonLink`.** Their base
  classes set `inline-flex`, and which display utility wins is decided by CSS
  source order, not class order. Wrap the element instead.
- **Page gutters come from the `shell` utility**, applied once per section.
  Don't add ad-hoc horizontal padding.
- **Content that the business will want to edit** goes in `src/lib/content.ts`,
  not inline in components.
- **Images** use `ImageSlot`, which falls back to a branded gradient when a file
  is missing. Add new slots to `public/images/README.md`.
- Journey state goes through `useJourney()`. It is backed by
  `useSyncExternalStore`, so don't reintroduce `useEffect` + `setState` to read
  storage — that is what the React 19 lint rules reject.

## Things that are deliberately honest

The calculator is a real DSR estimate, not a mock, and its assumptions
(4.3% indicative rate, 90% margin of finance, 55–65% DSR band, age-70 tenure
cap) are stated to the user. Don't replace it with a fabricated "AI" result, and
don't present preliminary assessments as approvals.

## The Express portal (`/express`)

A standalone, single-page lead journey for Facebook/WhatsApp traffic, launched
ahead of the full platform. **Its scope is fixed** — capture the lead, capture
the introducer, and tell the customer what happens next. Do not add fields,
steps or gates to it; every extra interaction costs conversions.

- **Two themes, dark and bright**, from one system. Every themed value is an
  `--ex-*` custom property declared on `.express-root`; the `ex-ink`,
  `ex-soft`, `ex-dim`, `ex-accent`, `ex-border` and `ex-chip` classes read
  them. **Never style this page with Tailwind palette utilities** such as
  `text-white` or `border-white/10`: those are fixed at build time and pin the
  component to one theme. Never chain one custom property through another at
  `:root` either, for the reason the font note above gives.
  The theme lives in `data-ex-theme` on `<html>`, set before paint by
  `THEME_BOOTSTRAP` so a bright-theme visitor gets no dark flash; React reads
  it back through `useExTheme`, never with `useEffect` + `setState`.
- The premium read comes from three layers in order: `express-ground` (ambient
  gradient plus grain, which is what stops a large dark gradient banding),
  `chrome-panel` (glass), and the hairline `inset 0 1px 0` highlight along
  each panel's top edge. That highlight is what makes a surface look like
  polished metal.
- **Figtree is the only family on this page**, display at 800 and body at
  400-600, via the `font-express` / `display-xl` / `display-lg` / `display-md`
  utilities. The main portal keeps Playfair and Source Sans; the two registers
  are meant to look different, so don't reach for `font-display` here.
- **Sections alternate grounds.** `band-raised` steps toward the light in
  either theme, so the page has rhythm instead of one continuous field. Use it
  on every other band, not on adjacent ones.
- Labels are 14px semibold, not 13px bold. Small bold text blooms on a dark
  ground and reads as heavy; one notch lighter and larger is easier to read
  and no less premium. Fields do not carry an "optional" badge: section 01
  says once that everything in it is optional.
- **Amber is the accent, not champagne**, and the gold action is the same
  family, so the two read as one material. The ground is a royal navy lit by
  three sources: blue top-left, amber top-right where the action sits, and a
  violet cast underneath that stops a deep navy going flat and grey.
- **No logo mark in this header**, and no tagline under the wordmark. The
  wordmark alone is the identity here; don't reintroduce `HornbillMark`.
- **The word "Express" does not appear in customer-facing copy.** The client
  considers it wrong for a home-building commitment. The badge names the
  programme instead (`programBadge`). The route stays `/express` because it is
  a path, not copy.
- The footer sits on `band-deep`, which sets its own ground: the page gradient
  lightens toward the middle and would otherwise leave the footer paler than
  the header. Credits sit left, language pills centre.
- **No photographs on this page.** It runs on drawn icons in boxed panels;
  `ICONS` in `express-ui.tsx` is the set, keyed by the option value it belongs
  to. Do not reintroduce imagery here.
- Everything it needs lives in `src/app/express/` plus `src/lib/lead.ts` and
  `src/lib/submit-lead.ts`, so the module can lift into the full platform.
- `src/lib/lead.ts` defines the `Lead` shape. **Those snake_case keys are the
  CRM columns** — renaming one here means renaming a column downstream.
- **Leads go to Netlify Forms** (form name `mkh-express-lead`). Read them in
  the Netlify project's Forms tab; add email notifications or an outgoing
  webhook to a CRM there, with no redeploy. To move to a real CRM, replace the
  body of `submitLead()` — that is the only seam.
- Only `customer_name`, `phone`, `email` and consent are required. Everything
  in sections 01–04 is optional by design.
- The introducer arrives as `?ref=AGT001`, is written to sessionStorage on
  landing and read back at submit. The customer never sees or types it. No
  parameter means `DIRECT`.
- The AI calculator is optional, never blocks submission, and calls the real
  DSR model in `src/lib/eligibility.ts`. It must keep saying it is an estimate,
  not an approval.
- **The hero preview figure is computed, not typed.** `src/lib/sample-estimate.ts`
  runs the same DSR model against a documented sample couple, so the headline
  number and the calculator can never disagree in front of a customer. Change
  the inputs there, not the copy. The card names the income it assumes.
- Technical surfaces: `blueprint-grid` (drafting paper behind the hero, masked
  so it never reaches the copy) and `glass-chip` for pills. A star field was
  tried over the same ground and rejected; don't reintroduce it.
- **The preview card uses `float-card`, not `chrome-panel`.** It is a solid
  fill rather than glass, so it separates from the gradient instead of
  dissolving into it, over three stacked shadows: a tight contact shadow, a
  mid shadow for the body and a wide cast. One large blur reads as fog; three
  tiers read as an object above a surface. In the dark theme its fill is a
  step *lighter* than the ground, because a raised surface catches more light.
- **The preview card stays clean.** No sheen, no specular band across it: the
  client asked for the figure to read plainly. The shine belongs in the
  background and on the chips, not over data.
- `spec-rule` is for a divider with room around it. Do not put it inline
  before a short label, where the end ticks read as a stray symbol rather
  than as a dimension.
- **Copy lives in `src/lib/i18n.ts`**, in English, Bahasa Malaysia, Chinese
  and Iban. Only labels translate; the option `value` a customer picks is
  canonical Malay and is what reaches the CRM. Translating stored values would
  split every report in two. Option labels are typed `Record<Lang, string>`,
  so adding a language fails the build until every option is translated rather
  than silently falling back.
  **The Iban and Chinese copy has not been native-reviewed.** Have a speaker
  read it before it carries ad spend.
- **`EXPRESS_CONTACT.whatsapp` in `src/lib/content.ts` is empty by default.**
  While it is empty the WhatsApp bubble and the post-submission handoff do not
  render at all: a chat button that goes nowhere costs more than no button.
  Digits only, full international form.
- **`SITE_URL` is what Open Graph resolves against.** Point it at a host that
  actually serves the site or every WhatsApp and Facebook share loses its
  image. Override with `NEXT_PUBLIC_SITE_URL` when the custom domain lands.
- Error text uses the `ex-danger` class, which carries a light red on the dark
  theme and a dark one on bright; the single `danger` token fails on both.
- The calculator models a **joint application**: incomes and commitments are
  pooled, and the tenure is governed by the **older** applicant, because the
  age-70 cap has to hold for both borrowers. Tenure is capped at
  `MAX_TENURE_YEARS` (30). Don't quote a term no bank would write.
- **Audit contrast against rendered pixels, not computed styles.** Tailwind v4
  emits `oklab()` and `color-mix()`, which naive parsers read as near-black and
  which produce a page of phantom failures. Screenshot, take the modal pixel in
  each text box as the ground and the glyph core as the ink. Even then, small
  text can read 0.5 low from antialiased edge pixels; confirm a marginal
  failure against the computed colour before chasing it.

## The backend (`supabase/`)

Leads are captured by **Netlify Forms** and mirrored into Postgres by an edge
function that Netlify calls on each submission. `supabase/README.md` explains
the ordering and why it is that way round; the short version is that Netlify
stores the lead *before* the webhook fires, so the database is a mirror rather
than a single point of failure, and no key ever reaches the browser.

- **Do not add a Supabase client to the page.** This is a static export, so a
  browser-side client means a key in the bundle and a lead table whose safety
  rests on RLS being right forever. The table has RLS on with **no policies**:
  nothing but the service role can touch it, and the service role lives only in
  the edge function's environment.
- **Do not remove Netlify Forms.** It is the capture path of record and the
  backup, and it is the reason the backend could be connected without deploying
  the site at all.
- The columns in `supabase/migrations/0001_leads.sql` from `lead_id` to
  `status` mirror `src/lib/lead.ts` exactly. That is one contract in three
  places — the form, the function's mapping, and the table — so renaming a
  field means renaming it in all three.
- The webhook is idempotent on `netlify_submission_id`, because Netlify retries
  on a non-2xx and a duplicated lead gets called twice by the sales team.
- Spam-filtered submissions never fire the webhook, so the Netlify spam tab is
  the one place a lead can hide from the database.

## Production has drifted from this repo

The live `mkhomes.win` build was produced outside this repository and differs
from `main`/this branch: different OG image, different robots rules, English
rather than Malay as the default language, and the portal served at `/` instead
of `/express/`. **A deploy from this repo would overwrite it.** Reconcile the
live build into Git before deploying anything from here.

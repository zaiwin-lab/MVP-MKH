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
- **Copy lives in `src/lib/i18n.ts`**, in Bahasa Malaysia and English. Only
  labels translate; the option `value` a customer picks is canonical Malay and
  is what reaches the CRM. Translating stored values would split every report
  in two. Adding a language means adding a key to `COPY`, nothing else.
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

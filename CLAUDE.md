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

- It has its own brand register: **drenched navy with gold chrome**, not the
  portal's light forest-and-parchment. Keep the two apart. The premium read
  comes from three layers in order: `express-ground` (ambient gradient plus
  grain, which is what stops a large dark gradient banding), `chrome-panel`
  (glass), and the hairline `inset 0 1px 0` highlight along each panel's top
  edge. That highlight is what makes a surface look like polished metal.
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
- Error text uses `danger-300`/`danger-400`, not `danger`: the light-ground
  red drops under 4.5:1 on near-black glass.
- **Audit contrast against rendered pixels, not computed styles.** Tailwind v4
  emits `oklab()` and `color-mix()`, which naive parsers read as near-black and
  which produce a page of phantom failures. Screenshot, take the modal pixel in
  each text box as the ground and the glyph core as the ink.

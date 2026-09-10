# My Kenyalang Homes — project context

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. See `README.md`
for what runs and what is still stubbed, and `DESIGN.md` for the design system.

## Commands

```bash
npm run dev | build | start | lint
```

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

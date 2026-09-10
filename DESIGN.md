# Design System — My Kenyalang Homes

## Product Context
- **What this is:** Home ownership portal for a Sarawak housing project — land selection, home design, financing pathway, application submission
- **Who it's for:** Malaysian families in Sarawak, many making their first property decision. Mixed digital confidence; mobile-heavy.
- **Space/industry:** Property development + consumer financing (peers: bank mortgage journeys, developer sales portals)
- **Project type:** Guided multi-step application flow with a marketing front door
- **Partners:** EG Megah Holdings × KOBIS Berhad

## Aesthetic Direction
- **Direction:** Editorial-institutional — the confidence of a bank crossed with the warmth of a family brand
- **Decoration level:** Restrained. Photography carries the emotion; the interface stays quiet so figures and forms are legible.
- **Mood:** Rooted, trustworthy, optimistic. Sarawak is present in every hero — river, hills, the DUN building — never as decoration for its own sake.
- **Signature motifs:** the kenyalang (hornbill) mark, gold-accented serif headlines, handwritten brand lines ("Same Land. A Brighter Tomorrow."), the sunset skyline band closing every page

## Typography
- **Display/Hero:** Playfair Display (Bold 700) — high stroke contrast, editorial authority. Every page title is Playfair with one phrase pulled into gold.
- **Body/UI:** Source Sans 3 (Regular 400 / Semibold 600) — humanist, highly legible at small sizes, good Malay diacritic coverage
- **Script accent:** Caveat — the handwritten brand lines only. Never for UI text.
- **Loading:** `next/font/google`, self-hosted at build, `display: swap`.
- **Critical:** font variables are set on `<html>`, not `<body>`. The `--font-*` design tokens live on `:root` and reference them; a custom property is substituted where it is *declared*, so defining them lower would leave every token invalid and inherit down empty.
- **Scale:**
  - Hero: `clamp(2.25rem, 4.4vw, 3.5rem)`
  - Display: `clamp(1.875rem, 3.2vw, 2.75rem)`
  - Title: `clamp(1.375rem, 2vw, 1.75rem)`
  - Body: 15px (0.9375rem)
  - Small: 13px
  - Caption: 12px
  - Micro: 11px / 10px (spec tables, legal notes)

## Color
- **Approach:** Two-brand system. Forest green carries trust and land; gold carries action and aspiration. Every primary action is gold; every confirmation is green. They never compete for the same job.
- **Forest** (`--color-forest-*`): 50 `#eef5f1` → 700 `#0f4430` → 900 `#08251b`. 700 is the footer, the filled panels and secondary buttons.
- **Gold** (`--color-gold-*`): 50 `#fbf7ef` → 500 `#b8893f` → 900 `#402d15`. 500–600 is the primary button gradient; 600 is the eyebrow and the accent phrase in headlines.
- **Ink** (`--color-ink-*`): 900 `#0a1c33` headings → 600 `#2c4c7d` body → 300 `#93aac9` placeholders. Body copy is deliberately blue-navy, not grey — it reads warmer against parchment.
- **Parchment** (`--color-parchment-*`): 50 `#fdfcf9` → 100 `#faf7f1` (page ground) → 300 `#e9e1d1` (borders).
- **Semantic:** success `#1f7a4d`, warning `#b8893f`, danger `#b4232a`, info `#2c4c7d`
- **Dark mode:** not implemented. The brand is a single warm light palette; a dark variant would need its own photography treatment.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable-tight. Cards carry a lot of information (specs, statuses, summaries) so gutters are modest and hierarchy does the separating.
- **Page gutter:** 16px mobile → 24px `sm` → 32px `lg`, applied once via the `shell` utility. Max content width 82rem.

## Layout
- **Approach:** Full-width photographic hero bands, then a contained card grid
- **Grid:** 3-up at `xl`, 2-up at `md`, 1-up below. Financing is 3 equal columns; the application form is content + a sticky 22rem summary rail.
- **Border radius:** cards 10px (`--radius-card`), controls 8px (`--radius-control`), badges full
- **Shadow:** `--shadow-card` for resting panels, `--shadow-float` for lifted and floating elements (the Selected Land card, hover states)

## Motion
- **Approach:** Minimal-functional. 150ms colour and transform transitions on interactive elements; a 2px lift on hoverable cards. Nothing animates on load.
- **Reduced motion:** fully honoured — `prefers-reduced-motion` collapses all transitions and disables smooth scroll.

## Imagery
Photography is the emotional load-bearing element and every slot degrades to a
calm generated gradient rather than a broken image. Heroes are scrimmed
left-to-right so headlines stay legible over any photo. See
`public/images/README.md` for the slot manifest.

## Accessibility commitments
- Visible gold focus ring on every interactive element, via `:focus-visible` only
- Skip-to-content link as the first focusable element
- Required fields marked visually *and* with screen-reader text; invalid fields carry `aria-invalid` and the first one receives focus on failed submit
- Live regions on the calculator result and the detected-documents list
- Icons are `aria-hidden`; meaning is always carried by adjacent text
- The comparison table uses real `<table>` semantics with a caption and row headers

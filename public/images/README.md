# Image slots

Three kinds of image are in use.

**Photographs** are real pictures of Kuching and Sarawak, taken from Wikimedia
Commons under licences that permit commercial use (CC BY, CC0 or public
domain). Nothing share-alike or non-commercial is used: cropping a share-alike
photo would create an adaptation we'd have to relicense. Attribution is
published at `/credits` and generated from `src/lib/credits.ts`.

**AI-generated images** come from Canva and cover the six home designs, the
Choose Land hero and the aerial land view. They are representations of each
design type, not photographs of built houses — which is the honest position
until EG Megah's own renders exist, and is stated plainly on `/credits`.
They need no attribution.

**Illustrations** are original drawings made for this project: the financing
panels and the custom-home drafting sketch.

## Importing licensed photography

The fastest route, and the one that gets the crops right:

```bash
npm run import-photos -- ~/Downloads/mkh-photos
```

Put the licensed originals in one folder, named so each filename contains
either its slot (e.g. `home-03`) or the stock image ID recorded in
`scripts/import-photos.mjs`. The script crops each to the slot's aspect ratio,
resizes, optimises and writes it here. It warns when a source is too small to
fill its slot without upscaling, and lists any file whose name matched no slot
rather than ignoring it silently. Originals are left untouched.

Run it with no folder to print every slot and its size.

## Replacing an image by hand

Overwrite the file at the same path with the same filename — no code change is
needed. If a file is missing the page paints a calm gradient instead of a
broken image. **If you replace a photograph, update or remove its entry in
`src/lib/credits.ts`**, because CC BY attribution must stay accurate.

When the real home renders arrive, drop them over `homes/home-01.jpg` …
`home-06.jpg` (800x500) and they become photographs — remove nothing from
credits, since the illustrations were ours.

## Current slots

| Path | Kind | Credit | Licence |
|---|---|---|---|
| `footer-skyline.jpg` | photograph | Peter Gronemann from Switzerland | CC BY 2.0 |
| `hero-confirmation.jpg` | photograph | Thomas Quine | CC BY 2.0 |
| `hero-family.jpg` | photograph | Esther Siaw | CC BY 4.0 |
| `hero-financing-form.jpg` | photograph | Fabio Achilli from Milano, Italy | CC BY 2.0 |
| `hero-financing.jpg` | photograph | Kuchingites | Public domain |
| `hero-homes.jpg` | photograph | Fabio Achilli from Milano, Italy | CC BY 2.0 |
| `hero-how-it-works.jpg` | photograph | Fabio Achilli from Milano, Italy | CC BY 2.0 |
| `hero-land.jpg` | photograph | User:Jeremylf | Public domain |
| `journey/land.jpg` | photograph | Gariey Sia | CC0 |
| `kuching-sunset.jpg` | photograph | Peter Gronemann from Switzerland | CC BY 2.0 |
| `land/family-land.jpg` | photograph | Unknown | CC BY 2.0 |
| `land/find-land.jpg` | photograph | Fabio Achilli from Milano, Italy | CC BY 2.0 |
| `land/own-land.jpg` | photograph | Gariey Sia | CC0 |
| `homes/home-01.jpg` | illustration | original work for this project | — |
| `homes/home-02.jpg` | illustration | original work for this project | — |
| `homes/home-03.jpg` | illustration | original work for this project | — |
| `homes/home-04.jpg` | illustration | original work for this project | — |
| `homes/home-05.jpg` | illustration | original work for this project | — |
| `homes/home-06.jpg` | illustration | original work for this project | — |
| `journey/home.jpg` | illustration | original work for this project | — |
| `journey/financing.jpg` | illustration | original work for this project | — |
| `own-financing.jpg` | illustration | original work for this project | — |
| `own-financing-wide.jpg` | illustration | original work for this project | — |
| `bank-financing-wide.jpg` | illustration | original work for this project | — |
| `custom-home.jpg` | illustration | original work for this project | — |

## Sizes

Heroes are 1600px wide (480–900 tall). Home cards and land cards are 800x500.
Journey thumbnails are 400x400 square. The footer band is 1600x420. Anything
close will crop gracefully — every slot uses `object-fit: cover`.

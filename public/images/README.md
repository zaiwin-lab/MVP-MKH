# Image slots

Every file below is a **generated placeholder**. To use real photography,
overwrite the file at the same path with the same filename — no code change is
needed. Aspect ratios are what the layout expects; anything close will crop
gracefully (all slots use `object-fit: cover`).

If a file is ever missing, the page paints a calm gradient block instead of a
broken image, so a half-finished photo set never ships a broken page.

| Path | Size (px) | Used on | Subject |
|---|---|---|---|
| `hero-family.jpg` | 1600×900 | Home | Family in front of a completed home. Keep the left third uncluttered — the headline sits there. |
| `hero-land.jpg` | 1600×560 | Choose Land | Sarawak landscape / river valley. |
| `hero-homes.jpg` | 1600×560 | Choose Home | Kuching skyline with the DUN building. |
| `hero-financing.jpg` | 1600×560 | Choose Financing | Modern home exterior. |
| `hero-financing-form.jpg` | 1600×560 | Financing Application | Kuching waterfront. |
| `hero-confirmation.jpg` | 1600×620 | Confirmation | Completed home entrance / signage. |
| `hero-how-it-works.jpg` | 1600×480 | How It Works | Wide river and mountains. |
| `kuching-sunset.jpg` | 1600×620 | Home (closing band) | Kuching waterfront at sunset. |
| `footer-skyline.jpg` | 1600×420 | All pages (footer) | Night skyline. Sits behind a dark green wash, so contrast matters more than detail. |
| `custom-home.jpg` | 900×320 | Choose Home | Architectural sketch or rendering. |
| `own-financing.jpg` | 800×520 | Choose Financing | Planning notebook / desk scene. |
| `own-financing-wide.jpg` | 1000×440 | How It Works | Home exterior. Overlaid with a dark green gradient — use a calm image. |
| `bank-financing-wide.jpg` | 1000×440 | How It Works | Bank or office building. |
| `journey/land.jpg` | 400×400 | Home | Land parcel, square crop. |
| `journey/home.jpg` | 400×400 | Home | Finished home, square crop. |
| `journey/financing.jpg` | 400×400 | Home | Documents and calculator, square crop. |
| `land/own-land.jpg` | 800×500 | Choose Land | Open land. |
| `land/family-land.jpg` | 800×500 | Choose Land | Handshake / family agreement. |
| `land/find-land.jpg` | 800×500 | Choose Land | Aerial view of available plots. |
| `homes/home-01.jpg` … `home-06.jpg` | 800×500 | Choose Home | One render per design, matching `HOME_DESIGNS` in `src/lib/content.ts`. |

## Regenerating the placeholders

They were produced by rendering gradients in headless Chromium. Nothing in the
app depends on that script — the files are committed as ordinary assets.

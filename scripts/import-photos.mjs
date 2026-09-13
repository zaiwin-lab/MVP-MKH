#!/usr/bin/env node
/**
 * Import licensed photography into the portal's image slots.
 *
 *   npm run import-photos -- ~/Downloads/mkh-photos
 *
 * Drop the licensed originals into a folder, named so each filename contains
 * either the slot name (e.g. "home-03") or the stock image ID recorded in
 * SLOTS below. The script crops each to its slot's aspect ratio, resizes,
 * optimises, and writes it into public/images — no code change needed.
 *
 * Originals are never modified. Anything that doesn't match a slot is listed
 * so nothing is silently ignored.
 */

import { readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "images");

/**
 * Every slot, with the size the layout expects and where the subject should
 * sit vertically when the source is taller than the slot (0 = top, 1 = bottom).
 * `id` is the stock image chosen during selection, used for filename matching.
 */
const SLOTS = [
  { slot: "homes/home-01.jpg", w: 800, h: 500, focus: 0.5, id: "2604901333", note: "Modern Tropical" },
  { slot: "homes/home-02.jpg", w: 800, h: 500, focus: 0.5, id: "2186045785", note: "Contemporary Family" },
  { slot: "homes/home-03.jpg", w: 800, h: 500, focus: 0.5, id: "2416779749", note: "Single Storey Family Home" },
  { slot: "homes/home-04.jpg", w: 800, h: 500, focus: 0.5, id: "2233292389", note: "Double Storey Family Home" },
  { slot: "homes/home-05.jpg", w: 800, h: 500, focus: 0.5, id: "778329574", note: "Courtyard Living" },
  { slot: "homes/home-06.jpg", w: 800, h: 500, focus: 0.5, id: "259242392", note: "Rural Modern" },

  { slot: "hero-land.jpg", w: 1600, h: 560, focus: 0.5, id: "2718655859", note: "Choose Land hero" },
  { slot: "land/own-land.jpg", w: 800, h: 500, focus: 0.5, id: "1681492150", note: "I Own the Land" },
  { slot: "land/find-land.jpg", w: 800, h: 500, focus: 0.5, id: "1493060006", note: "Help Me Find Land" },
  { slot: "land/family-land.jpg", w: 800, h: 500, focus: 0.5, id: null, note: "Use Family or Third-Party Land" },

  { slot: "hero-family.jpg", w: 1600, h: 900, focus: 0.45, id: null, note: "Landing hero" },
  { slot: "hero-homes.jpg", w: 1600, h: 560, focus: 0.5, id: null, note: "Choose Home hero" },
  { slot: "hero-financing.jpg", w: 1600, h: 560, focus: 0.5, id: null, note: "Choose Financing hero" },
  { slot: "hero-financing-form.jpg", w: 1600, h: 560, focus: 0.5, id: null, note: "Application hero" },
  { slot: "hero-confirmation.jpg", w: 1600, h: 620, focus: 0.5, id: null, note: "Confirmation hero" },
  { slot: "hero-how-it-works.jpg", w: 1600, h: 480, focus: 0.5, id: null, note: "How It Works hero" },
  { slot: "kuching-sunset.jpg", w: 1600, h: 620, focus: 0.8, id: null, note: "Landing closing band" },
  { slot: "footer-skyline.jpg", w: 1600, h: 420, focus: 0.8, id: null, note: "Footer band" },

  { slot: "journey/land.jpg", w: 400, h: 400, focus: 0.5, id: null, note: "Landing step 1" },
  { slot: "journey/home.jpg", w: 400, h: 400, focus: 0.5, id: null, note: "Landing step 2" },
  { slot: "journey/financing.jpg", w: 400, h: 400, focus: 0.5, id: null, note: "Landing step 3" },

  { slot: "custom-home.jpg", w: 900, h: 320, focus: 0.5, id: null, note: "Custom Home strip" },
  { slot: "own-financing.jpg", w: 800, h: 520, focus: 0.5, id: null, note: "Own Financing card" },
  { slot: "own-financing-wide.jpg", w: 1000, h: 440, focus: 0.5, id: null, note: "How It Works, own financing" },
  { slot: "bank-financing-wide.jpg", w: 1000, h: 440, focus: 0.5, id: null, note: "How It Works, bank" },
];

/** "homes/home-03.jpg" -> "home-03", so a filename only has to contain that. */
function slotKey(slot) {
  return path.basename(slot, path.extname(slot));
}

function matchSlot(filename) {
  const lower = filename.toLowerCase();
  // Prefer an explicit stock ID: it is unambiguous.
  const byId = SLOTS.find((s) => s.id && lower.includes(s.id));
  if (byId) return byId;
  // Longest slot key first, so "home-01" never loses to a shorter prefix.
  return [...SLOTS]
    .sort((a, b) => slotKey(b.slot).length - slotKey(a.slot).length)
    .find((s) => lower.includes(slotKey(s.slot)));
}

const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

async function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: npm run import-photos -- <folder-of-licensed-images>\n");
    console.error("Name each file so it contains its slot (e.g. home-03) or stock ID.\n");
    console.error("Slots:");
    for (const s of SLOTS) {
      console.error(`  ${slotKey(s.slot).padEnd(22)} ${String(s.w).padStart(4)}x${String(s.h).padEnd(4)}  ${s.note}`);
    }
    process.exit(1);
  }
  if (!existsSync(dir)) {
    console.error(`No such folder: ${dir}`);
    process.exit(1);
  }

  const files = (await readdir(dir)).filter((f) =>
    SOURCE_EXT.has(path.extname(f).toLowerCase()),
  );
  if (files.length === 0) {
    console.error(`No images found in ${dir}`);
    process.exit(1);
  }

  const done = [];
  const skipped = [];
  const warnings = [];

  for (const file of files) {
    const target = matchSlot(file);
    if (!target) {
      skipped.push(file);
      continue;
    }

    const src = path.join(dir, file);
    const meta = await sharp(src).metadata();
    const scale = Math.max(target.w / meta.width, target.h / meta.height);
    if (scale > 1.05) {
      warnings.push(
        `${file} is ${meta.width}x${meta.height}, smaller than ${target.slot} ` +
          `(${target.w}x${target.h}) — it will be upscaled ${scale.toFixed(2)}x and look soft.`,
      );
    }

    const dest = path.join(OUT, target.slot);
    await mkdir(path.dirname(dest), { recursive: true });

    await sharp(src)
      .resize(target.w, target.h, {
        fit: "cover",
        position: target.focus <= 0.34 ? "top" : target.focus >= 0.66 ? "bottom" : "centre",
      })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(dest);

    done.push(`${file}  ->  ${target.slot}  (${target.w}x${target.h})`);
  }

  console.log(`\nImported ${done.length} image${done.length === 1 ? "" : "s"}:`);
  for (const line of done) console.log(`  ${line}`);

  if (warnings.length) {
    console.log(`\nQuality warnings:`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  if (skipped.length) {
    console.log(`\nNot imported (filename matched no slot):`);
    for (const s of skipped) console.log(`  ? ${s}`);
    console.log(`  Rename these to contain a slot name, e.g. "home-03".`);
  }

  const filled = new Set(done.map((d) => d.split("->")[1].trim().split(" ")[0]));
  const creditsTouched = [...filled].filter((slot) =>
    ["hero-", "land/", "journey/", "kuching", "footer"].some((p) => slot.startsWith(p) || slot.includes(p)),
  );
  if (creditsTouched.length) {
    console.log(
      `\nReminder: ${creditsTouched.length} slot(s) you replaced may still be credited in` +
        `\n  src/lib/credits.ts  — remove or update those entries so /credits stays accurate.`,
    );
  }
  console.log(`\nNext: npm run build, then redeploy.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

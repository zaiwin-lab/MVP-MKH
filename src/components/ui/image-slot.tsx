"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

/**
 * A photo slot that degrades to a branded placeholder.
 *
 * The portal ships before the project photography does. Each slot points at
 * its final path under /public/images; until that file exists the slot paints
 * a calm gradient instead of a broken image. Dropping the real photo at the
 * documented path is all that's needed — no code change.
 *
 * See public/images/README.md for the full slot manifest.
 */

type Tone = "land" | "home" | "document" | "civic";

const TONES: Record<Tone, string> = {
  land: "linear-gradient(155deg,#d3e6dc 0%,#a7cdb9 45%,#6ba98d 100%)",
  home: "linear-gradient(155deg,#f5ebd6 0%,#e9e1d1 45%,#cca14f 100%)",
  document: "linear-gradient(155deg,#eef5f1 0%,#d3e6dc 55%,#a7cdb9 100%)",
  civic: "linear-gradient(155deg,#dceaf4 0%,#a7cdb9 55%,#3d8663 100%)",
};

export function ImageSlot({
  src,
  alt,
  tone = "home",
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src: string;
  alt: string;
  tone?: Tone;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={`relative overflow-hidden ${className}`}
        style={{ backgroundImage: TONES[tone] }}
      >
        {/* A faint horizon line keeps the placeholder from reading as an error. */}
        <div className="absolute inset-x-0 bottom-1/3 h-px bg-white/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.55),transparent_55%)]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${className} ${imgClassName} object-cover`}
    />
  );
}

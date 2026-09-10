import Link from "next/link";

/**
 * The kenyalang (rhinoceros hornbill) — Sarawak's state emblem, and the
 * portal's mark. Drawn rather than imported so it stays crisp at any size and
 * recolours cleanly between the light header and the dark footer.
 */
export function HornbillMark({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const body = tone === "dark" ? "#0a1c33" : "#ffffff";
  const casque = tone === "dark" ? "#b8893f" : "#dcb976";

  return (
    <svg
      viewBox="0 0 48 56"
      className={className}
      role="img"
      aria-label="My Kenyalang Homes"
    >
      {/* Casque — the gold sweep above the bill */}
      <path
        d="M6 15c6-9 20-13 33-11-3 5-8 8-14 9 5 1 9 0 12-2-2 6-8 10-16 10-6 0-11-2-15-6z"
        fill={casque}
      />
      {/* Head and body, tapering into the shield-like tail */}
      <path
        d="M24 20c7 0 13 5 13 12 0 9-5 17-13 23-8-6-13-14-13-23 0-7 6-12 13-12z"
        fill={body}
      />
      {/* Eye, punched out of the body */}
      <circle cx="24" cy="27" r="2.1" fill={tone === "dark" ? "#ffffff" : "#0a1c33"} />
    </svg>
  );
}

export function Wordmark({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="My Kenyalang Homes — home"
    >
      <HornbillMark tone={tone} className="h-8 w-auto shrink-0 sm:h-10" />
      <span className="leading-none">
        <span
          className={`block font-display text-[1.05rem] font-bold tracking-tight sm:text-[1.35rem] ${
            tone === "dark" ? "text-ink-900" : "text-white"
          }`}
        >
          My Kenyalang Homes
        </span>
        {/* The partner line is the first thing to go when width is tight. */}
        <span
          className={`mt-1 hidden text-[0.6875rem] tracking-wide sm:block ${
            tone === "dark" ? "text-ink-400" : "text-white/70"
          }`}
        >
          EG Megah Holdings &times; KOBIS Berhad
        </span>
      </span>
    </Link>
  );
}

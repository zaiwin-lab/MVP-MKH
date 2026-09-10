import Link from "next/link";
import { Leaf, TreePine, Users } from "lucide-react";
import { HornbillMark } from "@/components/brand";
import { ImageSlot } from "@/components/ui/image-slot";
import { ScriptMark } from "@/components/ui/primitives";
import { NAV_LINKS } from "@/lib/content";

const PILLARS = [
  { Icon: Leaf, title: "Rooted in Sarawak", body: "Built for Generations" },
  { Icon: Users, title: "Homes for", body: "Stronger Families" },
  { Icon: TreePine, title: "A Brighter", body: "Sarawak Together" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/help", label: "Help Centre" },
];

/**
 * Two footers, matching the approved designs:
 *  - "pillars"  the tall Sarawak-skyline footer carrying the brand pillars
 *  - "compact"  the slim navigation footer used on the landing page
 */
export function SiteFooter({
  variant = "pillars",
}: {
  variant?: "pillars" | "compact";
}) {
  return (
    <footer className="relative isolate mt-auto overflow-hidden bg-forest-900 text-white">
      <ImageSlot
        src="/images/footer-skyline.jpg"
        alt=""
        tone="civic"
        className="absolute inset-0 -z-10 size-full opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900 via-forest-900/85 to-forest-900/60" />

      {variant === "pillars" ? (
        <div className="shell py-7">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
            <div className="flex items-center gap-3">
              <HornbillMark tone="light" className="h-11 w-auto" />
              <span className="leading-none">
                <span className="block font-display text-xl font-bold">
                  My Kenyalang Homes
                </span>
                <span className="mt-1 block text-[0.6875rem] text-white/70">
                  EG Megah Holdings &times; KOBIS Berhad
                </span>
              </span>
            </div>

            <div className="hidden h-12 w-px bg-white/20 lg:block" />

            <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {PILLARS.map(({ Icon, title, body }) => (
                <li key={title} className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/35">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-[0.8125rem] leading-tight">
                    <span className="block font-semibold">{title}</span>
                    <span className="block text-white/70">{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <ScriptMark
              lines={["Same Land.", "A Brighter Tomorrow."]}
              className="ml-auto hidden text-white xl:block"
            />
          </div>
        </div>
      ) : (
        <div className="shell py-7">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <HornbillMark tone="light" className="h-10 w-auto" />
              <span className="leading-none">
                <span className="block font-display text-lg font-bold">
                  My Kenyalang Homes
                </span>
                <span className="mt-1 block text-[0.6875rem] text-white/70">
                  EG Megah Holdings &times; KOBIS Berhad
                </span>
              </span>
            </div>

            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[0.8125rem]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/85 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div className="border-t border-white/15">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 text-[0.6875rem] text-white/65">
          <p>&copy; {new Date().getFullYear()} My Kenyalang Homes. All Rights Reserved.</p>
          {variant === "pillars" && (
            <ul className="flex flex-wrap items-center gap-x-5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p>Designed &amp; Built by KOBIS Berhad</p>
        </div>
      </div>
    </footer>
  );
}

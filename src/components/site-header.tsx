"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-parchment-300/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="shell flex h-[4.5rem] items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative py-2 text-sm transition-colors ${
                    isActive(link.href)
                      ? "font-semibold text-ink-900"
                      : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gold-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden size-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-parchment-200 hover:text-ink-900 lg:flex"
          >
            <Search className="size-5" />
          </button>

          {/* Wrapper, not the link: `hidden` on a button whose base classes
              set `inline-flex` is a coin toss decided by CSS source order. */}
          <span className="hidden sm:block">
            <ButtonLink href="/choose-land" size="md">
              Start My Journey <ArrowRight className="size-4" />
            </ButtonLink>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-control border border-parchment-300 text-ink-700 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t border-parchment-300 bg-white lg:hidden"
        >
          <ul className="shell flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block border-b border-parchment-200 py-3 text-sm last:border-0 ${
                    isActive(link.href)
                      ? "font-semibold text-gold-600"
                      : "text-ink-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="py-3 sm:hidden">
              <ButtonLink href="/choose-land" className="w-full" onClick={() => setOpen(false)}>
                Start My Journey <ArrowRight className="size-4" />
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

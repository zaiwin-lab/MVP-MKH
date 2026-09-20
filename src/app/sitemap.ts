import type { MetadataRoute } from "next";

/* Static export emits this as a file at build time; without it Next treats
   the route as dynamic and the export fails. */
export const dynamic = "force-static";
import { SITE_URL } from "@/lib/content";

/** Every indexable route. /express is deliberately absent: it is noindex. */
const ROUTES = [
  "",
  "/choose-land",
  "/choose-home",
  "/financing",
  "/financing/apply",
  "/how-it-works",
  "/help",
  "/credits",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}/`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}

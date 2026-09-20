import type { MetadataRoute } from "next";

/* Static export emits this as a file at build time; without it Next treats
   the route as dynamic and the export fails. */
export const dynamic = "force-static";
import { SITE_URL } from "@/lib/content";

/**
 * The Express portal is an ad landing page. It carries `noindex` in its own
 * metadata and is disallowed here too, so its `?ref=` variants never compete
 * with the main site as duplicates.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/express/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/content";
import { THEME_BOOTSTRAP } from "@/lib/ex-theme";
import { ExpressJourney } from "./express-journey";

const OG_TITLE = "My Kenyalang Homes \u2014 Program Pemilikan Rumah";
const OG_DESCRIPTION =
  "Jom Kita Mulakan! Daftar dalam 2 minit. Percuma, ringkas, dipandu. Tiada dokumen diperlukan sekarang.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Program Pemilikan Rumah \u2014 Jom Kita Mulakan!",
  description: OG_DESCRIPTION,
  /* The rewrite in netlify.toml serves this page at the site root, so the root
     is the address it should be indexed and shared under. Pointing either of
     these at /express/ would send crawlers and link previews to a path that
     robots.txt disallows. */
  alternates: { canonical: "/" },
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "/",
    siteName: "My Kenyalang Homes",
    type: "website",
    locale: "ms_MY",
    /* This is the card a customer sees when the link is pasted into WhatsApp
       or Facebook, which is where most of this traffic starts. */
    images: [
      {
        /* The image the live site already shares under. Keeping the same file
           and cache-buster means links posted before this deploy still resolve
           to the card people have already seen. */
        url: "/og.png?v=win12",
        width: 1200,
        height: 630,
        alt: "My Kenyalang Homes \u2014 Jom Kita Mulakan! Program Pemilikan Rumah Sarawak.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ["/og.png?v=win12"],
  },
  /* This is the public home page now, not a hidden ad landing page: the rewrite
     serves it at the root, so a noindex here would take mkhomes.win itself out
     of Google entirely.

     The ?ref= duplicates the old directive guarded against are covered by the
     canonical above and by robots.txt disallowing /express/, so the content is
     still only indexed once. */
  robots: { index: true, follow: true },
};

export default function ExpressPage() {
  return (
    <>
      {/* Applies the saved theme before first paint. Without this, someone who
          chose bright gets a dark flash on every load, which is worse than
          having no choice at all. */}
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      <ExpressJourney />
    </>
  );
}

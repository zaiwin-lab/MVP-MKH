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
  alternates: { canonical: "/express/" },
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "/express/",
    siteName: "My Kenyalang Homes",
    type: "website",
    locale: "ms_MY",
    /* This is the card a customer sees when the link is pasted into WhatsApp
       or Facebook, which is where most of this traffic starts. */
    images: [
      {
        url: "/og-express.jpg",
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
    images: ["/og-express.jpg"],
  },
  /* An ad landing page has no business in search results competing with the
     main site, and its ?ref= variants must never be indexed as duplicates. */
  robots: { index: false, follow: false },
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

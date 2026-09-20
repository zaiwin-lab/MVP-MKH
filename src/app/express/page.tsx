import type { Metadata } from "next";
import { ExpressJourney } from "./express-journey";

export const metadata: Metadata = {
  title: "Express Journey — Jom Kita Mulakan!",
  description:
    "Daftar dalam 2 minit. Kongsikan tanah, pilihan rumah dan sasaran pembiayaan anda — team My Kenyalang Homes akan guide langkah seterusnya.",
  openGraph: {
    title: "My Kenyalang Homes — Express Journey",
    description:
      "Jom Kita Mulakan! Perjalanan membina rumah impian anda. Percuma, ringkas, dipandu.",
    type: "website",
    locale: "ms_MY",
  },
  /* An ad landing page has no business in search results competing with the
     main site, and its ?ref= variants must never be indexed as duplicates. */
  robots: { index: false, follow: false },
};

export default function ExpressPage() {
  return <ExpressJourney />;
}

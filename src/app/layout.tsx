import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3, Caveat, Figtree } from "next/font/google";
import { JourneyProvider } from "@/lib/journey";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Figtree carries the Express portal alone: display weights at 800 and body
 * at 400-600, one family with real weight contrast rather than a serif and a
 * sans competing. The main portal keeps Playfair and Source Sans; the two
 * registers are meant to look different.
 */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mykenyalanghomes.com"),
  title: {
    default: "My Kenyalang Homes — Your Land. Your Home. Your Way Forward.",
    template: "%s | My Kenyalang Homes",
  },
  description:
    "Choose your land, discover the right home and find a financing pathway — all in one trusted place. A home ownership journey built for Sarawak by EG Megah Holdings and KOBIS Berhad.",
  openGraph: {
    type: "website",
    locale: "en_MY",
    siteName: "My Kenyalang Homes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables must sit on <html>, not <body>: the design tokens in
    // globals.css are declared on :root and reference them, and a custom
    // property is substituted where it is declared. Defining them lower down
    // would leave --font-display invalid at :root and inherit down empty.
    <html
      lang="en-MY"
      className={`${playfair.variable} ${sourceSans.variable} ${caveat.variable} ${figtree.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-forest-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <JourneyProvider>{children}</JourneyProvider>
      </body>
    </html>
  );
}

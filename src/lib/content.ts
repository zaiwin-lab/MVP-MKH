/* --------------------------------------------------------------------------
   Content that the business will want to edit without touching components.
   Specs read "To Be Confirmed" until the project team releases real figures.
   -------------------------------------------------------------------------- */

export const TBC = "To Be Confirmed";

export type HomeDesign = {
  id: string;
  code: string;
  name: string;
  builtUpArea: string;
  bedrooms: string;
  bathrooms: string;
  indicativePrice: string;
  image: string;
};

export const HOME_DESIGNS: HomeDesign[] = [
  {
    id: "home-01",
    code: "Home 01",
    name: "Modern Tropical",
    builtUpArea: TBC,
    bedrooms: TBC,
    bathrooms: TBC,
    indicativePrice: TBC,
    image: "/images/homes/home-01.jpg",
  },
  {
    id: "home-02",
    code: "Home 02",
    name: "Contemporary Family",
    builtUpArea: TBC,
    bedrooms: TBC,
    bathrooms: TBC,
    indicativePrice: TBC,
    image: "/images/homes/home-02.jpg",
  },
  {
    id: "home-03",
    code: "Home 03",
    name: "Single Storey Family Home",
    builtUpArea: TBC,
    bedrooms: TBC,
    bathrooms: TBC,
    indicativePrice: TBC,
    image: "/images/homes/home-03.jpg",
  },
  {
    id: "home-04",
    code: "Home 04",
    name: "Double Storey Family Home",
    builtUpArea: TBC,
    bedrooms: TBC,
    bathrooms: TBC,
    indicativePrice: TBC,
    image: "/images/homes/home-04.jpg",
  },
  {
    id: "home-05",
    code: "Home 05",
    name: "Courtyard Living",
    builtUpArea: TBC,
    bedrooms: TBC,
    bathrooms: TBC,
    indicativePrice: TBC,
    image: "/images/homes/home-05.jpg",
  },
  {
    id: "home-06",
    code: "Home 06",
    name: "Rural Modern",
    builtUpArea: TBC,
    bedrooms: TBC,
    bathrooms: TBC,
    indicativePrice: TBC,
    image: "/images/homes/home-06.jpg",
  },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/choose-land", label: "Choose Land" },
  { href: "/choose-home", label: "Choose Home" },
  { href: "/financing", label: "Financing" },
  { href: "/how-it-works", label: "How It Works" },
];

export const BRAND_PILLARS = [
  { icon: "leaf", title: "Rooted in Sarawak", body: "Built for Generations" },
  { icon: "users", title: "Homes for", body: "Stronger Families" },
  { icon: "tree", title: "A Brighter", body: "Sarawak Together" },
];

export const FINANCIAL_INSTITUTIONS = [
  { id: "affin", name: "Affin Bank", tagline: "" },
  { id: "bank-rakyat", name: "Bank Rakyat", tagline: "Bank Pilihan Anda" },
];

/** Divisions of Sarawak, for the land location selector. */
/* --------------------------------------------------------------------------
   Express portal contact points.

   The WhatsApp number is the one thing here the business must fill in. Until
   it is set, the WhatsApp bubble and the post-submission handoff do not
   render at all: a dead chat button on a lead page costs more than a missing
   one. Digits only, full international form, no "+" and no spaces.
   -------------------------------------------------------------------------- */
/**
 * The origin social previews resolve against. Open Graph needs absolute URLs,
 * so if this points somewhere that is not actually serving the site, every
 * WhatsApp and Facebook share renders without its image.
 *
 * `URL` is set by Netlify at build time to the site's own primary address, so
 * the day a custom domain is made primary the previews and the sitemap follow
 * it with no code change and no window where they point at the wrong host.
 * `NEXT_PUBLIC_SITE_URL` overrides it when a build needs to be pinned; the
 * literal is only the local-development fallback.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  "https://mkhomesv1.netlify.app";

export const EXPRESS_CONTACT = {
  /** e.g. "60128889999" for +60 12-888 9999. Empty disables the handoff. */
  whatsapp: "",
  kobisUrl: "https://www.kobisberhad.com",
};

export const SARAWAK_DIVISIONS = [
  "Kuching",
  "Samarahan",
  "Serian",
  "Sri Aman",
  "Betong",
  "Sarikei",
  "Sibu",
  "Mukah",
  "Bintulu",
  "Kapit",
  "Miri",
  "Limbang",
];

export const TITLE_STATUSES = [
  "Individual Title",
  "Strata Title",
  "Native Customary Rights (NCR)",
  "Master Title (Subdivision Pending)",
  "Not Sure — Please Advise",
];

export const EMPLOYMENT_SECTORS = [
  "Government / Public Sector",
  "Government-Linked Company (GLC)",
  "Private Sector",
  "Self-Employed / Business Owner",
  "Retired",
  "Other",
];

export const REQUIRED_DOCUMENTS = [
  { id: "mykad", label: "MyKad", icon: "id" },
  { id: "payslips", label: "Latest Payslips", icon: "doc" },
  { id: "bank-statements", label: "Bank Statements", icon: "bank" },
  { id: "epf", label: "EPF Statement", icon: "chart" },
  { id: "land-title", label: "Land Title", icon: "doc" },
  { id: "supporting", label: "Supporting Documents", icon: "folder" },
];

import type { Lang } from "./i18n";

/* --------------------------------------------------------------------------
   Express lead — data model and attribution.

   One shape, one vocabulary. These field names are the contract the CRM will
   read, so they are snake_case and stable: renaming one here means renaming a
   column downstream. Everything the customer can leave blank is `string` and
   defaults to "", never null, so a CSV export never has ragged rows.
   -------------------------------------------------------------------------- */

export type Lead = {
  lead_id: string;
  introducer_id: string;
  source: string;

  /* 01 — Tanah (all optional) */
  division: string;
  area: string;
  land_size: string;
  remark: string;

  /* 02 — Rumah */
  house_type: string;
  bedrooms: string;
  bathrooms: string;

  /* 03 — Pembiayaan */
  financing_target: string;

  /* 04 — Guide */
  consultation_preference: string;

  /* 05 — Tentang anda */
  customer_name: string;
  phone: string;
  email: string;
  home_number: string;
  consent: string;

  /* Attribution + lifecycle */
  landed_at: string;
  created_at: string;
  status: string;
};

/** Every lead starts here. The CRM owns the states after this one. */
export const INITIAL_STATUS = "NEW LEAD";

/** Recorded when no `?ref=` is present, so "unattributed" is never blank. */
export const DIRECT_SOURCE = "DIRECT";

/* --------------------------------------------------------------------------
   Field options
   -------------------------------------------------------------------------- */

/**
 * Option values are canonical Malay and never translate; only the label a
 * customer reads changes with the language. Labels are keyed by `Lang`, so
 * adding a language fails the build until every option has been translated
 * rather than silently falling back to Malay. See src/lib/i18n.ts.
 */
export type Option = { value: string } & Record<Lang, string>;

/** Which photo stands in for each home type on the selection tiles. */
export const HOUSE_TYPES: Option[] = [
  { value: "1 Tingkat", ms: "1 Tingkat", en: "Single Storey", zh: "\u5355\u5c42", iba: "1 Tingkat" },
  { value: "2 Tingkat", ms: "2 Tingkat", en: "Double Storey", zh: "\u53cc\u5c42", iba: "2 Tingkat" },
  {
    value: "Belum Pasti",
    ms: "Belum Pasti",
    en: "Not Sure Yet",
    zh: "\u8fd8\u4e0d\u786e\u5b9a",
    iba: "Apin Tentu",
  },
];

const UNSURE: Option = {
  value: "Belum Pasti",
  ms: "Belum Pasti",
  en: "Not sure yet",
  zh: "\u8fd8\u4e0d\u786e\u5b9a",
  iba: "Apin tentu",
};

export const BEDROOM_OPTIONS: Option[] = [
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    value: `${n} Bilik`,
    ms: `${n} Bilik`,
    en: `${n} Bedroom${n === 1 ? "" : "s"}`,
    zh: `${n} \u95f4\u623f`,
    iba: `${n} Bilik`,
  })),
  UNSURE,
];

export const BATHROOM_OPTIONS: Option[] = [
  ...["1", "2", "3", "4"].map((n) => ({ value: n, ms: n, en: n, zh: n, iba: n })),
  UNSURE,
];

export const FINANCING_TARGETS: Option[] = [
  {
    value: "Below RM200K",
    ms: "Bawah RM200K",
    en: "Below RM200K",
    zh: "RM200K \u4ee5\u4e0b",
    iba: "Baruh ari RM200K",
  },
  ...["RM200K \u2013 RM400K", "RM400K \u2013 RM600K", "RM600K \u2013 RM800K"].map((band) => ({
    value: band,
    ms: band,
    en: band,
    zh: band,
    iba: band,
  })),
  UNSURE,
];

export const CONSULTATION_MODES: (Option & { note: Record<Lang, string> })[] = [
  {
    value: "Phone Call",
    ms: "Panggilan",
    en: "Phone Call",
    zh: "\u7535\u8bdd",
    iba: "Telefon",
    note: {
      ms: "Kami hubungi anda",
      en: "We call you",
      zh: "\u6211\u4eec\u81f4\u7535\u7ed9\u60a8",
      iba: "Kami ngabas nuan",
    },
  },
  {
    value: "Zoom / Online",
    ms: "Zoom / Online",
    en: "Zoom / Online",
    zh: "Zoom / \u7ebf\u4e0a",
    iba: "Zoom / Online",
    note: {
      ms: "Sesi atas talian",
      en: "An online session",
      zh: "\u7ebf\u4e0a\u4f1a\u9762",
      iba: "Berandau ba online",
    },
  },
  {
    value: "Meet-Up",
    ms: "Jumpa",
    en: "Meet-Up",
    zh: "\u9762\u8c08",
    iba: "Betemu",
    note: {
      ms: "Jumpa secara fizikal",
      en: "Meet in person",
      zh: "\u5f53\u9762\u4f1a\u9762",
      iba: "Betemu ba mua",
    },
  },
];

export const HOME_NUMBERS: Option[] = [
  {
    value: "Rumah Pertama Saya",
    ms: "Rumah Pertama Saya",
    en: "First Home",
    zh: "\u7b2c\u4e00\u5957\u623f",
    iba: "Rumah Keterubah Aku",
  },
  {
    value: "Rumah Kedua Saya",
    ms: "Rumah Kedua Saya",
    en: "Second Home",
    zh: "\u7b2c\u4e8c\u5957\u623f",
    iba: "Rumah Kedua Aku",
  },
  {
    value: "Rumah Ketiga Saya",
    ms: "Rumah Ketiga Saya",
    en: "Third Home",
    zh: "\u7b2c\u4e09\u5957\u623f",
    iba: "Rumah Ketiga Aku",
  },
  {
    value: "Rumah Keempat atau Seterusnya",
    ms: "Rumah Keempat atau Seterusnya",
    en: "Fourth Home or Beyond",
    zh: "\u7b2c\u56db\u5957\u6216\u4ee5\u4e0a",
    iba: "Rumah Keempat tauka Lebih",
  },
];

/**
 * Defaults chosen so the fastest possible path - open, tap tiles, type
 * contact, submit - still produces a usable lead. Anything pre-filled here is
 * the most common answer, not a guess we need the customer to correct.
 */
export const LEAD_DEFAULTS = {
  division: "Kuching",
  area: "",
  land_size: "",
  remark: "",
  house_type: "",
  bedrooms: "4 Bilik",
  bathrooms: "2",
  financing_target: "RM200K \u2013 RM400K",
  consultation_preference: "",
  customer_name: "",
  phone: "",
  email: "",
  home_number: HOME_NUMBERS[0].value,
};

/* --------------------------------------------------------------------------
   Reference ID
   -------------------------------------------------------------------------- */

/** No I/O/0/1 — these get read aloud over the phone to a consultant. */
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * A human-quotable reference, e.g. `MKH-K7P2QX`. It identifies the lead for
 * the customer and the consultant; the CRM record remains the system of
 * record, so a collision here is a cosmetic clash, not a data loss.
 */
export function generateLeadId() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += REF_ALPHABET[byte % REF_ALPHABET.length];
  return `MKH-${out}`;
}

/* --------------------------------------------------------------------------
   Introducer attribution

   The customer never types their introducer. It arrives as `?ref=AGT001`,
   is written to sessionStorage on landing, and is read back at submit — so it
   survives a refresh, a back button, or the customer wandering off to the
   calculator and returning.
   -------------------------------------------------------------------------- */

const ATTRIBUTION_KEY = "mkh.express.attribution";

export type Attribution = {
  introducer_id: string;
  source: string;
  landed_at: string;
};

/** Accepts the aliases a Facebook ad or a WhatsApp link might realistically use. */
const REF_PARAMS = ["ref", "introducer", "agent"];

/** Keep it to what an agent code can be, so a junk query string can't poison the CRM. */
function sanitiseRef(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 32);
}

/**
 * Called once on landing. Writes only — no React state — so it can run in an
 * effect without tripping the rules that forbid setState-from-storage reads.
 * First touch wins: a customer who later reloads without the parameter is
 * still credited to the introducer who sent them.
 */
export function recordLanding() {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    let ref = "";
    for (const key of REF_PARAMS) {
      const found = params.get(key);
      if (found) {
        ref = sanitiseRef(found);
        if (ref) break;
      }
    }

    const attribution: Attribution = {
      introducer_id: ref || DIRECT_SOURCE,
      source: ref ? `REF:${ref}` : DIRECT_SOURCE,
      landed_at: new Date().toISOString(),
    };
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    /* Private browsing with storage disabled — attribution degrades to DIRECT. */
  }
}

export function readAttribution(): Attribution {
  const fallback: Attribution = {
    introducer_id: DIRECT_SOURCE,
    source: DIRECT_SOURCE,
    landed_at: new Date().toISOString(),
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    return {
      introducer_id: parsed.introducer_id || DIRECT_SOURCE,
      source: parsed.source || DIRECT_SOURCE,
      landed_at: parsed.landed_at || fallback.landed_at,
    };
  } catch {
    return fallback;
  }
}

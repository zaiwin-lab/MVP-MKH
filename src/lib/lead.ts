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

export const HOUSE_TYPES = [
  { value: "1 Tingkat", label: "1 Tingkat", icon: "\u{1F3E0}" },
  { value: "2 Tingkat", label: "2 Tingkat", icon: "\u{1F3E1}" },
  { value: "Belum Pasti", label: "Belum Pasti", icon: "?" },
];

export const BEDROOM_OPTIONS = [
  "1 Bilik",
  "2 Bilik",
  "3 Bilik",
  "4 Bilik",
  "5 Bilik",
  "6 Bilik",
  "7 Bilik",
  "8 Bilik",
  "Belum Pasti",
];

export const BATHROOM_OPTIONS = ["1", "2", "3", "4", "Belum Pasti"];

export const FINANCING_TARGETS = [
  "Below RM200K",
  "RM200K – RM400K",
  "RM400K – RM600K",
  "RM600K – RM800K",
  "Belum Pasti",
];

export const CONSULTATION_MODES = [
  {
    value: "Phone Call",
    label: "Phone Call",
    icon: "\u{1F4DE}",
    note: "Kami hubungi anda",
  },
  {
    value: "Zoom / Online",
    label: "Zoom / Online",
    icon: "\u{1F4BB}",
    note: "Sesi atas talian",
  },
  {
    value: "Meet-Up",
    label: "Meet-Up",
    icon: "\u{1F91D}",
    note: "Jumpa secara fizikal",
  },
];

export const HOME_NUMBERS = [
  "Rumah Pertama Saya",
  "Rumah Kedua Saya",
  "Rumah Ketiga Saya",
  "Rumah Keempat atau Seterusnya",
];

/**
 * Defaults chosen so the fastest possible path — open, tap tiles, type
 * contact, submit — still produces a usable lead. Anything pre-filled here is
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
  financing_target: "RM200K – RM400K",
  consultation_preference: "",
  customer_name: "",
  phone: "",
  email: "",
  home_number: HOME_NUMBERS[0],
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

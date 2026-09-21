/**
 * Netlify Forms -> Supabase.
 *
 * Netlify calls this once per verified form submission. Nothing about the
 * website changes: the form keeps posting to Netlify Forms exactly as it does
 * today, Netlify keeps its own copy, and this mirrors each submission into
 * Postgres. That ordering matters — if this function is down, broken or
 * misconfigured, the lead is still captured, because Netlify has already
 * stored it before calling us.
 *
 * The service-role key lives here, in the function's environment, and never
 * reaches a browser.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("NETLIFY_WEBHOOK_SECRET");

/* Anyone can POST to a public function URL, so an unsigned request is an
   anonymous stranger writing rows into the lead table. Refusing to start
   without a secret is the safer failure: a loud 500 gets fixed, a silently
   open endpoint does not. */
const configured = Boolean(SUPABASE_URL && SERVICE_ROLE && WEBHOOK_SECRET);

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replaceAll("-", "+").replaceAll("_", "/")
    .padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

/** Compare without leaking, through timing, how much of the hash matched. */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(body: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Netlify signs outgoing webhooks as a JWS in `X-Webhook-Signature`: an HS256
 * JWT whose payload carries the SHA-256 of the request body. Verifying the
 * signature proves it came from Netlify; comparing the hash proves the body
 * was not altered on the way. Checking only the signature would let a captured
 * header be replayed against a body of the attacker's choosing.
 */
async function verifyNetlifySignature(token: string, rawBody: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, payloadB64, signatureB64] = parts;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(WEBHOOK_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signatureValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signatureB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  );
  if (!signatureValid) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
    if (payload.iss !== "netlify") return false;
    return constantTimeEquals(String(payload.sha256 ?? ""), await sha256Hex(rawBody));
  } catch {
    return false;
  }
}

/** Blank is what the form sends for "not answered"; Postgres wants NULL. */
function timestampOrNull(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!configured) {
    console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or NETLIFY_WEBHOOK_SECRET");
    return new Response("Not configured", { status: 500 });
  }

  const rawBody = await req.text();

  const signature = req.headers.get("x-webhook-signature");
  if (!signature || !(await verifyNetlifySignature(signature, rawBody))) {
    /* Deliberately terse: an attacker probing the endpoint learns nothing
       about which half of the check failed. */
    return new Response("Unauthorized", { status: 401 });
  }

  let submission: Record<string, unknown>;
  try {
    submission = JSON.parse(rawBody);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const data = (submission.data ?? {}) as Record<string, unknown>;

  const row = {
    lead_id: text(data.lead_id),
    introducer_id: text(data.introducer_id) || "DIRECT",
    source: text(data.source) || "DIRECT",

    division: text(data.division),
    area: text(data.area),
    land_size: text(data.land_size),
    remark: text(data.remark),

    house_type: text(data.house_type),
    bedrooms: text(data.bedrooms),
    bathrooms: text(data.bathrooms),

    financing_target: text(data.financing_target),
    consultation_preference: text(data.consultation_preference),

    customer_name: text(data.customer_name),
    phone: text(data.phone),
    email: text(data.email),
    home_number: text(data.home_number),
    consent: text(data.consent),

    landed_at: timestampOrNull(data.landed_at),
    created_at: timestampOrNull(data.created_at),
    status: text(data.status) || "NEW LEAD",

    netlify_submission_id: text(submission.id) || null,
    form_name: text(submission.form_name) || null,
    ip: text(data.ip),
    user_agent: text(data.user_agent),
    referrer: text(data.referrer),

    raw: submission,
  };

  /* merge-duplicates makes a Netlify retry land on the same row instead of
     creating a second lead with the same submission id. */
  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?on_conflict=netlify_submission_id`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE,
      "Authorization": `Bearer ${SERVICE_ROLE}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    /* Returning non-2xx asks Netlify to retry, and Netlify still holds the
       submission either way, so a bad minute here costs nothing permanent. */
    const detail = await response.text();
    console.error("Insert failed", response.status, detail);
    return new Response("Insert failed", { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true, lead_id: row.lead_id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

/**
 * Netlify webhook signature verification.
 *
 * This lives apart from the request handler for one reason: it is the only
 * thing standing between a public function URL and an anonymous stranger
 * writing rows into the lead table, and logic that important should be
 * testable on its own, without a Supabase project or a live request.
 *
 * It uses only Web Crypto, `atob` and `TextEncoder`, so the same source runs
 * unmodified in Deno's edge runtime and in Node for the tests.
 */

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

export async function sha256Hex(body: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Netlify signs outgoing webhooks as a JWS in `X-Webhook-Signature`: an HS256
 * JWT whose payload carries the SHA-256 of the request body.
 *
 * Both halves are required. The signature proves the header came from Netlify;
 * the body hash proves the body is the one that header was issued for. Checking
 * only the signature would let a captured header be replayed against a body of
 * the attacker's choosing.
 */
export async function verifyNetlifySignature(
  token: string,
  rawBody: string,
  secret: string,
): Promise<boolean> {
  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
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

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
    if (payload.iss !== "netlify") return false;

    return constantTimeEquals(String(payload.sha256 ?? ""), await sha256Hex(rawBody));
  } catch {
    /* Malformed base64, malformed JSON, anything at all: an unverifiable
       signature is a failed signature. */
    return false;
  }
}

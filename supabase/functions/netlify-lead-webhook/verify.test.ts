/**
 * Runs in Node so it needs no Supabase project and no live request:
 *   node --experimental-strip-types --test verify.test.ts
 *
 * `signAsNetlify` reproduces how Netlify signs an outgoing webhook, so these
 * tests exercise the real verifier against the real wire format rather than
 * against a restatement of its own logic.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { sha256Hex, verifyNetlifySignature } from "./verify.ts";

const SECRET = "a-long-random-webhook-secret-value";

function toBase64Url(bytes: Uint8Array | string): string {
  const raw = typeof bytes === "string"
    ? bytes
    : String.fromCharCode(...bytes);
  return btoa(raw).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function signAsNetlify(
  body: string,
  secret = SECRET,
  overrides: Record<string, unknown> = {},
): Promise<string> {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = toBase64Url(JSON.stringify({
    iss: "netlify",
    sha256: await sha256Hex(body),
    ...overrides,
  }));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${payload}`)),
  );

  return `${header}.${payload}.${toBase64Url(signature)}`;
}

const BODY = JSON.stringify({
  id: "6ab094ba95c89b68b5a46f55",
  form_name: "mkh-express-lead",
  data: { lead_id: "MKH-ABC123", customer_name: "Ali bin Ahmad", phone: "+60123456789" },
});

test("accepts a genuine Netlify signature", async () => {
  assert.equal(await verifyNetlifySignature(await signAsNetlify(BODY), BODY, SECRET), true);
});

test("rejects a signature made with a different secret", async () => {
  const forged = await signAsNetlify(BODY, "not-the-real-secret");
  assert.equal(await verifyNetlifySignature(forged, BODY, SECRET), false);
});

test("rejects a body swapped after signing", async () => {
  /* The replay that checking only the signature would let through: a real
     header from Netlify, attached to a body the attacker chose. */
  const token = await signAsNetlify(BODY);
  const tampered = BODY.replace("+60123456789", "+60999999999");
  assert.equal(await verifyNetlifySignature(token, tampered, SECRET), false);
});

test("rejects a token issued by someone other than Netlify", async () => {
  const token = await signAsNetlify(BODY, SECRET, { iss: "attacker" });
  assert.equal(await verifyNetlifySignature(token, BODY, SECRET), false);
});

test("rejects a payload with no body hash at all", async () => {
  const token = await signAsNetlify(BODY, SECRET, { sha256: undefined });
  assert.equal(await verifyNetlifySignature(token, BODY, SECRET), false);
});

test("rejects malformed and missing tokens", async () => {
  for (const token of ["", "not-a-jwt", "only.two", "a.b.c.d", "!!!.???.***"]) {
    assert.equal(await verifyNetlifySignature(token, BODY, SECRET), false, token);
  }
});

test("rejects everything when no secret is configured", async () => {
  assert.equal(await verifyNetlifySignature(await signAsNetlify(BODY), BODY, ""), false);
});

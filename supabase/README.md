# Supabase backend — My Kenyalang Homes

## Why it is wired this way

The website is a **static export**. There is no server in it, so it cannot hold
a secret. The obvious approach — a Supabase client in the browser — would ship a
key to every visitor and make the lead table's safety depend on getting Row
Level Security exactly right, forever.

So the database sits *behind* Netlify Forms instead:

```
browser form  ->  Netlify Forms  ->  outgoing webhook  ->  edge function  ->  Postgres
                  (stores it)        (signed, JWS)         (service role)
```

Three things fall out of that order, and all three matter:

1. **Netlify stores the lead before the webhook fires.** If the function is
   down, misconfigured or mid-deploy, the lead is still captured. The database
   is a mirror, not a single point of failure.
2. **No key reaches the browser.** The service-role key lives in the function's
   environment. The publishable key is not used at all.
3. **No website deploy is needed to turn this on.** The page code is untouched,
   which is why this could be switched on while a live ad campaign was running.

## Setup

### 1. Create the project

Supabase dashboard -> New project. Name `my-kenyalang-homes`, region
**Southeast Asia (Singapore)** — closest to Sarawak.

### 2. Apply the schema

Run `migrations/0001_leads.sql`, then `migrations/0002_lock_down_rls_auto_enable.sql`
if the project was created with **automatic RLS** enabled. It creates `public.leads`, its indexes, and
enables RLS with **no policies**, which is what makes the table unreachable by
any browser-side key.

### 3. Deploy the function

Deploy `functions/netlify-lead-webhook` with **JWT verification off** — Netlify
cannot send a Supabase JWT. The function authenticates the caller itself, by
verifying Netlify's JWS signature, which is why turning JWT verification off is
safe here and only here.

Deploy **both** files: `index.ts` and `verify.ts`.

Set the function secret:

| Name | Value |
|---|---|
| `NETLIFY_WEBHOOK_SECRET` | a long random string you generate |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

The function refuses to run at all if any of the three is missing. A loud 500
gets noticed and fixed; an endpoint quietly accepting anonymous writes does not.

### 4. Point Netlify at it

Netlify -> project `mkhomesv1` -> Forms -> **Form notifications** -> Add
notification -> **Outgoing webhook**.

| Field | Value |
|---|---|
| Event | New form submission |
| URL | `https://<project-ref>.supabase.co/functions/v1/netlify-lead-webhook` |
| JWS secret token | the same string as `NETLIFY_WEBHOOK_SECRET` |

The JWS secret is what makes the endpoint trustworthy. Without it the function
returns 401 to everything, including Netlify.

## What is deliberately not here

- **No browser-side Supabase client.** See above.
- **No read policy.** Nothing can `select` from `leads` except the service role.
  A staff dashboard should go behind Supabase Auth with its own policy, never
  behind the anon key.
- **Netlify Forms is not removed.** It is the capture path of record and the
  backup. Removing it would trade a proven path for an unproven one.

## Operating notes

- The webhook is **idempotent** on `netlify_submission_id`. Netlify retries on a
  non-2xx response, and without that unique constraint a retry would create a
  second copy of a lead the sales team then calls twice.
- `received_at` is the server's clock; `landed_at` and `created_at` come from
  the visitor's browser and can be blank or wrong. Trust `received_at`.
- The whole submission is kept in `raw`, so a mapping mistake can be repaired
  after the fact instead of costing you the data.
- Netlify's **spam-filtered** submissions do not fire the webhook. Check the
  Forms spam tab periodically; a real lead can land there.

## Verified on the live project

Checked against `my-kenyalang-homes` after deploying, not assumed:

- the publishable key and the legacy anon key are both refused on `select`
  **and** `insert` against `public.leads` (`42501 permission denied`)
- the function returns `500 Not configured` rather than accepting anything
  while `NETLIFY_WEBHOOK_SECRET` is unset, and `405` on `GET`
- Supabase's security advisor is clean apart from the intentional
  `rls_enabled_no_policy` notice on `leads`, which is the design

## Testing the signature check

The verifier is the only thing between a public URL and an anonymous stranger
writing rows into the lead table, so it lives in `verify.ts` on its own and is
tested without needing a project, a deploy or a live request:

```bash
cd supabase/functions/netlify-lead-webhook
node --experimental-strip-types --test verify.test.ts
```

The test signs bodies the way Netlify does and asserts the verifier rejects a
wrong secret, a body swapped after signing, a non-Netlify issuer, a missing body
hash, malformed tokens, and an unset secret. The body-swap case is the one that
matters most: checking the signature alone would let a captured header be
replayed against a body of the attacker's choosing.

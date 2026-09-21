-- ---------------------------------------------------------------------------
-- My Kenyalang Homes — lead store
--
-- The columns from `lead_id` down to `status` mirror `src/lib/lead.ts` exactly.
-- Those names are the CRM contract: the form posts them, the webhook maps them
-- straight through, and reports read them. Renaming one here means renaming it
-- in the form, the function and every downstream query, so don't.
--
-- Everything the customer may leave blank defaults to '' rather than NULL, for
-- the same reason the TypeScript type uses `string`: a CSV export of this table
-- should never have ragged rows.
-- ---------------------------------------------------------------------------

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  -- 00 — identity and attribution
  lead_id                 text not null,
  introducer_id           text not null default 'DIRECT',
  source                  text not null default 'DIRECT',

  -- 01 — Tanah (all optional)
  division                text not null default '',
  area                    text not null default '',
  land_size               text not null default '',
  remark                  text not null default '',

  -- 02 — Rumah
  house_type              text not null default '',
  bedrooms                text not null default '',
  bathrooms               text not null default '',

  -- 03 — Pembiayaan
  financing_target        text not null default '',

  -- 04 — Guide
  consultation_preference text not null default '',

  -- 05 — Tentang anda
  customer_name           text not null default '',
  phone                   text not null default '',
  email                   text not null default '',
  home_number             text not null default '',
  consent                 text not null default '',

  -- lifecycle. `landed_at` and `created_at` are the browser's clock and can be
  -- absent, so they stay nullable; `received_at` is the server's own and is the
  -- one to trust when the two disagree.
  landed_at               timestamptz,
  created_at              timestamptz,
  status                  text not null default 'NEW LEAD',
  received_at             timestamptz not null default now(),

  -- provenance. The unique submission id is what makes the webhook idempotent:
  -- Netlify retries on a non-2xx, and without this a retry would duplicate a
  -- lead that the sales team then calls twice.
  netlify_submission_id   text unique,
  form_name               text,
  ip                      text,
  user_agent              text,
  referrer                text,

  -- the untouched payload, so a mapping mistake is recoverable after the fact
  raw                     jsonb not null default '{}'::jsonb
);

comment on table public.leads is
  'Lead captures from mkhomes.win. Written only by the netlify-lead-webhook edge function.';

-- Reporting reads: newest first, by introducer for commission, by phone to
-- spot a repeat caller before ringing them back.
create index if not exists leads_received_at_idx    on public.leads (received_at desc);
create index if not exists leads_introducer_id_idx  on public.leads (introducer_id);
create index if not exists leads_status_idx         on public.leads (status);
create index if not exists leads_phone_idx          on public.leads (phone);

-- ---------------------------------------------------------------------------
-- Lockdown.
--
-- RLS on with NO policies is deliberate: it means the publishable/anon key can
-- do precisely nothing to this table — no read, no insert, no update. The only
-- writer is the edge function, which uses the service role and so bypasses RLS
-- entirely. Customer phone numbers never sit behind a key that ships to a
-- browser.
--
-- Adding a policy later is how you'd open a staff dashboard, and it should be
-- behind Supabase Auth, never behind the anon key.
-- ---------------------------------------------------------------------------
alter table public.leads enable row level security;

revoke all on public.leads from anon, authenticated;

/* Granted explicitly rather than left to the project's "automatically expose
   new tables" setting, so this migration behaves the same whichever way that
   dashboard toggle is set. The service role bypasses RLS, which is what lets
   the edge function write while nothing else can read. */
grant all on public.leads to service_role;

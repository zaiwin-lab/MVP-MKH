import type { Lead } from "./lead";

/* --------------------------------------------------------------------------
   Lead submission.

   One function, one seam. The page never knows where a lead goes — swap the
   body of `submitLead` and the whole pipeline moves.

   Today it posts to Netlify Forms, which is the only destination that needs
   no credentials, no server and no secret in the bundle: the site is already
   on Netlify, so submissions land in the project's Forms tab, can be emailed
   to a consultant, exported as CSV, and forwarded to a CRM with an outgoing
   webhook — all from the Netlify UI, with no redeploy.

   When a real CRM lands, replace the fetch below with a call to it. The two
   things to preserve are the `Lead` shape (those keys are the CRM columns)
   and the thrown-error contract (the UI shows a retry, and never tells a
   customer their lead was received when it was not).

   Note for a Supabase/Airtable swap: this runs in the browser, so only a
   publishable/anon key belongs here, guarded by a row-level-security policy
   that permits INSERT and nothing else. A service key must never reach the
   client bundle — anything that needs one belongs behind a function.
   -------------------------------------------------------------------------- */

/** Must match the `name` on the <form> element, or Netlify drops the post. */
export const FORM_NAME = "mkh-express-lead";

/** Netlify silently discards any submission where this field is non-empty. */
export const HONEYPOT_FIELD = "bot-field";

export async function submitLead(lead: Lead): Promise<void> {
  const body = new URLSearchParams({ "form-name": FORM_NAME });
  for (const [key, value] of Object.entries(lead)) {
    body.set(key, value ?? "");
  }

  const response = await fetch(window.location.pathname, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Lead submission failed with status ${response.status}`);
  }
}

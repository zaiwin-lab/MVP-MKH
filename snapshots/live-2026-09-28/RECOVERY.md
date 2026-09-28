# Live site snapshot - 28 September 2026

**This is a recovery artifact, not source.** It is the compiled output that
`mkhomes.win` was serving on this date, fetched over HTTP. It exists because
the live build was produced outside this repository and had no copy in our own
hands: if the Netlify deploy were lost, so was the site.

Netlify's deploy history is the authoritative version and can be rolled back
to from the Netlify UI. Prefer that. Use this only if it is gone.

The site was redeployed between this snapshot being taken and being committed
(`6ab015c74eab6f5e313bd1be` -> `6ab9aaa3cdaaa081cfc5f605`), but the served
homepage was byte-identical across the two, so this snapshot still matches what
is live. Re-check that before relying on it: a deploy id here goes stale the
moment someone publishes.

## What is here

Best effort. The routes listed in the sitemap, the `_next` chunks and fonts
they reference, `robots.txt`, `sitemap.xml` and `og.png`. Anything the site
loads lazily, or any route absent from the sitemap, may be missing. Two
entries (`share`, `express/share`) came back as files rather than directories
and would need fixing before this could be served as-is.

## Why it is not the fix

Serving this again would restore the site but not make it editable - it is
minified output with no source. The real fix is to recover the source the
build came from. Until then no change to the site can be made from this
repository without replacing what is live.

## What differs from this repository, as measured on the day

| | This snapshot | This repository |
|---|---|---|
| Lead form at `/` | yes | no - it is at `/express/` |
| Default language | English | Malay |
| Social image | `og.png?v=win12` | `og-express.jpg` |
| robots rules | allows `/express/share` | does not mention it |
| Footer "Admin" link | present | does not exist |

The first row is the one that matters: the advertising campaign points at
`mkhomes.win`, so deploying this repository as-is would land paid traffic on a
page with no form on it.

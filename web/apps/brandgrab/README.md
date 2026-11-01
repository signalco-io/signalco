# BrandGrab

Run with Node 22 and pnpm 10.20 from `web/`:

```sh
pnpm install --frozen-lockfile --filter brandgrab... --filter .
pnpm --filter brandgrab dev
pnpm --filter brandgrab build
pnpm --filter brandgrab test
```

`SCREENSHOT_API_URL` is a server-only configuration value for the existing
RemoteBrowser `/api/screenshot` endpoint. Configure it separately for Vercel
Production and Preview; use the matching environment's browser service. For local
development, put the Preview endpoint in `.env.local`. Without an override the
app uses the legacy `browser.api.signalco.io` or `.dev` proxy, selected by
`NEXT_PUBLIC_APP_ENV=production`.

The explicit endpoint lets BrandGrab use the existing browser service directly
when the legacy public proxy is unavailable. Requests preserve HTTP(S) URLs,
paths and query parameters. Screenshot failures display an error while keeping
page metadata available.

Appearance follows `prefers-color-scheme` from the first render and updates while
the page is open. It does not store an appearance override.

The inspector starts metadata and desktop (1440 × 1000), tablet (820 × 1180),
and mobile (390 × 844, mobile viewport emulation) captures independently. Each
result renders as it arrives; a failed device does not block the others.
Capture requests enable `scrollThrough` and `fullPage`. The browser service visits
viewports for up to 18 seconds, waits briefly for fonts/images, and finishes CSS
animations before capture. Infinite pages can reach that limit; desktop results
report incomplete scrolling. Authentication, consent dialogs and interaction-only
content can still affect captures.

The desktop request also enables `inspect`, returning sampled computed styles and
basic DOM accessibility checks from RemoteBrowser. Deploy that service together
with this app; an older service still returns screenshots but cannot supply font
or rendered accessibility data. The public proxy preserves the inspection flag.

Palette extraction, inferred color roles, typography aggregation, SEO source-HTML
checks, contrast estimates, social layouts and XML sitemap parsing run on the
client. The server fetches cross-origin HTML/artwork/robots/sitemaps and performs
browser rendering. `/api/document` reuses public-address and redirect validation
and caps uncompressed documents at 2 MB. Sitemap exploration is lazy and follows
one selected document at a time; `.gz` sitemap files are not supported.

Social previews are illustrative. Instagram feed captions do not consistently
render OG cards. Accessibility results are initial automated checks, not a full
WCAG audit; contrast estimates need visual review, especially with images,
gradients and transparency. Font stacks are computed CSS, not a guarantee of
which fallback font rendered.

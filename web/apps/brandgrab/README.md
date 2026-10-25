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

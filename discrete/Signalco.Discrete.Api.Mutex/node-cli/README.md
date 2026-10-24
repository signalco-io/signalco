# Mutex API

Install and use tool from local source

```bash
npm i -g
npx mutex wait KEY
npx mutex release KEY
```

Leases expire after 30 minutes by default. Finish and release before expiration.
See the [API documentation](../README.md) for custom expiration dates and lease
behavior.

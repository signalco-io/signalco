import * as Sentry from '@sentry/nextjs';
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://2a04f9a742e74740952dcebf06313840@o513630.ingest.sentry.io/5615895",
  integrations: [
      new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
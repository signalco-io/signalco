import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

export function initSentry() {
    Sentry.init({
        dsn: "https://2a04f9a742e74740952dcebf06313840@o513630.ingest.sentry.io/5615895",
        integrations: [
            new Integrations.BrowserTracing(),
        ],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
    });
}

export function setUser(userId: string) {
    Sentry.setUser({id: userId})
}
const withPWA = require('next-pwa')
const { createSecureHeaders } = require("next-secure-headers")

const isDevelopment = true;

module.exports = withPWA({
    experimental: { esmExternals: true },
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development'
    },
    async headers() {
        return [{
          source: "/(.*)",
          headers: createSecureHeaders({
            frameGuard: 'deny',
            contentSecurityPolicy: {
              directives: {
                defaultSrc: "'self'",
                scriptSrc: ["'self'", isDevelopment ? "'unsafe-eval'" : undefined],
                objectSrc: "'none'",
                styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                manifestSrc: "'self'",
                mediaSrc: "'self'",
                prefetchSrc: "'self'",
                childSrc: "'self'",
                frameSrc: ["'self'", "https://dfnoise.eu.auth0.com"], 
                workerSrc: "'self'",
                imgSrc: ["'self'", "https://www.signalco.io", "https://lh3.googleusercontent.com"],
                formAction: "'self'",
                connectSrc: ["'self'", "https://www.signalco.io", "https://api.signalco.io", "https://signalhub.service.signalr.net", "https://api.github.com", "https://o513630.ingest.sentry.io", "https://fonts.gstatic.com", "https://dfnoise.eu.auth0.com", "wss://signalhub.service.signalr.net", "https://lh3.googleusercontent.com"],
                baseURI: ['https://www.signalco.io', 'https://next.signalco.io'],
                reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840',
                "frame-ancestors": "'none'"
              },
              reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840',
            },
            xssProtection: "block-rendering",
            forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
            referrerPolicy: "same-origin",
            expectCT: [true,{
                reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840'
            }]
          })
        }];
      },
});

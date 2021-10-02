const withPWA = require('next-pwa')
const { createSecureHeaders } = require("next-secure-headers")

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
                scriptSrc: "'self'",
                objectSrc: "'self'",
                styleSrc: ["'self'", "'unsafe-inline'"],
                fontSrc: ["'self'", "https://fonts.googleapis.com"],
                manifestSrc: "'self'",
                mediaSrc: "'self'",
                prefetchSrc: "'self'",
                childSrc: "'self'",
                frameSrc: "'self'",
                workerSrc: "'self'",
                imgSrc: "'self'",
                formAction: "'self'",
                connectSrc: ["'self'", "https://api.signalco.io", "https://*.sentry.io"],
                baseURI: ['https://www.signalco.io', 'https://next.signalco.io'],
                reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840',
                "frame-ancestors": "none"
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
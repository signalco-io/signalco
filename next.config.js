// const { withPlugins } = require('next-compose-plugins');
const withPWA = require('next-pwa');
const runtimeCaching = require("next-pwa/cache");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { createSecureHeaders } = require("next-secure-headers");
const { withSentryConfig } = require('@sentry/nextjs')

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = withSentryConfig(withBundleAnalyzer(withPWA({
    swcMinify: true,
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        runtimeCaching,
        buildExcludes: [/middleware-manifest.json$/],
    },
    images: {
      formats: ['image/avif', 'image/webp']
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
                imgSrc: ["'self'", "data:", "https://www.signalco.io", "https://lh3.googleusercontent.com", "https://dfnoise.eu.auth0.com"],
                formAction: "'self'",
                connectSrc: ["'self'", "https://www.signalco.io", "https://api.signalco.io", "https://signalhub.service.signalr.net", "https://api.github.com", "https://o513630.ingest.sentry.io", "https://fonts.gstatic.com", "https://dfnoise.eu.auth0.com", "wss://signalhub.service.signalr.net", "https://lh3.googleusercontent.com", "https://fonts.googleapis.com"],
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
})));

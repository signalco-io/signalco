// const { withPlugins } = require('next-compose-plugins');
const withPWA = require('next-pwa');
const runtimeCaching = require("next-pwa/cache");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const { createSecureHeaders } = require("next-secure-headers");
const { withSentryConfig } = require('@sentry/nextjs')

const isDevelopment = process.env.NODE_ENV === "development";

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
        providerImportSource: "@mdx-js/react",
    },
});

module.exports = withSentryConfig(withBundleAnalyzer(withPWA(withMDX({
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ['tsx'],
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        runtimeCaching,
        buildExcludes: [/middleware-manifest.json$/],
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    },
    async headers() {
        return [{
            source: "/(.*)",
            headers: createSecureHeaders({
                frameGuard: 'deny',
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: "'self'",
                        scriptSrc: ["'self'", "https://hcaptcha.com", "https://*.hcaptcha.com", isDevelopment ? "'unsafe-eval'" : undefined],
                        objectSrc: "'none'",
                        styleSrc: ["'self'", "https://hcaptcha.com", "https://*.hcaptcha.com", "'unsafe-inline'"],
                        fontSrc: ["'self'"],
                        manifestSrc: "'self'",
                        mediaSrc: "'self'",
                        prefetchSrc: "'self'",
                        childSrc: "'self'",
                        frameSrc: ["'self'", "https://dfnoise.eu.auth0.com", "https://hcaptcha.com", "https://*.hcaptcha.com"],
                        workerSrc: "'self'",
                        imgSrc: [
                            "'self'", "data:",
                            "https://www.signalco.io", "https://www.signalco.dev",
                            "https://lh3.googleusercontent.com",
                            "https://dfnoise.eu.auth0.com",
                            "https://api.mapbox.com"
                        ],
                        formAction: "'self'",
                        connectSrc: ["'self'",
                            "https://www.signalco.io", "https://api.signalco.io",
                            "https://www.signalco.dev", "https://api.signalco.dev",
                            "https://*.service.signalr.net", "wss://*.service.signalr.net",

                            // Station status checking
                            "https://api.github.com",

                            // Logging
                            "https://o513630.ingest.sentry.io",

                            // Auth
                            "https://dfnoise.eu.auth0.com",

                            // User profile (picture, ...)
                            "https://lh3.googleusercontent.com",

                            // hcaptcha
                            "https://hcaptcha.com", "https://*.hcaptcha.com",

                            // MapBox
                            "https://api.mapbox.com"
                        ],
                        baseURI: ['https://www.signalco.io', 'https://www.signalco.dev'],
                        reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840',
                        "frame-ancestors": "'none'"
                    },
                    reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840',
                },
                xssProtection: "block-rendering",
                forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
                referrerPolicy: "same-origin",
                expectCT: [true, {
                    reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840'
                }]
            })
        }];
    },
}))));

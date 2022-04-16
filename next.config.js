const withPWA = require('next-pwa');
const runtimeCaching = require("next-pwa/cache");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const { createSecureHeaders } = require("next-secure-headers");

const isDevelopment = process.env.NODE_ENV === "development";

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
        providerImportSource: "@mdx-js/react",
    },
});

module.exports = withBundleAnalyzer(withPWA(withMDX({
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
    eslint: {
        dirs: ['worker', 'tools', 'src', 'pages', 'locales', 'docs', 'components', '.storybook']
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
                        "frame-ancestors": "'none'"
                    }
                },
                xssProtection: "block-rendering",
                forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
                referrerPolicy: "same-origin"
            })
        }];
    },
})));

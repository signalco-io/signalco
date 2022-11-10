const { createSecureHeaders } = require('next-secure-headers');
const runtimeCaching = require('next-pwa/cache');
const createPwa = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const isDevelopment = process.env.NODE_ENV === 'development';

const withPWA = createPwa({
    dest: 'public',
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
    disable: isDevelopment
});

const nextConfig = {
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;'
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'pages', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: '\'self\'',
                        scriptSrc: ['\'self\'', 'https://hcaptcha.com', 'https://*.hcaptcha.com', '\'unsafe-inline\'', isDevelopment ? '\'unsafe-eval\'' : undefined],
                        objectSrc: '\'none\'',
                        styleSrc: ['\'self\'', 'https://hcaptcha.com', 'https://*.hcaptcha.com', '\'unsafe-inline\''],
                        fontSrc: ['\'self\''],
                        manifestSrc: '\'self\'',
                        mediaSrc: '\'self\'',
                        prefetchSrc: '\'self\'',
                        childSrc: '\'self\'',
                        frameSrc: ['\'self\'', 'https://dfnoise.eu.auth0.com', 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
                        workerSrc: '\'self\'',
                        imgSrc: [
                            '\'self\'', 'data:',
                            'https://*.signalco.io', 'https://*.signalco.dev',
                            'https://lh3.googleusercontent.com',
                            'https://dfnoise.eu.auth0.com',
                            'https://api.mapbox.com'
                        ],
                        formAction: '\'self\'',
                        connectSrc: ['\'self\'',
                            'https://*.signalco.io', 'https://*.signalco.dev',
                            'https://*.service.signalr.net', 'wss://*.service.signalr.net',

                            // Station status checking
                            'https://api.github.com',

                            // Auth
                            'https://dfnoise.eu.auth0.com',

                            // User profile (picture, ...)
                            'https://lh3.googleusercontent.com',

                            // hcaptcha
                            'https://hcaptcha.com', 'https://*.hcaptcha.com',

                            // MapBox
                            'https://api.mapbox.com',

                            // Finace - Stock widget
                            'https://api.polygon.io'
                        ],
                        baseURI: ['https://www.signalco.io', 'https://www.signalco.dev'],
                        'frame-ancestors': '\'none\''
                    }
                },
                xssProtection: 'block-rendering',
                forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
                referrerPolicy: 'same-origin'
            })
        }];
    },
};

module.exports = isDevelopment
    ? withBundleAnalyzer(nextConfig)
    : withBundleAnalyzer(withPWA(nextConfig));

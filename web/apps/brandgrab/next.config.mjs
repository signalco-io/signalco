import { createSecureHeaders } from 'next-secure-headers';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const isDevelopment = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    reactStrictMode: true,
    experimental: { appDir: true },
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        domains: ['www.brandgrab.io']
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'app', 'locales', 'components']
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
                        baseURI: ['https://www.brandgrab.io'],
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

export default isDevelopment
    ? withBundleAnalyzer(nextConfig)
    : withBundleAnalyzer(nextConfig);

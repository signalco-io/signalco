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
        domains: ['blog.signalco.io', 'www.signalco.io']
    },
    eslint: {
        dirs: ['src', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: '\'self\'',
                        scriptSrc: ['\'self\'', '\'unsafe-inline\'', isDevelopment ? '\'unsafe-eval\'' : undefined],
                        objectSrc: '\'none\'',
                        styleSrc: ['\'self\'', '\'unsafe-inline\''],
                        fontSrc: ['\'self\''],
                        manifestSrc: '\'self\'',
                        mediaSrc: '\'self\'',
                        prefetchSrc: '\'self\'',
                        childSrc: '\'self\'',
                        frameSrc: ['\'self\''],
                        workerSrc: '\'self\'',
                        imgSrc: [
                            '\'self\'', 'data:',
                            'https://*.signalco.io', 'https://*.signalco.dev'
                        ],
                        formAction: '\'self\'',
                        connectSrc: ['\'self\'',
                            'https://*.signalco.io', 'https://*.signalco.dev'
                        ],
                        baseURI: ['https://blog.signalco.io', 'https://www.signalco.io/blog', 'https://www.signalco.dev/blog'],
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

export default withBundleAnalyzer(nextConfig);

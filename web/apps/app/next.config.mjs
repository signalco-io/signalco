import { createSecureHeaders } from 'next-secure-headers';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data/node';

const isDevelopment = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        remotePatterns: [
            {
                hostname: 'www.signalco.io',
                pathname: '/images/**',
                protocol: 'https',
            },
            {
                hostname: 'www.signalco.io',
                pathname: '/assets/**',
                protocol: 'https',
            }
        ]
    },
    experimental: {
        reactCompiler: true
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'pages', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['app.signalco.io', 'app.signalco.dev'],
                true,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.signalco,
                    knownSecureHeadersExternalUrls.hcaptcha,
                    knownSecureHeadersExternalUrls.auth0('dfnoise.eu'),
                    knownSecureHeadersExternalUrls.google,
                    knownSecureHeadersExternalUrls.googleFonts,
                    knownSecureHeadersExternalUrls.mapbox,
                    knownSecureHeadersExternalUrls.azureSignalR,
                    knownSecureHeadersExternalUrls.polygon,
                    knownSecureHeadersExternalUrls.vercel
                ]
            ))
        }];
    },
};

export default nextConfig;

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
                hostname: 'slco.io',
                pathname: '/images/**',
                protocol: 'https',
            },
            {
                hostname: 'slco.io',
                pathname: '/assets/**',
                protocol: 'https',
            }
        ]
    },
    experimental: {
        reactCompiler: true
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['slco.io', 'slco.signalco.io', 'slco.signalco.dev'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.github,
                    knownSecureHeadersExternalUrls.googleFonts,
                    knownSecureHeadersExternalUrls.vercel
                ]
            ))
        }];
    },
};

export default nextConfig;

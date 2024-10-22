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
                hostname: 'uier.io',
                pathname: '/images/**',
                protocol: 'https',
            },
            {
                hostname: 'uier.io',
                pathname: '/assets/**',
                protocol: 'https',
            }
        ]
    },
    experimental: {
        reactCompiler: true
    },
    eslint: {
        dirs: ['src', 'app', 'locales']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['uier.io', 'next.uier.io'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.googleFonts,
                    { scriptSrc: 'http://localhost:4005', styleSrc: 'http://localhost:4005' },
                ]
            ))
        }];
    },
};

export default nextConfig;

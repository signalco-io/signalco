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
                hostname: 'doprocess.app',
                pathname: '/images/**',
                protocol: 'https',
            },
            {
                hostname: 'doprocess.app',
                pathname: '/assets/**',
                protocol: 'https',
            }
        ]
    },
    experimental: {
        reactCompiler: true
    },
    eslint: {
        dirs: ['src', 'app', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['doprocess.app', 'doprocess.signalco.io', 'doprocess.signalco.dev'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.github,
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.googleFonts,
                    { scriptSrc: 'http://localhost:5500', styleSrc: 'http://localhost:5500' },
                    {
                        frameAncestors: '\'self\'' // NOTE: This is required for embedding out app in an iframe
                    }
                ]
            ))
        }];
    },
};

export default nextConfig;

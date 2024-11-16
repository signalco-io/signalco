import { createSecureHeaders } from 'next-secure-headers';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data/node';
import mdx from '@next/mdx';

const isDevelopment = process.env.NODE_ENV === 'development';

const withMDX = mdx();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    experimental: {
        mdxRs: true,
        reactCompiler: true
    },
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
            },
            {
                hostname: 'blog.signalco.io',
                pathname: '/images/**',
                protocol: 'https',
            },
            {
                hostname: 'blog.signalco.io',
                pathname: '/assets/**',
                protocol: 'https',
            }
        ]
    },
    eslint: {
        dirs: ['src', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['blog.signalco.io', 'www.signalco.io', 'www.signalco.dev'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.signalco,
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.googleFonts,
                ]
            ))
        }];
    },
};

export default withMDX(nextConfig);

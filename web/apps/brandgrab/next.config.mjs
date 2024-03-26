import { createSecureHeaders } from 'next-secure-headers';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data/node';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const isDevelopment = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        outputFileTracingExcludes: {
            '*': [
                './**/node_modules/@swc/core-linux-x64-gnu',
                './**/node_modules/@swc/core-linux-x64-musl',
                './**/node_modules/esbuild/linux',
                './**/node_modules/webpack',
                './**/node_modules/rollup',
                './**/node_modules/terser',
            ],
        },
    },
    outputFileTracing: true,
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        remotePatterns: [
            {
                hostname: 'www.brandgrab.io',
                pathname: '/images/**',
                protocol: 'https',
            },
            {
                hostname: 'www.brandgrab.io',
                pathname: '/assets/**',
                protocol: 'https',
            }
        ]
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['brandgrab.io', 'brandgrab.signalco.io', 'brandgrab.signalco.dev'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.signalco,
                    knownSecureHeadersExternalUrls.vercel
                ]
            ))
        }];
    },
};

export default isDevelopment
    ? withBundleAnalyzer(nextConfig)
    : withBundleAnalyzer(nextConfig);

import { fileURLToPath } from 'url';
import path from 'path';
import { createSecureHeaders } from 'next-secure-headers';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data/node';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDevelopment = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        outputFileTracingRoot: path.join(__dirname, '../../')
    },
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        domains: ['workingparty.ai']
    },
    eslint: {
        dirs: ['src', 'app', 'locales']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['workingparty.ai', 'next.workingparty.ai'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.stripe,
                ]
            ))
        }];
    },
};

const componsedNextConfig = withBundleAnalyzer(nextConfig);

export default componsedNextConfig;

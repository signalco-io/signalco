import { createSecureHeaders } from 'next-secure-headers';
import {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data/node';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const isDevelopment = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        domains: ['uier.io']
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['uier.io', 'uier.signalco.io', 'uier.signalco.dev'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.vercel,
                    { scriptSrc: 'http://localhost:5500', styleSrc: 'http://localhost:5500' },
                ]
            ))
        }];
    },
};

const componsedNextConfig = withBundleAnalyzer(nextConfig);

// NOTE: As documented here - https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started
const nextConfigFunction = async (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
        const withPWA = (await import('@ducanh2912/next-pwa')).default({
            buildExcludes: [/middleware-manifest.json$/, /chunks\/images\/.*$/],
            dynamicStartUrl: false,
            disable: isDevelopment,
        });
        return withPWA(componsedNextConfig);
    }
    return componsedNextConfig;
};

export default nextConfigFunction;

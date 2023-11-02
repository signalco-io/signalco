import { createSecureHeaders } from 'next-secure-headers';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data';
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
        domains: ['doprocess.app']
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'app', 'locales', 'components']
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
                    knownSecureHeadersExternalUrls.clarity,
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.clerk,
                ]
            ))
        }];
    },
};

export default isDevelopment
    ? withBundleAnalyzer(nextConfig)
    : withBundleAnalyzer(nextConfig);

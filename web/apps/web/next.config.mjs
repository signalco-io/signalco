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
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        domains: ['www.signalco.io']
    },
    eslint: {
        dirs: ['src', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['www.signalco.io', 'www.signalco.dev'],
                true,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.hcaptcha,
                    knownSecureHeadersExternalUrls.github,
                    knownSecureHeadersExternalUrls.google,
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.checkly
                ].filter(Boolean)
            ))
        }];
    },
};

const componsedNextConfig = withBundleAnalyzer(nextConfig);

export default componsedNextConfig;

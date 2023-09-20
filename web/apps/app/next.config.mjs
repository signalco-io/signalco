import { createSecureHeaders } from 'next-secure-headers';
import nextPwa from 'next-pwa';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const isDevelopment = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});
const withPWA = nextPwa({
    dest: 'public',
    buildExcludes: [/middleware-manifest.json$/, /chunks\/images\/.*$/],
    dynamicStartUrl: false,
    disable: isDevelopment
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
                    knownSecureHeadersExternalUrls.mapbox,
                    knownSecureHeadersExternalUrls.azureSignalR,
                    knownSecureHeadersExternalUrls.polygon,
                    knownSecureHeadersExternalUrls.clarity,
                    knownSecureHeadersExternalUrls.vercel
                ]
            ))
        }];
    },
};

export default isDevelopment
    ? withBundleAnalyzer(nextConfig)
    : withBundleAnalyzer(withPWA(nextConfig));

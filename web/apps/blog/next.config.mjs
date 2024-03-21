import { createSecureHeaders } from 'next-secure-headers';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data/node';
import mdx from '@next/mdx';

const isDevelopment = process.env.NODE_ENV === 'development';

const withMDX = mdx();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        mdxRs: true
    },
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        domains: ['blog.signalco.io', 'www.signalco.io']
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
                    knownSecureHeadersExternalUrls.vercel
                ]
            ))
        }];
    },
};

export default process.env.ANALYZE ?
    import('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true',
    })(withMDX(nextConfig)) :
    withMDX(nextConfig);

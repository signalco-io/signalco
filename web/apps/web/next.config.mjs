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
                hostname: 'www.signalco.io',
                pathname: '/images/**',
                protocol: 'https',
            },
            {
                hostname: 'www.signalco.io',
                pathname: '/assets/**',
                protocol: 'https',
            }
        ]
    },
    experimental: {
        reactCompiler: true
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
                    knownSecureHeadersExternalUrls.googleFonts,
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.checkly,
                    {
                        imgSrc: ['https://workingparty.ai', 'https://doprocess.app', 'https://slco.io', 'https://brandgrab.io', 'https://uier.io', 'https://modrobots.com'],
                    }
                ].filter(Boolean)
            ))
        }];
    },
};

export default nextConfig;

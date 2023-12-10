import Script from 'next/script';
import { Inter } from 'next/font/google';
import { Viewport, type Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './global.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {(process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview') && (
                    // eslint-disable-next-line @next/next/no-sync-scripts
                    <script
                        data-project-id="uMeGMJWOTzWxhNff2LB8swMf5HXSwhWhEJHPyQk0"
                        data-is-production-environment="false"
                        src="https://snippet.meticulous.ai/v1/meticulous.js"
                    />
                )}
            </head>
            <body className={`${inter.variable} font-sans`}>
                {children}
                <Analytics />
                <Script src="/clarity.js" />
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco',
    description: 'Automate your life',
    manifest: '/manifest.webmanifest',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ]
    }
} satisfies Metadata;

export const viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ]
} satisfies Viewport;

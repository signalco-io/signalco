import Script from 'next/script';
import { Metadata, Viewport } from 'next';
import './global.css';
import { Analytics } from '@vercel/analytics/react';
import { ClientProvider } from '../src/components/providers/ClientProvider';
import { AuthProvider } from '../src/components/providers/AuthProvider';

export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={'font-sans'}>
                <AuthProvider>
                    <ClientProvider>
                        {children}
                        <Analytics />
                        <Script src="http://localhost:4005/index.js" />
                    </ClientProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

export const metadata = {
    title: 'uier',
    description: 'uier',
    manifest: '/manifest.json',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ],
    }
} satisfies Metadata;

export const viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ]
} satisfies Viewport;

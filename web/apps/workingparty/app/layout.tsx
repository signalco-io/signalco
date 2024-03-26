import { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import './global.css';
import { Analytics } from '@vercel/analytics/react';
import { ClientProvider } from '../src/components/providers/ClientProvider';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans`}>
                <ClientProvider>
                    {children}
                    <Analytics />
                </ClientProvider>
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Working Party',
    description: 'Working Party - your AI powered group of experts',
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

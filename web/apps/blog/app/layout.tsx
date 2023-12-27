import { Inter } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { PageLayout } from '../components/layouts/PageLayout';
import './global.css';
import { PropsWithChildren } from 'react';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans`}>
                <PageLayout>{children}</PageLayout>
                <Analytics />
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco | Blog',
    description: 'Automate your life',
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

import './global.css';
import { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';
import { type Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { AppLayout } from '../components/layouts/AppLayout';
import { LayoutClientWrapper } from './LayoutClientWrapper';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans`}>
                <LayoutClientWrapper>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </LayoutClientWrapper>
                <Analytics />
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco',
    description: 'Automate your life',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
        { color: '#000000' },
    ],
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ]
    }
} satisfies Metadata;

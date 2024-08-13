import { ReactNode } from 'react';
import { Viewport, type Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './global.css';
import { RootClientProvider } from '../components/providers/RootClientProvider';
import { PageLayout } from '../components/layouts/PageLayout';

export default function RootLayout({ children, }: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body className={'font-sans'}>
                <RootClientProvider>
                    <PageLayout>
                        {children}
                    </PageLayout>
                </RootClientProvider>
                <Analytics />
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

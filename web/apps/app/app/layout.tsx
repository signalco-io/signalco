import './global.css';
import { PropsWithChildren } from 'react';
import { Viewport, type Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { AppLayout } from '../components/layouts/AppLayout';
import { LayoutClientWrapper } from './LayoutClientWrapper';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={'font-sans'}>
                <LayoutClientWrapper>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </LayoutClientWrapper>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco',
    description: 'Automate your life',
    manifest: '/manifest.json',
    icons: {
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

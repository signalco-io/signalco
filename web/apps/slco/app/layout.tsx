'use client';

import { Metadata } from 'next';
import { buildSignalcoTheme , CssBaseline, CssVarsProvider, getInitColorSchemeScript } from '@signalco/ui';
import '@signalco/ui/dist/ui.css';
import './global.scss';

const signalcoTheme = buildSignalcoTheme();

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {getInitColorSchemeScript()}
                <CssVarsProvider theme={signalcoTheme} defaultMode="light">
                    <CssBaseline />
                    {children}
                </CssVarsProvider>
            </body>
        </html>
    );
}

export const metadata = {
    title: 'slco',
    description: 'Short links',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ],
    manifest: '/manifest.json',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'}
        ]
    }
} satisfies Metadata;

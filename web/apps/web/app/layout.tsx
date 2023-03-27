'use client';

import Script from 'next/script';
import { buildSignalcoTheme, CssBaseline, CssVarsProvider, getInitColorSchemeScript } from '@signalco/ui';
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
                <CssVarsProvider theme={signalcoTheme} defaultMode="system">
                    <CssBaseline />
                    {children}
                </CssVarsProvider>
                <Script src="/clarity.js" />
            </body>
        </html>
    );
}

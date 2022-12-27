'use client';

import { CssBaseline, CssVarsProvider, getInitColorSchemeScript } from '@signalco/ui';
import appTheme from '../src/theme';
import '@signalco/ui/dist/ui.css';
import './global.scss';

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
                <CssVarsProvider theme={appTheme}>
                    <CssBaseline />
                    {children}
                </CssVarsProvider>
            </body>
        </html>
    );
}

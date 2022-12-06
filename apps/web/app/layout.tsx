'use client';

import '../styles/global.scss';
import { CssBaseline, CssVarsProvider, joiGetInitColorSchemeScript } from '@signalco/ui';
import appTheme from '../src/theme';

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
                {joiGetInitColorSchemeScript()}
                <CssVarsProvider theme={appTheme}>
                    <CssBaseline />
                    {children}
                </CssVarsProvider>
            </body>
        </html>
    );
}

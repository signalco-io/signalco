'use client';

import '../styles/global.scss';
import { getInitColorSchemeScript as joiGetInitColorSchemeScript, CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
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

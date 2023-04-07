'use client';

import '../styles/global.scss';
import '@signalco/ui/dist/ui.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ChildrenProps, CssBaseline, CssVarsProvider, getInitColorSchemeScript, buildSignalcoTheme } from '@signalco/ui';
import useAppTheme from '../src/hooks/useAppTheme';
import { AppLayout } from '../components/layouts/AppLayout';
import { Metadata } from 'next';

function ThemeChangerWrapper(props: ChildrenProps) {
    useAppTheme();
    return <>{props.children}</>;
}

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
                <CssVarsProvider theme={signalcoTheme}>
                    <CssBaseline />
                    <ThemeChangerWrapper>
                        <ToastContainer />
                        <AppLayout>
                            {children}
                        </AppLayout>
                    </ThemeChangerWrapper>
                </CssVarsProvider>
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco',
    description: 'Automate your life',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ],
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'}
        ]
    }
} satisfies Metadata;

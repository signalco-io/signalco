'use client';

import '../styles/global.scss';
import '@signalco/ui/dist/ui.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ChildrenProps, CssBaseline, CssVarsProvider, getInitColorSchemeScript, signalcoTheme } from '@signalco/ui';
import useAppTheme from '../src/hooks/useAppTheme';
import { AppLayout } from '../components/layouts/AppLayout';

function ThemeChangerWrapper(props: ChildrenProps) {
    useAppTheme();
    return <>{props.children}</>;
}

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

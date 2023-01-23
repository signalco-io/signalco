'use client';

import '../styles/global.scss';
import '@signalco/ui/dist/ui.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChildrenProps, CssBaseline, CssVarsProvider, getInitColorSchemeScript, signalcoTheme } from '@signalco/ui';
import useAppTheme from '../src/hooks/useAppTheme';
import { AppLayoutWithAuth } from '../components/layouts/AppLayoutWithAuth';

const queryClient = new QueryClient();

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
                    <QueryClientProvider client={queryClient}>
                        <ThemeChangerWrapper>
                            <ToastContainer />
                            <AppLayoutWithAuth>
                                {children}
                            </AppLayoutWithAuth>
                        </ThemeChangerWrapper>
                    </QueryClientProvider>
                </CssVarsProvider>
            </body>
        </html>
    );
}

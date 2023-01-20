import { ToastContainer } from 'react-toastify';
import React, { FunctionComponent, useMemo } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, CssVarsProvider, signalcoTheme } from '@signalco/ui';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';
import '@signalco/ui/dist/ui.css';
import { ChildrenProps } from '../src/sharedTypes';
import useAppTheme from '../src/hooks/useAppTheme';

const queryClient = new QueryClient();

// TODO: Remove when migrated to app directory
type PageWithMetadata = FunctionComponent  & {
  layout?: React.FunctionComponent | undefined
  title?: string | undefined
}

function ThemeChangerWrapper(props: ChildrenProps) {
    useAppTheme();
    return <>{props.children}</>;
}

export default function App(props: AppProps) {
    const { Component, pageProps } = props;

    const pageWithMetadata = (Component as PageWithMetadata);
    const Layout = pageWithMetadata.layout ?? ((props?: ChildrenProps) => <>{props?.children}</>);
    const title = useMemo(() => (Component as PageWithMetadata).title, [Component]);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
                <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
                <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
                <meta name="theme-color" content="black"></meta>
                <meta name="description" content="Automate your life" />
                <title>{`Signalco${title ? ' - ' + title : ''}`}</title>
            </Head>
            <CssVarsProvider theme={signalcoTheme} defaultMode="system">
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <ThemeChangerWrapper>
                        <ToastContainer />
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ThemeChangerWrapper>
                </QueryClientProvider>
            </CssVarsProvider>
        </>
    );
}

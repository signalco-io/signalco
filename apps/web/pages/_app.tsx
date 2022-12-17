import { ToastContainer } from 'react-toastify';
import React, { FunctionComponent, useMemo } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, CssVarsProvider } from '@signalco/ui';
import appTheme from '../src/theme';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';
import '@signalco/ui/dist/ui.css';
import { ChildrenProps } from '../src/sharedTypes';

const queryClient = new QueryClient();

export interface PageWithMetadata extends FunctionComponent<any> {
  layout?: React.FunctionComponent | undefined
  inDevelopment?: boolean | undefined,
  title?: string | undefined
};

function ThemeChangerWrapper(props: ChildrenProps) {
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
      <CssVarsProvider theme={appTheme}>
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

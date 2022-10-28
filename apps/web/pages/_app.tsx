import React, { FunctionComponent, useMemo } from 'react';
import { SnackbarProvider } from 'notistack';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import appTheme from '../src/theme';
import '../styles/global.scss';
import { ChildrenProps } from '../src/sharedTypes';
import useAppTheme from '../src/hooks/useAppTheme';

const queryClient = new QueryClient();

export interface PageWithMetadata extends FunctionComponent<any> {
  layout?: React.FunctionComponent | undefined
  inDevelopment?: boolean | undefined,
  title?: string | undefined
};

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
      <CssVarsProvider theme={appTheme}>
        <QueryClientProvider client={queryClient}>
          <ThemeChangerWrapper>
            <SnackbarProvider maxSnack={3}>
              <CssBaseline />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SnackbarProvider>
          </ThemeChangerWrapper>
        </QueryClientProvider>
      </CssVarsProvider>
    </>
  );
}

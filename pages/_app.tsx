import React, { createContext, FunctionComponent, useMemo, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import appTheme from '../src/theme';
import '../styles/global.scss';
import { ChildrenProps } from '../src/sharedTypes';
import useAppTheme from '../src/hooks/useAppTheme';
import IAppContext from '../src/appContext/IAppContext';

export interface PageWithMetadata extends FunctionComponent<any> {
  layout?: React.FunctionComponent | undefined
  inDevelopment?: boolean | undefined,
  title?: string | undefined
};

const themeContextDefault: IAppContext = {
  theme: 'light',
  isDark: false
};

export const ThemeContext = createContext<IAppContext>(themeContextDefault);

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [themeContextState, setAppContextState] = useState<IAppContext>(themeContextDefault);
  useAppTheme(themeContextState, setAppContextState);

  const Layout = useMemo(() => {
    const pageWithMetadata = (Component as PageWithMetadata);
    return pageWithMetadata.layout ?? ((props?: ChildrenProps) => <>{props?.children}</>);
  }, [Component]);

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
        <meta name="theme-color" content={`${themeContextState.isDark ? '#000000' : '#ffffff'}`}></meta>
        <meta name="description" content="Automate your life" />
        <title>{`Signalco${title ? ' - ' + title : ''}`}</title>
      </Head>
      <ThemeProvider theme={appTheme(themeContextState.theme)}>
        <ThemeContext.Provider value={themeContextState}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProvider>
        </ThemeContext.Provider>
      </ThemeProvider>
    </>
  );
}

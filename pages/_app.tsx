import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import appTheme from '../src/theme';
import '../styles/global.scss';
import { SnackbarProvider } from 'notistack';
import { ChildrenProps } from '../src/sharedTypes';
import IAppContext from '../src/appContext/IAppContext';
import useAppTheme from '../src/hooks/useAppTheme';

export interface PageWithMetadata extends React.FunctionComponent<any> {
  layout?: React.FunctionComponent | undefined
  inDevelopment?: boolean | undefined,
  title?: string | undefined
};

const themeContextDefault: IAppContext = {
  theme: 'light',
  isDark: false
};

export const ThemeContext = React.createContext<IAppContext>(themeContextDefault);

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [themeContextState, setAppContextState] = React.useState<IAppContext>(themeContextDefault);
  useAppTheme(themeContextState, setAppContextState);

  const pageWithMetadata = (Component as PageWithMetadata);
  const Layout = pageWithMetadata.layout ?? ((props?: ChildrenProps) => <>{props?.children}</>);
  const title = pageWithMetadata.title;

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

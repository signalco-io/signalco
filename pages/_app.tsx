import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import theme from "../src/theme";
import "../styles/global.scss";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from '../src/createEmotionCache';
import { SnackbarProvider } from 'notistack';
import LocalStorageService from "../src/services/LocalStorageService";
import { MDXProvider } from '@mdx-js/react';
import { ChildrenProps } from "../src/sharedTypes";
import components from '../components/mdxComponents';

const isServerSide = typeof window === 'undefined';
const clientSideEmotionCache = createEmotionCache();

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
  err: any;
}

export interface IAppContext {
  theme: string,
  setTheme?: (theme: string) => void;
}

const appContextDefaultState = {
  theme: 'light'
};

export const AppContext = React.createContext<IAppContext>(appContextDefaultState);

export default function App(props: CustomAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, err } = props;
  const handleThemeChange = (theme: string) => {
    LocalStorageService.setItem("theme", theme);
    setAppContext({
      ...appContextState,
      theme: theme
    });
  };

  const [appContextState, setAppContext] = React.useState<IAppContext>({
    ...appContextDefaultState,
    setTheme: handleThemeChange
  });

  React.useEffect(() => {
    // Apply theme to document
    if (!isServerSide) {
      const themeMode = LocalStorageService.getItemOrDefault("theme", window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
      document.documentElement.style.setProperty("color-scheme", themeMode);
      if (themeMode !== 'light') {
        setAppContext({ ...appContextState, theme: 'dark' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Layout = (Component as any).layout ?? ((props: ChildrenProps) => <>{props.children}</>);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest"></link>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color="#000000"
        ></link>
        <meta name="msapplication-TileColor" content="#000000"></meta>
        <meta name="theme-color" content="#000000"></meta>
        <meta name="description" content="Automate your life" />
        <title>Signalco</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme(appContextState.theme === 'dark')}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <AppContext.Provider value={appContextState}>
            <Layout>
              <MDXProvider components={components}>
                <Component {...pageProps} err={err} />
              </MDXProvider>
            </Layout>
          </AppContext.Provider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

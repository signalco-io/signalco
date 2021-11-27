import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNprogress from "nextjs-progressbar";
import theme from "../src/theme";
import "../styles/global.scss";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { useRouter } from "next/router";
import createEmotionCache from '../src/createEmotionCache';
import { SnackbarProvider } from 'notistack';
import LocalStorageService from "../src/services/LocalStorageService";

const isServerSide = typeof window === 'undefined';
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
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

export default function App(props: MyAppProps) {
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

  console.debug("App rendering");

  React.useEffect(() => {
    // Apply theme to document
    if (!isServerSide) {
      const themeMode = LocalStorageService.getItem("theme", window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
      document.documentElement.style.setProperty("color-scheme", themeMode);
      if (themeMode !== 'light') {
        setAppContext({ ...appContextState, theme: 'dark' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PWA
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && typeof (window as any).workbox !== 'undefined') {
      // skip index route, because it's already cached under `start-url` caching object
      if (router.route !== '/') {
        const wb = (window as any).workbox
        wb.active.then(() => {
          wb.messageSW({ action: 'CACHE_NEW_ROUTE' })
        })
      }
    }
  }, [router.route])

  const Layout = typeof (Component as any).layout !== undefined
    ? (Component as any).layout
    : undefined;

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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme(appContextState.theme === 'dark')}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <>
              <AppContext.Provider value={appContextState}>
                {typeof Layout === "function" ? (
                  <Layout>
                    <Component {...pageProps} err={err} />
                  </Layout>
                ) : (
                  <Component {...pageProps} err={err} />
                )}
              </AppContext.Provider>
              <NextNprogress
                color="#fff"
                startPosition={0.3}
                stopDelayMs={200}
                height={2}
              />
            </>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}

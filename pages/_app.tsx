import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNprogress from "nextjs-progressbar";
import theme from "../src/theme";
import "../styles/global.scss";
import "../components/shared/indicators/RippleIndicator.scss"
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Auth0Provider } from "@auth0/auth0-react";
import Router, { useRouter } from "next/router";
import { initSentry } from "../src/errors/SentryUtil";
import createEmotionCache from '../src/createEmotionCache';
// import { SnackbarProvider } from 'notistack';

const isServerSide = typeof window === 'undefined';
const clientSideEmotionCache = createEmotionCache();

initSentry();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [isOnline, setIsOnline] = React.useState(true);
  const [isLight, setIsLight] = React.useState(true);

  React.useEffect(() => {
    // Handle 'cache on fe nav'
    // Source: https://github.com/shadowwalker/next-pwa/blob/master/examples/cache-on-front-end-nav/pages/_app.js
    if (typeof window !== 'undefined' && 'ononline' in window && 'onoffline' in window) {
      if (!window.navigator.onLine) {
        setIsOnline(false);
      }
      if (!window.ononline) {
        window.addEventListener('online', () => {
          setIsOnline(true);
        })
      }
      if (!window.onoffline) {
        window.addEventListener('offline', () => {
          setIsOnline(false);
        })
      }
    }

    // Apply theme to document
    if (!isServerSide) {
      const themeMode = window.localStorage.getItem("theme") ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
      document.documentElement.style.setProperty("color-scheme", themeMode);
      if (themeMode !== 'light') {
        setIsLight(false);
      }
    }
  }, []);

  // PWA 
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && typeof (window as any).workbox !== 'undefined' && isOnline) {
      // skip index route, because it's already cached under `start-url` caching object
      if (router.route !== '/') {
        const wb = (window as any).workbox
        wb.active.then(() => {
          wb.messageSW({ action: 'CACHE_NEW_ROUTE' })
        })
      }
    }
  }, [isOnline, router.route])

  const Layout = typeof (Component as any).layout !== undefined
    ? (Component as any).layout
    : undefined;

  let redirectUri = 'https://www.signalco.io/login-return';
  if (typeof window !== "undefined" && window.location.origin.indexOf('localhost:3000') > 0) {
    redirectUri = `${window.location.origin}/login-return`;
  } else if (typeof window !== "undefined" && window.location.origin.indexOf('next.signalco.io') > 0) {
    redirectUri = `https://next.signalco.io/login-return`;
  }

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
      {/* <StyledEngineProvider injectFirst> */}
      <ThemeProvider theme={theme(!isLight)}>
        {/* <SnackbarProvider maxSnack={3}> */}
        <CssBaseline />
        <Auth0Provider
          redirectUri={redirectUri}
          onRedirectCallback={(appState) => {
            // Use Next.js's Router.replace method to replace the url
            Router.replace(appState?.returnTo || "/");
          }}
          domain="dfnoise.eu.auth0.com"
          clientId="nl7QIQD7Kw3ZHt45qHHAZG0MEILSFa7U"
          audience="https://api.signalco.io"
        >
          {typeof Layout === "function" ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </Auth0Provider>
        <NextNprogress
          color="#fff"
          startPosition={0.3}
          stopDelayMs={200}
          height={2}
        />
        {/* </SnackbarProvider> */}
      </ThemeProvider>
      {/* </StyledEngineProvider> */}
    </CacheProvider>
  );
}

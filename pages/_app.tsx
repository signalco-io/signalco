import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNprogress from "nextjs-progressbar";
import theme from "../src/theme";
import "../styles/global.scss";
import createCache from '@emotion/cache';
import { CacheProvider } from "@emotion/react";
import { Auth0Provider } from "@auth0/auth0-react";
import Router, { useRouter } from "next/router";
import { initSentry } from "../src/errors/SentryUtil";
import { SnackbarProvider } from 'notistack';
import { ThemeProvider as NextThemesThemeProvider, useTheme } from 'next-themes';

initSentry();

export const cache = createCache({ key: 'css', prepend: true });

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }

    // Handle 'cache on fe nav'
    // Source: https://github.com/shadowwalker/next-pwa/blob/master/examples/cache-on-front-end-nav/pages/_app.js
    if (typeof window !== 'undefined' && 'ononline' in window && 'onoffline' in window) {
      setIsOnline(window.navigator.onLine)
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
  }, []);

  // PWA 
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && typeof (window as any).workbox !== 'undefined' && isOnline) {
      // skip index route, because it's already cached under `start-url` caching object
      if (router.route !== '/app') {
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

  const redirectUri = typeof window !== "undefined" && window.location.origin.indexOf('localhost:3000') > 0
    ? `${window.location.origin}/app`
    : 'https://www.signalco.io/app';

  return (
    <NextThemesThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
      <CacheProvider value={cache}>
        <Head>
          <meta charSet="utf-8"></meta>
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
          <title>Signalco</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme(useTheme().theme === "dark")}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Auth0Provider
              redirectUri={redirectUri}
              onRedirectCallback={(appState) => {
                // Use Next.js's Router.replace method to replace the url
                const pageMatch = appState?.returnTo?.match(/(.*)\?.*/);
                const pageMatchPart = pageMatch && pageMatch.length > 1 ? pageMatch[1] : "/"
                //Router.replace(pageMatchPart);
                Router.push(pageMatchPart);
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
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </NextThemesThemeProvider>
  );
}

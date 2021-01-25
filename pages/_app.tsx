import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNprogress from "nextjs-progressbar";
import theme from "../src/theme";
import "../styles/global.scss";
import createCache from '@emotion/cache';
import { CacheProvider } from "@emotion/react";
import { Auth0Provider } from "@auth0/auth0-react";
import Router from "next/router";

export const cache = createCache({ key: 'css', prepend: true });

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  const Layout = typeof (Component as any).layout !== undefined
    ? (Component as any).layout
    : undefined;

  const redirectUri = typeof window !== "undefined"
    ? window.location.origin
    : 'https://signal.dfnoise.com';

  return (
    <CacheProvider value={cache}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500&display=swap"
          rel="stylesheet"
        ></link>
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
        <title>Signal</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <CssBaseline />
          <Auth0Provider
            redirectUri={redirectUri}
            onRedirectCallback={(appState) => {
              // Use Next.js's Router.replace method to replace the url
              Router.replace(appState?.returnTo || "/");
            }}
            domain="dfnoise.eu.auth0.com"
            clientId="TpdYqotCp3E7VS4HFUnWKIXfRnfPpfeV"
            audience="https://api.signal.dfnoise.com"
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
        </StylesProvider>
      </ThemeProvider>
    </CacheProvider>);
}

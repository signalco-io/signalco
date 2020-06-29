import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import App from "next/app";
import { Auth0Provider } from "@auth0/auth0-react";
import "../styles/global.scss";
import NextNprogress from "nextjs-progressbar";
import Router from "next/router";

const onRedirectCallback = (appState) => {
  // Use Next.js's Router.replace method to replace the url
  Router.replace(appState?.returnTo || "/");
};

function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const Layout = Component.layout;

  return (
    <React.Fragment>
      <Head>
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
            redirectUri={
              typeof window !== "undefined" && window.location.origin
            }
            onRedirectCallback={onRedirectCallback}
            domain="dfnoise.eu.auth0.com"
            clientId="TpdYqotCp3E7VS4HFUnWKIXfRnfPpfeV"
            audience="https://api.signal.dfnoise.com"
          >
            <>
              {Layout ? (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              ) : (
                <Component {...pageProps} />
              )}
              <NextNprogress
                color="#fff"
                startPosition={0.3}
                stopDelayMs={200}
                height="2"
              />
            </>
          </Auth0Provider>
        </StylesProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

// extend App component and return our function so we can use useRouter :P
export default class _App extends App {
  render() {
    return <MyApp {...this.props} />;
  }
}

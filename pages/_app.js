import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import { useRouter } from "next/router";
import App from "next/app";
import { AuthProvider } from "react-use-auth";

function MyApp(props) {
  const { Component, pageProps } = props;
  const router = useRouter();

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
          <AuthProvider
            navigate={router.push}
            auth0_domain="dfnoise.eu.auth0.com"
            auth0_client_id="TpdYqotCp3E7VS4HFUnWKIXfRnfPpfeV"
          >
            {Layout ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </AuthProvider>
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

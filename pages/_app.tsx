import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import theme, { AppTheme } from "../src/theme";
import "../styles/global.scss";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from '../src/createEmotionCache';
import { SnackbarProvider } from 'notistack';
import { ChildrenProps } from "../src/sharedTypes";
import IAppContext from "../src/appContext/IAppContext";
import UserSettingsProvider from "../src/services/UserSettingsProvider";

const isServerSide = typeof window === 'undefined';
const clientSideEmotionCache = createEmotionCache();

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
  err: any;
}

interface PageWithMetadata extends React.FunctionComponent {
  layout: React.FunctionComponent | undefined
};

const appContextDefaultState: IAppContext = {
  theme: 'light',
  setTheme: () => { },
  isDark: false
};

export const AppContext = React.createContext<IAppContext>(appContextDefaultState);

export default function App(props: CustomAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, err } = props;
  const handleThemeChange = (theme: AppTheme) => {
    UserSettingsProvider.set("theme", theme);
    setAppContext({
      ...appContextState,
      theme: theme,
      isDark: theme === 'dark' || theme === 'darkDimmed'
    });
  };

  const [appContextState, setAppContext] = React.useState<IAppContext>({
    ...appContextDefaultState,
    setTheme: handleThemeChange
  });

  React.useEffect(() => {
    // Apply theme to document
    if (!isServerSide) {
      const themeMode = UserSettingsProvider.value<AppTheme>("theme", window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
      document.documentElement.style.setProperty("color-scheme", themeMode);
      if (themeMode !== 'light') {
        handleThemeChange(themeMode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Layout = (Component as PageWithMetadata).layout ?? ((props?: ChildrenProps) => <>{props?.children}</>);

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
      <ThemeProvider theme={theme(appContextState.theme)}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <AppContext.Provider value={appContextState}>
            <Layout>
              <Component {...pageProps} err={err} />
            </Layout>
          </AppContext.Provider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import appTheme from '../src/theme';
import '../styles/global.scss';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { SnackbarProvider } from 'notistack';
import { ChildrenProps } from '../src/sharedTypes';
import IAppContext from '../src/appContext/IAppContext';
import useAppTheme from '../src/hooks/useAppTheme';

const clientSideEmotionCache = createEmotionCache();

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

interface PageWithMetadata extends React.FunctionComponent {
  layout?: React.FunctionComponent | undefined
};

const appContextDefaultState: IAppContext = {
  theme: 'light',
  isDark: false
};

export const AppContext = React.createContext<IAppContext>(appContextDefaultState);

export default function App(props: CustomAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [appContextState, setAppContextState] = React.useState<IAppContext>(appContextDefaultState);
  useAppTheme(appContextState, setAppContextState);

  const Layout = (Component as PageWithMetadata).layout ?? ((props?: ChildrenProps) => <>{props?.children}</>);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
        <title>Signalco</title>
      </Head>
      <ThemeProvider theme={appTheme(appContextState.theme)}>
        <AppContext.Provider value={appContextState}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProvider>
        </AppContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

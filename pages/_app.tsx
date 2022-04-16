import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import appTheme, { AppTheme, AppThemeMode } from '../src/theme';
import '../styles/global.scss';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { SnackbarProvider } from 'notistack';
import { ChildrenProps } from '../src/sharedTypes';
import IAppContext from '../src/appContext/IAppContext';
import UserSettingsProvider from '../src/services/UserSettingsProvider';
import useUserSetting from '../src/hooks/useUserSetting';
import SunHelper from '../src/helpers/SunHelper';
import PageNotificationService from '../src/notifications/PageNotificationService';
import useLocale from '../src/hooks/useLocale';
import { useCallback } from 'react';
import DateTimeProvider from '../src/services/DateTimeProvider';

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
  isDark: false
};

export const AppContext = React.createContext<IAppContext>(appContextDefaultState);

export default function App(props: CustomAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, err } = props;

  const [appContextState, setAppContext] = React.useState<IAppContext>(appContextDefaultState);

  // Theme
  const [themeMode] = useUserSetting<AppThemeMode>('themeMode', 'manual');
  const [themeTimeRange] = useUserSetting<[string, string] | undefined>('themeTimeRange', undefined);
  const themes = useLocale('App', 'Settings', 'Themes');

  const applyThemeMode = useCallback((hideNotification?: boolean) => {
    let themeOrPrefered = UserSettingsProvider.value<AppTheme>('theme', () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const activeTheme = appContextState.theme;

    if (themeMode === 'sunriseSunset' && SunHelper.isDay()) {
      themeOrPrefered = 'light';
    } else if (themeMode === 'timeRange' && themeTimeRange?.length === 2) {
      const now = DateTimeProvider.now();
      const dayTime = DateTimeProvider.fromDuration(now, themeTimeRange[0]);
      const nightTime = DateTimeProvider.fromDuration(now, themeTimeRange[1]);
      if (dayTime && nightTime && now >= dayTime && now < nightTime) {
        themeOrPrefered = 'light';
      }
    }

    if (activeTheme !== themeOrPrefered) {
      document.documentElement.style.setProperty('color-scheme', themeOrPrefered === 'light' ? 'light' : 'dark');
      setAppContext({
        theme: themeOrPrefered,
        isDark: themeOrPrefered === 'dark' || themeOrPrefered === 'darkDimmed'
      });
      if (!hideNotification) {
        PageNotificationService.show(`Switched to ${themes.t(themeOrPrefered)} theme.`);
      }
    }
  }, [appContextState.theme, themeMode, themeTimeRange, themes]);

  React.useEffect(() => {
    // Apply theme to document
    if (isServerSide) {
      return;
    }

    // Apply theme mode
    let themeModeInterval = setInterval(applyThemeMode, 60000);
    applyThemeMode(true);

    // Dispose
    return () => clearInterval(themeModeInterval);
  }, [applyThemeMode]);

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
      <ThemeProvider theme={appTheme(appContextState.theme)}>
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

import { AppTheme, AppThemeMode } from '../theme';
import IAppContext from '../appContext/IAppContext';
import UserSettingsProvider from '../services/UserSettingsProvider';
import useUserSetting from './useUserSetting';
import SunHelper from '../helpers/SunHelper';
import PageNotificationService from '../notifications/PageNotificationService';
import useLocale from './useLocale';
import { useCallback } from 'react';
import DateTimeProvider from '../services/DateTimeProvider';
import useInterval from './useInterval';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

export default function useAppTheme(appContextState: IAppContext, setAppContextState: (state: IAppContext) => void) {
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
      setAppContextState({
        theme: themeOrPrefered,
        isDark: themeOrPrefered === 'dark' || themeOrPrefered === 'darkDimmed'
      });
      if (!hideNotification) {
        PageNotificationService.show(`Switched to ${themes.t(themeOrPrefered)} theme.`);
      }
    }
  }, [appContextState.theme, setAppContextState, themeMode, themeTimeRange, themes]);

  // Apply theme mode every minute (and on first paint)
  useInterval(applyThemeMode, 60000);
  useIsomorphicLayoutEffect(() => applyThemeMode(true));
}

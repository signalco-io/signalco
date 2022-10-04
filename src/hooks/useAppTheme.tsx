import { useCallback } from 'react';
import { useColorScheme } from '@mui/material';
import useUserSetting from './useUserSetting';
import { localizer } from './useLocale';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import useInterval from './useInterval';
import { AppThemeMode } from '../theme';
import DateTimeProvider from '../services/DateTimeProvider';
import PageNotificationService from '../notifications/PageNotificationService';
import SunHelper from '../helpers/SunHelper';

export default function useAppTheme() {
  const { colorScheme: mode, setColorScheme } = useColorScheme();
  const [themeMode] = useUserSetting<AppThemeMode>('themeMode', 'manual');
  const [themeTimeRange] = useUserSetting<[string, string] | undefined>('themeTimeRange', undefined);

  const applyThemeMode = useCallback((hideNotification?: boolean) => {
    let themeOrPrefered = mode;

    if (themeMode === 'sunriseSunset') {
      if (SunHelper.isDay())
        themeOrPrefered = 'light';
      else themeOrPrefered = 'dark';
    } else if (themeMode === 'timeRange' && themeTimeRange?.length === 2) {
      const now = DateTimeProvider.now();
      const dayTime = DateTimeProvider.fromDuration(now, themeTimeRange[0]);
      const nightTime = DateTimeProvider.fromDuration(now, themeTimeRange[1]);
      if (dayTime && nightTime && now >= dayTime && now < nightTime) {
        themeOrPrefered = 'light';
      } else {
        themeOrPrefered = 'dark';
      }
    }

    if (mode !== themeOrPrefered) {
      document.documentElement.style.setProperty('color-scheme', themeOrPrefered === 'light' ? 'light' : 'dark');
      setColorScheme(themeOrPrefered === 'dark' ? 'dark' : 'light');
      if (!hideNotification) {
        const themeName = localizer('App', 'Settings', 'Themes')(themeOrPrefered === 'dark' ? 'dark' : 'light');
        PageNotificationService.show(`Switched to ${themeName} theme.`);
      }
    }
  }, [mode, setColorScheme, themeMode, themeTimeRange]);

  // Apply theme mode every minute (and on first paint)
  useInterval(applyThemeMode, 60000);
  useIsomorphicLayoutEffect(() => applyThemeMode(true));
}

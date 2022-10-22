import { useCallback } from 'react';
import { useColorScheme } from '@mui/joy/styles';
import useUserSetting from './useUserSetting';
import { localizer } from './useLocale';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import useInterval from './useInterval';
import { AppThemeMode } from '../theme';
import DateTimeProvider from '../services/DateTimeProvider';
import PageNotificationService from '../notifications/PageNotificationService';
import SunHelper from '../helpers/SunHelper';

export default function useAppTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeMode] = useUserSetting<AppThemeMode>('themeMode', 'manual');
  const [themeTimeRange] = useUserSetting<[string, string] | undefined>('themeTimeRange', undefined);

  const applyThemeMode = useCallback((hideNotification?: boolean) => {
    let themeOrPrefered = colorScheme;

    // Handle sunrise/sunst
    if (themeMode === 'sunriseSunset') {
      themeOrPrefered = SunHelper.isDay() ? 'light' : 'dark';
    }

    // Handle time range
    if (themeMode === 'timeRange' && themeTimeRange?.length === 2) {
      const now = DateTimeProvider.now();
      const dayTime = DateTimeProvider.fromDuration(now, themeTimeRange[0]);
      const nightTime = DateTimeProvider.fromDuration(now, themeTimeRange[1]);
      if (dayTime && nightTime && now >= dayTime && now < nightTime) {
        themeOrPrefered = 'light';
      } else {
        themeOrPrefered = 'dark';
      }
    }

    // Ignore if not changed
    if (colorScheme === themeOrPrefered)
      return;

    // document.documentElement.style.setProperty('color-scheme', themeOrPrefered === 'light' ? 'light' : 'dark');
    const newColorScheme = themeOrPrefered === 'dark' ? 'dark' : 'light';
    setColorScheme(newColorScheme);

    // Notify user theme was changed (if not first render)
    if (!hideNotification) {
      const themeName = localizer('App', 'Settings', 'Themes')(newColorScheme);
      PageNotificationService.show(`Switched to ${themeName} theme.`);
    }

    console.debug('Color scheme updated', newColorScheme);
  }, [colorScheme, setColorScheme, themeMode, themeTimeRange]);

  // Apply theme mode every minute (and on first paint)
  useInterval(applyThemeMode, 60000);
  useIsomorphicLayoutEffect(() => applyThemeMode(true));
}

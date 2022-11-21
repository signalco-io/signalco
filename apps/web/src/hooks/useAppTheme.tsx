import { useCallback } from 'react';
import { useColorScheme } from '@signalco/ui';
import useUserSetting from './useUserSetting';
import { localizer } from './useLocale';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import useInterval from './useInterval';
import { AppThemeMode } from '../theme';
import { showNotification } from '../notifications/PageNotificationService';
import SunHelper from '../helpers/SunHelper';
import { fromDuration, now } from 'src/services/DateTimeProvider';

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
      const nowTime = now();
      const dayTime = fromDuration(nowTime, themeTimeRange[0]);
      const nightTime = fromDuration(nowTime, themeTimeRange[1]);
      if (dayTime && nightTime && nowTime >= dayTime && nowTime < nightTime) {
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
      showNotification(`Switched to ${themeName} theme.`);
    }

    console.debug('Color scheme updated', newColorScheme);
  }, [colorScheme, setColorScheme, themeMode, themeTimeRange]);

  // Apply theme mode every minute (and on first paint)
  useInterval(applyThemeMode, 60000);
  useIsomorphicLayoutEffect(() => applyThemeMode(true));
}

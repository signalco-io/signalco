import { useCallback } from 'react';
import { showNotification } from '@signalco/ui-notifications';
import type { AppThemeMode, DefaultColorScheme } from '@signalco/ui/theme';
import { useIsomorphicLayoutEffect } from '@signalco/hooks/useIsomorphicLayoutEffect';
import { useInterval } from '@signalco/hooks/useInterval';
import { fromDuration, now } from '../services/DateTimeProvider';
import SunHelper from '../helpers/SunHelper';
import useUserSetting from './useUserSetting';
import { localizer } from './useLocale';

export default function useAppTheme() {
    // const { mode, setMode } = useColorScheme();
    const mode: unknown = 'dark';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    const setMode = (mode: DefaultColorScheme) => {};

    const [themeMode] = useUserSetting<AppThemeMode>('themeMode', 'manual');
    const [themeTimeRange] = useUserSetting<[string, string] | undefined>('themeTimeRange', undefined);

    const applyThemeMode = useCallback((hideNotification?: boolean) => {
        let themeOrPrefered = mode;

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
        if (mode === themeOrPrefered)
            return;

        // document.documentElement.style.setProperty('color-scheme', themeOrPrefered === 'light' ? 'light' : 'dark');
        if (themeOrPrefered) {
            const newColorScheme = themeOrPrefered === 'dark' ? 'dark' : 'light';
            setMode(newColorScheme);

            // Notify user theme was changed (if not first render)
            if (!hideNotification) {
                const themeName = localizer('App', 'Settings', 'Themes')(newColorScheme);
                showNotification(`Switched to ${themeName} theme.`);
            }

            console.debug('Color scheme updated', newColorScheme);
        }
    }, [mode, themeMode, themeTimeRange]);

    // Apply theme mode every minute (and on first paint)
    useInterval(applyThemeMode, 60000);
    useIsomorphicLayoutEffect(() => applyThemeMode(true));
}

import { Suspense, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useColorScheme } from '@mui/joy/styles';
import { TextField, SupportedColorScheme, Typography } from '@mui/joy';
import Picker from 'components/shared/form/Picker';
import { AppThemeMode } from '../../src/theme';
import DateTimeProvider from '../../src/services/DateTimeProvider';
import useUserSetting from '../../src/hooks/useUserSetting';
import useLocale from '../../src/hooks/useLocale';

function AppThemeVisual(props: { label: string, theme: SupportedColorScheme, disabled?: boolean }) {
    const { label, theme, disabled } = props;

    let textColor;
    let backgroundColor;
    switch (theme) {
        case 'dark':
            backgroundColor = 'black';
            textColor = 'white';
            break;
        // case 'darkDimmed':
        //     backgroundColor = 'rgba(32, 31, 30, 1)'
        //     textColor = 'white';
        //     break;
        default:
            backgroundColor = 'white';
            textColor = 'black';
            break;
    }

    return (
        <Stack alignItems="center" spacing={1} sx={{ opacity: disabled ? 0.4 : 1 }}>
            <Box sx={{
                position: 'relative',
                width: 80,
                height: 60,
                backgroundColor: backgroundColor,
                border: '1px solid gray',
                borderTop: '4px solid gray',
                borderRadius: 1
            }}>
                <Box sx={{ position: 'absolute', backgroundColor: textColor, width: 20, height: 5, top: 4, left: 4 }} />
                <Box sx={{ position: 'absolute', backgroundColor: textColor, width: 18, height: 5, top: 12, left: 4 }} />
                <Box sx={{ position: 'absolute', backgroundColor: textColor, width: 22, height: 5, top: 20, left: 4 }} />
                <Box sx={{ position: 'absolute', backgroundColor: textColor, width: 20, height: 5, top: 28, left: 4 }} />
            </Box>
            <Typography level="body2">{label}</Typography>
        </Stack>
    );
}

export default function AppThemePicker() {
    const themes = useLocale('App', 'Settings', 'Themes');
    const themeModes = useLocale('App', 'Settings', 'ThemeModes');
    const picker = useLocale('App', 'Components', 'AppThemePicker');

    const { colorScheme, setColorScheme } = useColorScheme();
    const [themeMode, setThemeMode] = useUserSetting<AppThemeMode>('themeMode', 'manual');

    const handleThemeSelect = (newTheme: SupportedColorScheme) => {
        const newThemeSelect = newTheme ?? 'light';
        setColorScheme(newThemeSelect);
    };

    const [userLocation] = useUserSetting<[number, number] | undefined>('location', undefined);
    const handleThemeModeChange = (_: unknown, newThemeMode: AppThemeMode) => {
        const newThemeModeSelect = newThemeMode ?? 'manual';
        setThemeMode(newThemeModeSelect);
        if (newThemeModeSelect !== 'manual' && colorScheme === 'light') {
            handleThemeSelect('dark');
        }
    };

    const [timeRange, setTimeRange] = useUserSetting<[string, string]>('themeTimeRange', ['PT8H', 'PT20H']);
    const [dayTime, setDayTime] = useState<Date | null | undefined>(timeRange ? DateTimeProvider.fromDuration(DateTimeProvider.now(), timeRange[0]) : DateTimeProvider.todayAt(8));
    const [nightTime, setNightTime] = useState<Date | null | undefined>(timeRange ? DateTimeProvider.fromDuration(DateTimeProvider.now(), timeRange[1]) : DateTimeProvider.todayAt(20));
    const setThemeTimeRangeValues = (start: Date, end: Date) => {
        setTimeRange([DateTimeProvider.toDuration(start), DateTimeProvider.toDuration(end)]);
    };
    const handleDayTimeChange = (date: Date | null | undefined) => {
        setDayTime(date);
        if (date && nightTime) {
            setThemeTimeRangeValues(date, nightTime);
        }
    }
    const handleNightTimeChange = (date: Date | null | undefined) => {
        setNightTime(date);
        if (date && dayTime) {
            setThemeTimeRangeValues(dayTime, date);
        }
    }

    return (
        <Suspense>
            <Stack spacing={2}>
                <Picker value={themeMode} onChange={handleThemeModeChange} options={[
                    { value: 'manual', label: themeModes.t('Manual') },
                    { value: 'sunriseSunset', label: themeModes.t('SunriseSunset'), disabled: (userLocation?.length ?? 0) <= 0 },
                    { value: 'timeRange', label: themeModes.t('TimeRange') },
                ]} />
                {themeMode === 'timeRange' && (
                    <Stack spacing={1}>
                        <Typography level="body2">{picker.t('PickDayNightTimes')}</Typography>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                label={picker.t('DayTime')}
                                value={dayTime ? DateTimeProvider.toDuration(dayTime) : ''}
                                onChange={(e) => handleDayTimeChange(DateTimeProvider.fromDuration(DateTimeProvider.now(), e.target.value))}
                            />
                            <TextField
                                label={picker.t('NightTime')}
                                value={nightTime ? DateTimeProvider.toDuration(nightTime) : ''}
                                onChange={(e) => handleNightTimeChange(DateTimeProvider.fromDuration(DateTimeProvider.now(), e.target.value))}
                            />
                        </Stack>
                    </Stack>
                )}
                <Stack spacing={1}>
                    {themeMode !== 'manual' && <Typography level="body2">{picker.t('PickNightTheme')}</Typography>}
                    <Picker value={colorScheme} onChange={(_, value) => handleThemeSelect(value)} options={[
                        { value: 'light', label: <AppThemeVisual disabled={themeMode !== 'manual'} label={themes.t('Light')} theme="light" /> },
                        { value: 'dark', label: <AppThemeVisual label={themes.t('Dark')} theme="dark" /> }
                    ]} />
                </Stack>
            </Stack>
        </Suspense>
    );
}

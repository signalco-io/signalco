import { Suspense, useState } from 'react';
import { Custom, Laptop, SunMoon, Timer } from '@signalco/ui-icons';
import { type AppThemeMode, Stack, Row, TextField, SupportedColorScheme, Typography, Box, useColorScheme, DefaultColorScheme, Picker } from '@signalco/ui';
import { fromDuration, now, todayAt, toDuration } from '../../src/services/DateTimeProvider';
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
        <Box sx={{ opacity: disabled ? 0.4 : 1 }}>
            <Stack alignItems="center" spacing={1}>
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
        </Box>
    );
}

function AppThemeColorPicker() {
    const themes = useLocale('App', 'Settings', 'Themes');
    const [themeMode] = useUserSetting<AppThemeMode>('themeMode', 'system');
    const { colorScheme, setMode } = useColorScheme();

    const handleThemeSelect = (newTheme: DefaultColorScheme | undefined) => {
        const newThemeSelect = newTheme ?? 'light';
        setMode(newThemeSelect);
    };

    console.log('color scheme', colorScheme)

    return (
        <Picker value={colorScheme} onChange={(_, value) => handleThemeSelect(value)} options={[
            {
                value: 'light',
                label: (
                    <Box p={1}>
                        <AppThemeVisual disabled={themeMode !== 'manual'} label={themes.t('Light')} theme="light" />
                    </Box>
                )
            },
            {
                value: 'dark',
                label: (
                    <Box p={1}>
                        <AppThemeVisual label={themes.t('Dark')} theme="dark" />
                    </Box>
                )
            }
        ]} />
    );
}

export default function AppThemePicker() {
    const { t: tPicker } = useLocale('App', 'Components', 'AppThemePicker');
    const { t: tPickerModes } = useLocale('App', 'Components', 'AppThemePicker', 'Modes');

    const { mode, setMode } = useColorScheme();
    const [themeMode, setThemeMode] = useUserSetting<AppThemeMode>('themeMode', 'system');

    const [userLocation] = useUserSetting<[number, number] | undefined>('location', undefined);
    const handleThemeModeChange = (_: unknown, newThemeMode: AppThemeMode | undefined) => {
        const newThemeModeSelect = newThemeMode ?? 'manual';
        setThemeMode(newThemeModeSelect);
        if (newThemeModeSelect === 'system') {
            setMode('system');
        } else {
            // Handle switched to manual
            if (newThemeModeSelect === 'manual') {
                setMode('dark');
            }

            // Handle switched to sunset/range and currently in light mode (switch to dark)
            if (newThemeModeSelect !== 'manual' && mode === 'light') {
                setMode('dark');
            }
        }
    };

    const [timeRange, setTimeRange] = useUserSetting<[string, string]>('themeTimeRange', ['PT8H', 'PT20H']);
    const [dayTime, setDayTime] = useState<Date | null | undefined>(timeRange ? fromDuration(now(), timeRange[0]) : todayAt(8));
    const [nightTime, setNightTime] = useState<Date | null | undefined>(timeRange ? fromDuration(now(), timeRange[1]) : todayAt(20));
    const setThemeTimeRangeValues = (start: Date, end: Date) => {
        setTimeRange([toDuration(start), toDuration(end)]);
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
                <Stack spacing={1}>
                    <Typography level="body2">{tPicker('PickMode')}</Typography>
                    <Picker value={themeMode} onChange={handleThemeModeChange} options={[
                        { value: 'system', label: <Laptop />, title: tPickerModes('System') },
                        { value: 'manual', label: <Custom />, title: tPickerModes('Manual') },
                        { value: 'sunriseSunset', label: <SunMoon />, disabled: (userLocation?.length ?? 0) <= 0, title: tPickerModes('SunriseSunset') },
                        { value: 'timeRange', label: <Timer />, title: tPickerModes('TimeRange') },
                    ]} />
                </Stack>
                {themeMode === 'timeRange' && (
                    <Stack spacing={1}>
                        <Typography level="body2">{tPicker('PickDayNightTimes')}</Typography>
                        <Row spacing={1}>
                            <TextField
                                label={tPicker('DayTime')}
                                value={dayTime ? toDuration(dayTime) : ''}
                                onChange={(e) => handleDayTimeChange(fromDuration(now(), e.target.value))}
                            />
                            <TextField
                                label={tPicker('NightTime')}
                                value={nightTime ? toDuration(nightTime) : ''}
                                onChange={(e) => handleNightTimeChange(fromDuration(now(), e.target.value))}
                            />
                        </Row>
                    </Stack>
                )}
                {themeMode !== 'system' && (
                    <Stack spacing={1}>
                        {themeMode !== 'manual' && <Typography level="body2">{tPicker('PickNightTheme')}</Typography>}
                        <AppThemeColorPicker />
                    </Stack>
                )}
            </Stack>
        </Suspense>
    );
}

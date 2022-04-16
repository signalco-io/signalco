import { TimePicker } from '@mui/lab';
import { Stack, Box, Typography, NoSsr, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material';
import useLocale from '../../src/hooks/useLocale';
import useUserSetting from '../../src/hooks/useUserSetting';
import DateTimeProvider from '../../src/services/DateTimeProvider';
import { AppTheme, AppThemeMode } from '../../src/theme';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';

const AppThemeVisual = (props: { label: string, theme: AppTheme, disabled?: boolean }) => {
    const { label, theme, disabled } = props;

    let textColor;
    let backgroundColor;
    switch (theme) {
        case 'dark':
            backgroundColor = 'black';
            textColor = 'white';
            break;
        case 'darkDimmed':
            backgroundColor = 'rgba(32, 31, 30, 1)'
            textColor = 'white';
            break;
        default:
            backgroundColor = 'white';
            textColor = 'black';
            break;
    }

    return (
        <Stack alignItems="center" sx={{ opacity: disabled ? 0.4 : 1 }}>
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
            <Typography sx={{ pt: 1, color: 'text.primary' }} variant="body2">{label}</Typography>
        </Stack>
    );
};

export default function AppThemePicker() {
    const themes = useLocale('App', 'Settings', 'Themes');
    const themeModes = useLocale('App', 'Settings', 'ThemeModes');
    const [userTimeFormat] = useUserSetting<string>('timeFormat', '1');

    const [activeTheme, setSelectedTheme] = useUserSetting<AppTheme>('theme', 'light');
    const [themeMode, setThemeMode] = useUserSetting<AppThemeMode>('themeMode', 'manual');

    const handleThemeSelect = (newTheme: AppTheme) => {
        const newThemeSelect = newTheme ?? 'light';
        setSelectedTheme(newThemeSelect);
    };

    const [userLocation] = useUserSetting<[number, number] | undefined>('location', undefined);
    const handleThemeModeChange = (_e: React.SyntheticEvent, newThemeMode: AppThemeMode) => {
        const newThemeModeSelect = newThemeMode ?? 'manual';
        setThemeMode(newThemeModeSelect);
        if (newThemeModeSelect !== 'manual' && activeTheme === 'light') {
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
        <NoSsr>
            <Stack spacing={2}>
                <ToggleButtonGroup exclusive color="primary" value={themeMode} onChange={handleThemeModeChange}>
                    <ToggleButton value="manual">{themeModes.t('Manual')}</ToggleButton>
                    <ToggleButton disabled={(userLocation?.length ?? 0) <= 0} value="sunriseSunset">{themeModes.t('SunriseSunset')}</ToggleButton>
                    <ToggleButton value="timeRange">{themeModes.t('TimeRange')}</ToggleButton>
                </ToggleButtonGroup>
                {themeMode === 'timeRange' && (
                    <Stack spacing={1}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Pick day and night times</Typography>
                        <Stack direction="row" spacing={1}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker label="Day time" onChange={handleDayTimeChange} value={dayTime}
                                    ampm={userTimeFormat === '0'}
                                    ampmInClock={userTimeFormat === '0'}
                                    renderInput={(params) => <TextField variant="filled" {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker label="Night time" onChange={handleNightTimeChange} value={nightTime}
                                    ampm={userTimeFormat === '0'}
                                    ampmInClock={userTimeFormat === '0'}
                                    renderInput={(params) => <TextField variant="filled" {...params} />}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>
                )}
                <Stack spacing={1}>
                    {themeMode !== 'manual' && <Typography variant="body2" sx={{ color: 'text.secondary' }}>Pick night theme</Typography>}
                    <ToggleButtonGroup exclusive color="primary" value={activeTheme} onChange={(_e, value) => handleThemeSelect(value)}>
                        {themeMode === 'manual' && <ToggleButton value="light"><AppThemeVisual disabled={themeMode !== 'manual'} label={themes.t('Light')} theme="light" /></ToggleButton>}
                        <ToggleButton value="darkDimmed"><AppThemeVisual label={themes.t('DarkDimmed')} theme="darkDimmed" /></ToggleButton>
                        <ToggleButton value="dark"><AppThemeVisual label={themes.t('Dark')} theme="dark" /></ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Stack>
        </NoSsr>
    );
}

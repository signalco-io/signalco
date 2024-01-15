import { Suspense, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { cx } from '@signalco/ui-primitives/cx';
import { Custom, Laptop, SunMoon, Timer } from '@signalco/ui-icons';
import type { AppThemeMode, DefaultColorScheme, SupportedColorScheme } from '@signalco/ui/theme';
import { fromDuration, now, todayAt, toDuration } from '../../../src/services/DateTimeProvider';
import useUserSetting from '../../../src/hooks/useUserSetting';
import useLocale from '../../../src/hooks/useLocale';

function AppThemeVisual({ label, theme, disabled, size }: { label: string, theme: SupportedColorScheme, disabled?: boolean, size: number }) {
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

    const scale = size / 80;

    return (
        <div className={cx(disabled && 'opacity-40')}>
            <Row spacing={1}>
                <div style={{ width: 80 * scale, height: 60 * scale }}>
                    <div className="relative h-[60px] w-20 origin-top-left overflow-hidden rounded-md"
                        style={{
                            backgroundColor: backgroundColor,
                            border: '1px solid gray',
                            borderTop: '4px solid gray',
                            transform: `scale(${scale})`
                        }}>
                        <div className="absolute" style={{ backgroundColor: textColor, width: 20, height: 5, top: 4, left: 4 }} />
                        <div className="absolute" style={{ backgroundColor: textColor, width: 18, height: 5, top: 12, left: 4 }} />
                        <div className="absolute" style={{ backgroundColor: textColor, width: 22, height: 5, top: 20, left: 4 }} />
                        <div className="absolute" style={{ backgroundColor: textColor, width: 20, height: 5, top: 28, left: 4 }} />
                    </div>
                </div>
                <Typography level="body2">{label}</Typography>
            </Row>
        </div>
    );
}

function AppThemeColorPicker() {
    const themes = useLocale('App', 'Settings', 'Themes');
    const [themeMode] = useUserSetting<AppThemeMode>('themeMode', 'system');
    // const { colorScheme, setMode } = useColorScheme();
    const colorScheme: DefaultColorScheme = 'dark';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    const setMode = (mode: DefaultColorScheme) => { };

    const handleThemeSelect = (newTheme: DefaultColorScheme | undefined) => {
        const newThemeSelect = newTheme ?? 'light';
        setMode(newThemeSelect);
    };

    console.log('color scheme', colorScheme)

    return (
        <SelectItems
            value={colorScheme}
            onValueChange={(value) => handleThemeSelect(value as DefaultColorScheme)}
            items={[
                {
                    value: 'light',
                    label: (
                        <div className="p-1">
                            <AppThemeVisual
                                size={28}
                                disabled={themeMode !== 'manual'}
                                label={themes.t('Light')}
                                theme="light" />
                        </div>
                    )
                },
                {
                    value: 'dark',
                    label: (
                        <div className="p-1">
                            <AppThemeVisual
                                size={28}
                                label={themes.t('Dark')}
                                theme="dark" />
                        </div>
                    )
                }
            ]} />
    );
}

export default function AppThemePicker() {
    const { t: tPicker } = useLocale('App', 'Components', 'AppThemePicker');
    const { t: tPickerModes } = useLocale('App', 'Components', 'AppThemePicker', 'Modes');

    // const { mode, setMode } = useColorScheme();
    const mode: unknown = 'dark';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    const setMode = (mode: DefaultColorScheme | 'system') => { };
    const [themeMode, setThemeMode] = useUserSetting<AppThemeMode>('themeMode', 'system');

    const [userLocation] = useUserSetting<[number, number] | undefined>('location', undefined);
    const handleThemeModeChange = (newThemeMode: AppThemeMode | undefined) => {
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
                    <SelectItems value={themeMode}
                        onValueChange={value => handleThemeModeChange(value as AppThemeMode)}
                        items={[
                            { value: 'system', icon: <Laptop />, label: tPickerModes('System') },
                            { value: 'manual', icon: <Custom />, label: tPickerModes('Manual') },
                            { value: 'sunriseSunset', icon: <SunMoon />, disabled: (userLocation?.length ?? 0) <= 0, label: tPickerModes('SunriseSunset') },
                            { value: 'timeRange', icon: <Timer />, label: tPickerModes('TimeRange') },
                        ]} />
                </Stack>
                {themeMode === 'timeRange' && (
                    <Stack spacing={1}>
                        <Typography level="body2">{tPicker('PickDayNightTimes')}</Typography>
                        <Row spacing={1}>
                            <Input
                                label={tPicker('DayTime')}
                                value={dayTime ? toDuration(dayTime) : ''}
                                onChange={(e) => handleDayTimeChange(fromDuration(now(), e.target.value))}
                            />
                            <Input
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

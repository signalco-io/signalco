import { Stack, Box, Typography, NoSsr, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../pages/_app";
import useLocale from "../../src/hooks/useLocale";
import useUserSetting from "../../src/hooks/useUserSetting";
import { AppTheme } from "../../src/theme";

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
    const themes = useLocale("App", "Settings", "Themes");
    const themeModes = useLocale("App", "Settings", "ThemeModes");

    const appContext = useContext(AppContext);
    const activeTheme = appContext.theme;
    const handleThemeSelect = (theme: AppTheme) => {
        appContext.setTheme(theme);
    };

    const [userLocation] = useUserSetting<[number, number] | undefined>('location', undefined);
    const [themeMode, setThemeMode] = useUserSetting<string>('themeMode', 'manual');
    const handleThemeModeChange = (_e: React.SyntheticEvent, newThemModel: string) => {
        setThemeMode(newThemModel);
    };

    return (
        <NoSsr>
            <Stack spacing={2}>
                <ToggleButtonGroup exclusive color="primary" value={themeMode} onChange={handleThemeModeChange}>
                    <ToggleButton value="manual">{themeModes.t('Manual')}</ToggleButton>
                    <ToggleButton disabled={(userLocation?.length ?? 0) <= 0} value="sunriseSunset">{themeModes.t('SunriseSunset')}</ToggleButton>
                    <ToggleButton disabled value="timeRange">{themeModes.t('TimeRange')}</ToggleButton>
                    <ToggleButton disabled value="sensor">{themeModes.t('LightSensor')}</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup exclusive color="primary" value={activeTheme} onChange={(_e, value) => handleThemeSelect(value)}>
                    <ToggleButton value="light" disabled={themeMode !== 'manual'}><AppThemeVisual disabled={themeMode !== 'manual'} label={themes.t("Light")} theme="light" /></ToggleButton>
                    <ToggleButton value="darkDimmed"><AppThemeVisual label={themes.t("DarkDimmed")} theme="darkDimmed" /></ToggleButton>
                    <ToggleButton value="dark"><AppThemeVisual label={themes.t("Dark")} theme="dark" /></ToggleButton>
                </ToggleButtonGroup>
            </Stack>
        </NoSsr>
    );
}

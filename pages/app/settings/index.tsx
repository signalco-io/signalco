import { FormBuilder, FormBuilderProvider, useFormField } from '@enterwell/react-form-builder';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import React, { ReactNode, useContext } from 'react';
import { AppLayoutWithAuth } from "../../../components/layouts/AppLayoutWithAuth";
import useLocale, { availableLocales } from '../../../src/hooks/useLocale';
import useUserSetting from '../../../src/hooks/useUserSetting';
import { AppContext } from '../../_app';
import { isNonEmptyString } from '@enterwell/react-form-validation';
import generalFormComponents from '../../../components/forms/generalFormComponents';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types';

const AppThemeVisual = (props: { label: string, theme: string, selected?: boolean | undefined, onSelected: (theme: string) => void }) => {
    const { label, theme, selected, onSelected } = props;
    const backgroundColor = theme === 'dark' ? 'black' : 'white';
    const textColor = theme === 'dark' ? 'white' : 'black';

    return (
        <Button sx={{ bgcolor: selected ? 'action.selected' : undefined }} onClick={() => onSelected(theme)}>
            <Stack alignItems="center">
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
                <Typography variant="body2">{label}</Typography>
            </Stack>
        </Button>
    );
};

const SettingsItem = (props: { children: ReactNode, label?: string | undefined }) => (
    <Stack spacing={1}>
        {props.label && <Typography>{props.label}</Typography>}
        {props.children}
    </Stack>
);

const SettingsSection = (props: { children: ReactNode, header: string }) => (
    <Stack spacing={2}>
        <Typography variant="h2" sx={{ pt: { xs: 0, sm: 2 } }}>{props.header}</Typography>
        <Stack spacing={2}>
            {props.children}
        </Stack>
    </Stack>
);

const SettingsIndex = () => {
    const appContext = useContext(AppContext);
    const { t } = useLocale("App", "Settings");
    const themes = useLocale("App", "Settings", "Themes");
    const locales = useLocale("App", "Locales");
    const isDarkMode = appContext.theme === 'dark';
    const [userLocale, setUserLocale] = useUserSetting<string>("locale", "en");

    const handleDarkModeChange = (theme: string) => {
        const newIsDarkMode = theme === 'dark';
        if (appContext.setTheme) {
            appContext.setTheme(newIsDarkMode ? "dark" : 'light');
        }
    };

    const handleLocaleChange = (event: SelectChangeEvent) => {
        setUserLocale(event.target.value);
        window.location.reload();
    };

    const userSettingsForm = {
        nickname: useFormField('', isNonEmptyString, 'string', t("Nickname"))
    };

    const settingsFormComponents: FormBuilderComponents = {
        fieldWrapper: (props) => <SettingsItem {...props} />
    };

    return (
        <FormBuilderProvider components={{ ...generalFormComponents, ...settingsFormComponents }}>
            <Container sx={{ p: 2 }}>
                <Stack spacing={4}>
                    <SettingsSection header={t("General")}>
                        <SettingsItem label={t("Language")}>
                            <FormControl variant="filled" sx={{ maxWidth: 320 }}>
                                <InputLabel id="app-settings-locale-select-label">{t("SelectLanguage")}</InputLabel>
                                <Select variant="filled" labelId="app-settings-locale-select-label" value={userLocale} onChange={handleLocaleChange}>
                                    {availableLocales.map(l => (
                                        <MenuItem key={l} value={l} selected={userLocale === l}>{locales.t(l)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </SettingsItem>
                    </SettingsSection>
                    <SettingsSection header={t("LookAndFeel")}>
                        <SettingsItem label={t("Theme")}>
                            <Stack spacing={1} direction="row">
                                <AppThemeVisual label={themes.t("Dark")} theme="dark" selected={isDarkMode} onSelected={handleDarkModeChange} />
                                <AppThemeVisual label={themes.t("Light")} theme="light" selected={!isDarkMode} onSelected={handleDarkModeChange} />
                            </Stack>
                        </SettingsItem>
                    </SettingsSection>
                    <SettingsSection header={t("Profile")}>
                        <FormBuilder form={userSettingsForm} />
                    </SettingsSection>
                </Stack>
            </Container>
        </FormBuilderProvider>
    );
};

SettingsIndex.layout = AppLayoutWithAuth;

export default SettingsIndex;
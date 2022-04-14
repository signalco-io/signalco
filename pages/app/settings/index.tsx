import { FormBuilder, FormBuilderProvider, useFormField } from '@enterwell/react-form-builder';
import { Box, Button, Chip, Container, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import React, { ReactNode, useContext, useMemo } from 'react';
import { AppLayoutWithAuth } from "../../../components/layouts/AppLayoutWithAuth";
import useLocale, { availableLocales } from '../../../src/hooks/useLocale';
import useUserSetting from '../../../src/hooks/useUserSetting';
import { AppContext } from '../../_app';
import { isNonEmptyString, isNotNull } from '@enterwell/react-form-validation';
import generalFormComponents from '../../../components/forms/generalFormComponents';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types';
import appSettingsProvider, { ApiDevelopmentUrl, ApiProductionUrl } from '../../../src/services/AppSettingsProvider';
import { useEffect } from 'react';
import { AppTheme } from '../../../src/theme';
import CurrentUserProvider from '../../../src/services/CurrentUserProvider';
import { getTimeZones } from '@vvo/tzdb';
import LocationMapPicker from '../../../components/forms/LocationMapPicker/LocationMapPicker';
import { isTrue } from '@enterwell/react-form-validation';

const AppThemeVisual = (props: { label: string, theme: AppTheme, selected?: boolean | undefined, onSelected: (theme: AppTheme) => void }) => {
    const { label, theme, selected, onSelected } = props;

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

const settingsFormComponents: FormBuilderComponents = {
    fieldWrapper: (props) => <SettingsItem {...props} />,
    selectApiEndpoint: ({ onChange, label, helperText, error, ...rest }) => (
        <FormControl variant="filled" error={error}>
            <InputLabel>{label}</InputLabel>
            <Select onChange={(e) => onChange && onChange(e.target.value)} {...rest}>
                <MenuItem value={ApiProductionUrl}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip color="info" label="prod" size="small" />
                        <Typography>{ApiProductionUrl}</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem value={ApiDevelopmentUrl}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip color="warning" label="dev" size="small" />
                        <Typography>{ApiDevelopmentUrl}</Typography>
                    </Stack>
                </MenuItem>
            </Select>
            <FormHelperText error={error}>{helperText}</FormHelperText>
        </FormControl>
    ),
    selectTimeFormat: ({ onChange, label, helperText, error, ...rest }) => (
        // <EwSelect variant="filled" label="Time format" fullWidth options={[{ value: 0, label: '12h' }, { value: 1, label: '24h' }]} />
        <FormControl variant="filled" error={error}>
            <InputLabel>{label}</InputLabel>
            <Select onChange={(e) => onChange && onChange(e.target.value)} {...rest}>
                <MenuItem value={'0'}>12-hour</MenuItem>
                <MenuItem value={'1'}>24-hour</MenuItem>
            </Select>
            <FormHelperText error={error}>{helperText}</FormHelperText>
        </FormControl>
    ),
    selectTimeZone: ({ onChange, label, helperText, error, ...rest }) => {
        const timeZones = getTimeZones();
        return (
            <FormControl variant="filled" error={error}>
                <InputLabel>{label}</InputLabel>
                <Select onChange={(e) => onChange && onChange(e.target.value)} {...rest}>
                    <MenuItem value={'0'} disabled>+00:00 UTC</MenuItem>
                    {timeZones.map(tz => (
                        <MenuItem key={tz.name} value={tz.name}>{tz.currentTimeFormat}</MenuItem>
                    ))}
                </Select>
                <FormHelperText error={error}>{helperText}</FormHelperText>
            </FormControl>
        );
    },
    locationMap: (props) => <LocationMapPicker {...props} />
};

const components = { ...generalFormComponents, ...settingsFormComponents };

const SettingsIndex = () => {
    const appContext = useContext(AppContext);
    const { t } = useLocale("App", "Settings");
    const themes = useLocale("App", "Settings", "Themes");
    const locales = useLocale("App", "Locales");
    const [userLocale, setUserLocale] = useUserSetting<string>("locale", "en");
    const [userNickName, setUserNickName] = useUserSetting<string>('nickname', CurrentUserProvider.getCurrentUser()?.name ?? '');
    const [userTimeFormat, setUserTimeFormat] = useUserSetting<string>('timeFormat', '1');
    const [userTimeZone, setUserTimeZone] = useUserSetting<string>('timeZone', '0');
    const [userLocation, setUserLocation] = useUserSetting<[number, number] | undefined>('location', undefined);

    const handleDarkModeChange = (theme: AppTheme) => {
        appContext.setTheme(theme);
    };

    const handleLocaleChange = (event: SelectChangeEvent) => {
        setUserLocale(event.target.value);
        window.location.reload();
    };

    const userSettingsForm = {
        nickname: useFormField(userNickName, isNonEmptyString, 'string', t("Nickname")),
        timeFromat: useFormField(userTimeFormat, isNotNull, 'selectTimeFormat', "Time format", { receiveEvent: false }),
        timeZone: useFormField(userTimeZone, isNotNull, 'selectTimeZone', "Time zone", { receiveEvent: false }),
        location: useFormField(userLocation, isTrue, 'locationMap', "Location", { receiveEvent: false })
    };

    const developerSettingsForm = {
        apiEndpoint: useFormField(appSettingsProvider.apiAddress, isNonEmptyString, 'selectApiEndpoint', t("ApiEndpoint"), { receiveEvent: false })
    };

    useEffect(() => {
        if (!developerSettingsForm.apiEndpoint.error &&
            developerSettingsForm.apiEndpoint.value !== appSettingsProvider.apiAddress) {
            appSettingsProvider.setApiEndpoint(developerSettingsForm.apiEndpoint.value);
            window.location.reload();
        }
    }, [developerSettingsForm.apiEndpoint]);

    useEffect(() => {
        if (!userSettingsForm.nickname.error) {
            setUserNickName(userSettingsForm.nickname.value?.trim() || undefined);
        }
    }, [setUserNickName, userSettingsForm.nickname]);

    useEffect(() => {
        if (!userSettingsForm.timeFromat.error) {
            setUserTimeFormat(userSettingsForm.timeFromat.value?.trim() || undefined);
        }
    }, [setUserTimeFormat, userSettingsForm.timeFromat]);

    useEffect(() => {
        if (!userSettingsForm.timeZone.error) {
            setUserTimeZone(userSettingsForm.timeZone.value?.trim() || undefined);
        }
    }, [setUserTimeZone, userSettingsForm.timeZone]);

    useEffect(() => {
        console.log('location updated', userSettingsForm.location)
        if (!userSettingsForm.location.error) {
            setUserLocation(userSettingsForm.location.value);
        }
    }, [setUserLocation, userSettingsForm.location]);

    return (
        <FormBuilderProvider components={components}>
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
                                <AppThemeVisual label={themes.t("Dark")} theme="dark" selected={appContext.theme === 'dark'} onSelected={handleDarkModeChange} />
                                <AppThemeVisual label={themes.t("DarkDimmed")} theme="darkDimmed" selected={appContext.theme === 'darkDimmed'} onSelected={handleDarkModeChange} />
                                <AppThemeVisual label={themes.t("Light")} theme="light" selected={appContext.theme === 'light'} onSelected={handleDarkModeChange} />
                            </Stack>
                        </SettingsItem>
                    </SettingsSection>
                    <SettingsSection header={t("Profile")}>
                        <FormBuilder form={userSettingsForm} />
                    </SettingsSection>
                    <SettingsSection header={t("Developer")}>
                        <FormBuilder form={developerSettingsForm} />
                    </SettingsSection>
                </Stack>
            </Container>
        </FormBuilderProvider>
    );
};

SettingsIndex.layout = AppLayoutWithAuth;

export default SettingsIndex;

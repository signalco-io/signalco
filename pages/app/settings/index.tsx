import { FormBuilder, FormBuilderProvider, useFormField } from '@enterwell/react-form-builder';
import { Chip, Container, FormControl, FormHelperText, InputLabel, MenuItem, NoSsr, Paper, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { AppLayoutWithAuth } from "../../../components/layouts/AppLayoutWithAuth";
import useLocale, { availableLocales } from '../../../src/hooks/useLocale';
import useUserSetting from '../../../src/hooks/useUserSetting';
import { isNonEmptyString, isNotNull } from '@enterwell/react-form-validation';
import generalFormComponents from '../../../components/forms/generalFormComponents';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types';
import appSettingsProvider, { ApiDevelopmentUrl, ApiProductionUrl } from '../../../src/services/AppSettingsProvider';
import { useEffect } from 'react';
import CurrentUserProvider from '../../../src/services/CurrentUserProvider';
import { getTimeZones } from '@vvo/tzdb';
import LocationMapPicker from '../../../components/forms/LocationMapPicker/LocationMapPicker';
import { isTrue } from '@enterwell/react-form-validation';
import GoogleIcon from '@mui/icons-material/Google';
import AppThemePicker from '../../../components/settings/AppThemePicker';
import PageNotificationService from '../../../src/notifications/PageNotificationService';

function ConnectedService() {
    return (
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.default' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <GoogleIcon fontSize="large" />
                    <Stack>
                        <Typography>Google</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{CurrentUserProvider.getCurrentUser()?.name} ({CurrentUserProvider.getCurrentUser()?.email})</Typography>
                    </Stack>
                </Stack>
                <Typography sx={{ color: 'text.secondary' }}>Connected</Typography>
            </Stack>
        </Paper>
    )
}

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
    const { t } = useLocale("App", "Settings");
    const locales = useLocale("App", "Locales");
    const [userLocale, setUserLocale] = useUserSetting<string>("locale", "en");
    const [userNickName, setUserNickName] = useUserSetting<string>('nickname', CurrentUserProvider.getCurrentUser()?.name ?? '');
    const [userTimeFormat, setUserTimeFormat] = useUserSetting<string>('timeFormat', '1');
    const [userTimeZone, setUserTimeZone] = useUserSetting<string>('timeZone', '0');
    const [userLocation, setUserLocation] = useUserSetting<[number, number] | undefined>('location', undefined);

    const handleLocaleChange = (event: SelectChangeEvent) => {
        setUserLocale(event.target.value);
        window.location.reload();
    };

    const profileForm = {
        nickname: useFormField(userNickName, isNonEmptyString, 'string', t("Nickname")),
    }

    const timeLocationForm = {
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
        if (!profileForm.nickname.error) {
            setUserNickName(profileForm.nickname.value?.trim() || undefined);
        }
    }, [setUserNickName, profileForm.nickname]);

    useEffect(() => {
        if (!timeLocationForm.timeFromat.error) {
            setUserTimeFormat(timeLocationForm.timeFromat.value?.trim() || undefined);
        }
    }, [setUserTimeFormat, timeLocationForm.timeFromat]);

    useEffect(() => {
        if (!timeLocationForm.timeZone.error) {
            setUserTimeZone(timeLocationForm.timeZone.value?.trim() || undefined);
        }
    }, [setUserTimeZone, timeLocationForm.timeZone]);

    useEffect(() => {
        if (!timeLocationForm.location.error) {
            setUserLocation(timeLocationForm.location.value);
        }
    }, [setUserLocation, timeLocationForm.location]);

    const handleLightSensorCheck = () => {
        if ('AmbientLightSensor' in window) {
            PageNotificationService.show('light sensor available');
            const sensor = new (window as unknown as any).AmbientLightSensor();
            sensor.addEventListener('reading', (_event: any) => {
                console.log('Current light level:', sensor.illuminance);
                PageNotificationService.show('light level: ' + sensor.illuminance);
            });
            sensor.addEventListener('error', (event: { error: { name: string, message: string } }) => {
                console.log(event.error.name, event.error.message);
                PageNotificationService.show('light error: ' + event.error.name + " - " + event.error.message);
            });
            sensor.start();
        } else {
            PageNotificationService.show('light sensor unavailable', 'error');
        }
    }

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
                            <AppThemePicker />
                        </SettingsItem>
                    </SettingsSection>
                    <SettingsSection header={t("Profile")}>
                        <NoSsr>
                            <FormBuilder form={profileForm} />
                            <ConnectedService />
                        </NoSsr>
                    </SettingsSection>
                    <SettingsSection header={t("LocationAndTime")}>
                        <NoSsr>
                            <FormBuilder form={timeLocationForm} />
                        </NoSsr>
                    </SettingsSection>
                    <SettingsSection header={t("Developer")}>
                        <NoSsr>
                            <FormBuilder form={developerSettingsForm} />
                        </NoSsr>
                        <Button onClick={handleLightSensorCheck}>Check light sensor</Button>
                    </SettingsSection>
                </Stack>
            </Container>
        </FormBuilderProvider>
    );
};

SettingsIndex.layout = AppLayoutWithAuth;

export default SettingsIndex;

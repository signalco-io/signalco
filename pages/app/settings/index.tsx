import React, { ReactNode , useEffect } from 'react';
import { getTimeZones } from '@vvo/tzdb';
import { Container, FormControl, FormHelperText, InputLabel, MenuItem, NoSsr, Paper, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { isNonEmptyString, isNotNull , isTrue } from '@enterwell/react-form-validation';
import { FormBuilderComponent, FormBuilderComponents } from '@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types';
import { FormBuilder, FormBuilderProvider, useFormField } from '@enterwell/react-form-builder';
import { ChildrenProps } from '../../../src/sharedTypes';
import CurrentUserProvider from '../../../src/services/CurrentUserProvider';
import appSettingsProvider, { ApiDevelopmentUrl, ApiProductionUrl } from '../../../src/services/AppSettingsProvider';
import useUserSetting from '../../../src/hooks/useUserSetting';
import useLocale, { availableLocales } from '../../../src/hooks/useLocale';
import AppThemePicker from '../../../components/settings/AppThemePicker';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import LocationMapPicker from '../../../components/forms/LocationMapPicker/LocationMapPicker';
import generalFormComponents from '../../../components/forms/generalFormComponents';
import ApiBadge from '../../../components/development/ApiBadge';

function ConnectedService() {
    const { t } = useLocale('App', 'Settings');

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
                <Typography sx={{ color: 'text.secondary' }}>{t('Connected')}</Typography>
            </Stack>
        </Paper>
    )
}

function SettingsItem(props: { children: ReactNode, label?: string | undefined }) {
  return <Stack spacing={1}>
        {props.label && <Typography>{props.label}</Typography>}
        {props.children}
    </Stack>
}

function SettingsSection(props: { children: ReactNode, header: string }) {
  return <Stack spacing={2}>
        <Typography variant="h2" sx={{ pt: { xs: 0, sm: 2 } }}>{props.header}</Typography>
        <Stack spacing={2}>
            {props.children}
        </Stack>
    </Stack>
}

const SelectTimeZone: FormBuilderComponent = ({ onChange, label, helperText, error, ...rest }) => {
    const { t } = useLocale('App', 'Settings');

    // <EwSelect variant="filled" label="Time format" fullWidth options={[{ value: 0, label: '12h' }, { value: 1, label: '24h' }]} />
    return (
        <FormControl variant="filled" error={error}>
            <InputLabel>{label}</InputLabel>
            <Select onChange={(e) => onChange(e.target.value, { receiveEvent: false })} {...rest}>
                <MenuItem value={'0'}>{t('TimeFormat12Hour')}</MenuItem>
                <MenuItem value={'1'}>{t('TimeFormat24Hour')}</MenuItem>
            </Select>
            <FormHelperText error={error}>{helperText}</FormHelperText>
        </FormControl>
    );
};

const settingsFormComponents: FormBuilderComponents = {
    fieldWrapper: (props) => <SettingsItem {...props} />,
    selectApiEndpoint: ({ onChange, label, helperText, error, ...rest }) => (
        <FormControl variant="filled" error={error}>
            <InputLabel>{label}</InputLabel>
            <Select onChange={(e) => onChange(e.target.value, { receiveEvent: false })} {...rest}>
                <MenuItem value={ApiProductionUrl}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ApiBadge force="prod" />
                        <Typography>{ApiProductionUrl}</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem value={ApiDevelopmentUrl}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ApiBadge force="dev" />
                        <Typography>{ApiDevelopmentUrl}</Typography>
                    </Stack>
                </MenuItem>
            </Select>
            <FormHelperText error={error}>{helperText}</FormHelperText>
        </FormControl>
    ),
    selectTimeFormat: (props) => <SelectTimeZone {...props} />,
    selectTimeZone: ({ onChange, label, helperText, error, ...rest }) => {
        const timeZones = getTimeZones();
        return (
            <FormControl variant="filled" error={error}>
                <InputLabel>{label}</InputLabel>
                <Select onChange={(e) => onChange && onChange(e.target.value, { receiveEvent: false })} {...rest}>
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

function SettingsFormProvider(props: ChildrenProps) {
    return <FormBuilderProvider components={components} {...props} />;
}

function SettingsIndex() {
    const { t } = useLocale('App', 'Settings');
    const locales = useLocale('App', 'Locales');
    const [userLocale, setUserLocale] = useUserSetting<string>('locale', 'en');
    const [userNickName, setUserNickName] = useUserSetting<string>('nickname', CurrentUserProvider.getCurrentUser()?.name ?? '');
    const [userTimeFormat, setUserTimeFormat] = useUserSetting<string>('timeFormat', '1');
    const [userTimeZone, setUserTimeZone] = useUserSetting<string>('timeZone', '0');
    const [userLocation, setUserLocation] = useUserSetting<[number, number] | undefined>('location', undefined);

    const handleLocaleChange = (event: SelectChangeEvent) => {
        setUserLocale(event.target.value);
        window.location.reload();
    };

    const profileForm = {
        nickname: useFormField(userNickName, isNonEmptyString, 'string', t('Nickname')),
    }

    const timeLocationForm = {
        timeFromat: useFormField(userTimeFormat, isNotNull, 'selectTimeFormat', t('TimeFormat')),
        timeZone: useFormField(userTimeZone, isNotNull, 'selectTimeZone', t('TimeZone')),
        location: useFormField(userLocation, isTrue, 'locationMap', t('Location'))
    };

    const developerSettingsForm = {
        apiEndpoint: useFormField(appSettingsProvider.apiAddress, isNonEmptyString, 'selectApiEndpoint', t('ApiEndpoint'))
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

    return (
        <SettingsFormProvider>
            <Container sx={{ p: 2 }}>
                <Stack spacing={4}>
                    <SettingsSection header={t('General')}>
                        <SettingsItem label={t('Language')}>
                            <FormControl variant="filled" sx={{ maxWidth: 320 }}>
                                <InputLabel id="app-settings-locale-select-label">{t('SelectLanguage')}</InputLabel>
                                <Select variant="filled" labelId="app-settings-locale-select-label" value={userLocale} onChange={handleLocaleChange}>
                                    {availableLocales.map(l => (
                                        <MenuItem key={l} value={l} selected={userLocale === l}>{locales.t(l)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </SettingsItem>
                    </SettingsSection>
                    <SettingsSection header={t('LookAndFeel')}>
                        <SettingsItem label={t('Theme')}>
                            <NoSsr>
                                <AppThemePicker />
                            </NoSsr>
                        </SettingsItem>
                    </SettingsSection>
                    <SettingsSection header={t('Profile')}>
                        <NoSsr>
                            <FormBuilder form={profileForm} />
                            <ConnectedService />
                        </NoSsr>
                    </SettingsSection>
                    <SettingsSection header={t('LocationAndTime')}>
                        <NoSsr>
                            <FormBuilder form={timeLocationForm} />
                        </NoSsr>
                    </SettingsSection>
                    <SettingsSection header={t('Developer')}>
                        <NoSsr>
                            <FormBuilder form={developerSettingsForm} />
                        </NoSsr>
                    </SettingsSection>
                </Stack>
            </Container>
        </SettingsFormProvider>
    );
}

SettingsIndex.layout = AppLayoutWithAuth;

export default SettingsIndex;

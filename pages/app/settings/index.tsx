import React, { ReactNode, useEffect, useState } from 'react';
import { getTimeZones } from '@vvo/tzdb';
import { Box, Stack } from '@mui/system';
import { Card, Typography } from '@mui/joy';
import GoogleIcon from '@mui/icons-material/Google';
import { isNonEmptyString, isNotNull, isTrue } from '@enterwell/react-form-validation';
import { FormBuilderComponent, FormBuilderComponents } from '@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types';
import { FormBuilder, FormBuilderProvider, useFormField } from '@enterwell/react-form-builder';
import Loadable from 'components/shared/Loadable/Loadable';
import Container from 'components/shared/layout/Container';
import SelectItems from 'components/shared/form/SelectItems';
import Picker from 'components/shared/form/Picker';
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
        <Card variant="outlined">
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <GoogleIcon fontSize="large" />
                    <Stack>
                        <Typography>Google</Typography>
                        <Typography level="body3">{CurrentUserProvider.getCurrentUser()?.name} ({CurrentUserProvider.getCurrentUser()?.email})</Typography>
                    </Stack>
                </Stack>
                <Typography level="body2">{t('Connected')}</Typography>
            </Stack>
        </Card>
    )
}

function SettingsItem(props: { children: ReactNode, label?: string | undefined }) {
    return (
        <Stack spacing={1}>
            {props.label && <Typography>{props.label}</Typography>}
            {props.children}
        </Stack>
    );
}

function SettingsSection(props: { children: ReactNode, header: string }) {
    return (
        <Stack spacing={2}>
            <Typography level="h5" sx={{ pt: { xs: 0, sm: 2 } }}>{props.header}</Typography>
            <Stack spacing={2} alignItems="start">
                {props.children}
            </Stack>
        </Stack>
    );
}

const SelectTimeZone: FormBuilderComponent = ({ onChange, value }) => {
    const { t } = useLocale('App', 'Settings');

    // <EwSelect variant="filled" label="Time format" fullWidth options={[{ value: 0, label: '12h' }, { value: 1, label: '24h' }]} />
    return (
        <Picker value={value} onChange={onChange} options={[
            { value: '0', label: t('TimeFormat12Hour') },
            { value: '1', label: t('TimeFormat24Hour') }
        ]} />
    );
};

const settingsFormComponents: FormBuilderComponents = {
    fieldWrapper: (props) => <SettingsItem {...props} />,
    selectApiEndpoint: ({ value, onChange, label }) => (
        <SelectItems value={value} onChange={onChange} items={[
            {
                value: ApiProductionUrl,
                label: (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ApiBadge force="prod" />
                        <Typography>{ApiProductionUrl}</Typography>
                    </Stack>
                )
            },
            {
                value: ApiDevelopmentUrl,
                label: (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ApiBadge force="dev" />
                        <Typography>{ApiDevelopmentUrl}</Typography>
                    </Stack>
                )
            }
        ]} label={label} />
    ),
    selectTimeFormat: (props) => <SelectTimeZone {...props} />,
    selectTimeZone: ({ value, onChange, label }) => {
        const timeZones = getTimeZones();
        return (
            <SelectItems value={[value]} onChange={(v) => onChange(v[0])} items={[
                { value: '0', label: '+00:00 UTC', disabled: true },
                ...timeZones.map(tz => ({ value: tz.name, label: tz.currentTimeFormat }))
            ]} label={label} />
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
    const [isLoading, setIsLoading] = useState(true);
    const [userLocale, setUserLocale] = useUserSetting<string>('locale', 'en');
    const [userNickName, setUserNickName] = useUserSetting<string>('nickname', CurrentUserProvider.getCurrentUser()?.name ?? '');
    const [userTimeFormat, setUserTimeFormat] = useUserSetting<string>('timeFormat', '1');
    const [userTimeZone, setUserTimeZone] = useUserSetting<string>('timeZone', '0');
    const [userLocation, setUserLocation] = useUserSetting<[number, number] | undefined>('location', undefined);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleLocaleChange = (values: string[]) => {
        setUserLocale(values[0]);
        window.location.reload();
    };

    const profileForm = {
        nickname: useFormField(userNickName, isNonEmptyString, 'string', t('Nickname')),
    }

    const timeLocationForm = {
        timeFormat: useFormField(userTimeFormat, isNotNull, 'selectTimeFormat', t('TimeFormat'), { receiveEvent: false }),
        timeZone: useFormField(userTimeZone, isNotNull, 'selectTimeZone', t('TimeZone'), { receiveEvent: false }),
        location: useFormField(userLocation, isTrue, 'locationMap', t('Location'))
    };

    const developerSettingsForm = {
        apiEndpoint: useFormField(appSettingsProvider.apiAddress, isNonEmptyString, 'selectApiEndpoint', t('ApiEndpoint'), { receiveEvent: false })
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
        if (!timeLocationForm.timeFormat.error) {
            setUserTimeFormat(timeLocationForm.timeFormat.value?.trim() || undefined);
        }
    }, [setUserTimeFormat, timeLocationForm.timeFormat]);

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
            <Container>
                <Box sx={{ p: 2 }}>
                    <Loadable isLoading={isLoading}>
                        <Stack spacing={4}>
                            <SettingsSection header={t('General')}>
                                <SettingsItem label={t('Language')}>
                                    <SelectItems
                                        value={userLocale ? [userLocale] : []}
                                        onChange={handleLocaleChange}
                                        items={availableLocales.map(l => ({ value: l, label: locales.t(l) }))} />
                                </SettingsItem>
                            </SettingsSection>
                            <SettingsSection header={t('LookAndFeel')}>
                                <SettingsItem label={t('Theme')}>
                                    <AppThemePicker />
                                </SettingsItem>
                            </SettingsSection>
                            <SettingsSection header={t('Profile')}>
                                <FormBuilder form={profileForm} />
                                <ConnectedService />
                            </SettingsSection>
                            <SettingsSection header={t('LocationAndTime')}>
                                <FormBuilder form={timeLocationForm} />
                            </SettingsSection>
                            <SettingsSection header={t('Developer')}>
                                <FormBuilder form={developerSettingsForm} />
                            </SettingsSection>
                        </Stack>
                    </Loadable>
                </Box>
            </Container>
        </SettingsFormProvider>
    );
}

SettingsIndex.layout = AppLayoutWithAuth;

export default SettingsIndex;

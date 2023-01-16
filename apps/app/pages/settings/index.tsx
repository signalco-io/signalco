import React, { ReactNode, useEffect, useState } from 'react';
import { getTimeZones } from '@vvo/tzdb';
import { Stack, Row, Typography, Picker, SelectItems, Checkbox, TextField, Container } from '@signalco/ui';
import { isNonEmptyString, isNotNull, noError } from '@enterwell/react-form-validation';
import { FormBuilderComponent, FormBuilderComponents } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';
import { FormBuilder, FormBuilderProvider, FormItems, useFormField } from '@enterwell/react-form-builder';
import { now } from '../../src/services/DateTimeProvider';
import { ApiDevelopmentUrl, ApiProductionUrl, setSignalcoApiEndpoint, signalcoApiEndpoint } from '../../src/services/AppSettingsProvider';
import useUserSetting from '../../src/hooks/useUserSetting';
import useLocale, { availableLocales } from '../../src/hooks/useLocale';
import useAllEntities from '../../src/hooks/signalco/useAllEntities';
import { arraySum } from '../../src/helpers/ArrayHelpers';
import AppThemePicker from '../../components/settings/AppThemePicker';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';
import LocationMapPicker from '../../components/forms/LocationMapPicker/LocationMapPicker';
import generalFormComponents from '../../components/forms/generalFormComponents';
import ApiBadge from '../../components/development/ApiBadge';

function SettingsItem(props: { children: ReactNode, label?: string | undefined }) {
    return (
        <Stack spacing={1}>
            {props.label && <Typography>{props.label}</Typography>}
            {props.children}
        </Stack>
    );
}

const SelectTimeZone: FormBuilderComponent = ({ onChange, value }) => {
    const { t } = useLocale('App', 'Settings');
    return (
        <Picker value={value} onChange={onChange} options={[
            { value: '0', label: t('TimeFormat12Hour') },
            { value: '1', label: t('TimeFormat24Hour') }
        ]} />
    );
};

const SelectLanguage: FormBuilderComponent = ({ value, label, onChange }) => {
    const locales = useLocale('App', 'Locales');
    return (
        <SelectItems
            label={label}
            value={value ? [value] : []}
            onChange={(values) => onChange(values[0], { receiveEvent: false })}
            items={availableLocales.map(l => ({ value: l, label: locales.t(l) }))} />
    );
}

const settingsFormComponents: FormBuilderComponents = {
    fieldWrapper: (props) => <SettingsItem {...props} />,
    selectApiEndpoint: ({ value, onChange, label }) => (
        <SelectItems value={[value]} onChange={(values) => onChange(values[0])} items={[
            {
                value: ApiProductionUrl,
                label: (
                    <Row spacing={1}>
                        <ApiBadge force="prod" />
                        <Typography>{ApiProductionUrl}</Typography>
                    </Row>
                )
            },
            {
                value: ApiDevelopmentUrl,
                label: (
                    <Row spacing={1}>
                        <ApiBadge force="dev" />
                        <Typography>{ApiDevelopmentUrl}</Typography>
                    </Row>
                )
            }
        ]} label={label} />
    ),
    selectTimeFormat: (props) => <SelectTimeZone {...props} />,
    selectTimeZone: ({ value, onChange, label }) => {
        const timeZones = getTimeZones();
        return (
            <SelectItems value={[value]} onChange={(values) => onChange(values[0])} items={[
                { value: '0', label: '+00:00 UTC', disabled: true },
                ...timeZones.map(tz => ({ value: tz.name, label: tz.currentTimeFormat }))
            ]} label={label} />
        );
    },
    locationMap: (props) => <LocationMapPicker {...props} />,
    language: (props) => <SelectLanguage {...props} />,
    appTheme: () => <AppThemePicker />
};

const components = { ...generalFormComponents, ...settingsFormComponents };

function UsagePage() {
    const usersEntities = useAllEntities(6);
    const userEntity = usersEntities.data?.at(0);

    const nowDate = now();
    const daysInCurrentMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 0).getDate();
    const usages = [...new Array(daysInCurrentMonth).keys()].map(d =>
        JSON.parse((userEntity?.contacts.find(c =>
            c.channelName === 'signalco' &&
            c.contactName === `usage-${nowDate.getFullYear()}${(nowDate.getMonth() + 1).toString().padStart(2, '0')}${(d + 1)}`)?.valueSerialized) ?? '{}'));

    const usageTotal = arraySum(usages, u => u ? (u.other ?? 0) + (u.contactSet ?? 0) + (u.conduct ?? 0) + (u.process ?? 0) : 0);

    return (
        <Stack spacing={4}>
            {/* <span>Plan</span> */}
            <Stack spacing={2}>
                <Typography level="h5">This month</Typography>
                <Row spacing={4}>
                    <Stack>
                        <Typography>Used</Typography>
                        <Typography>{usageTotal}</Typography>
                    </Stack>
                    <Stack>
                        <Typography>Calculated Daily</Typography>
                        <Typography>-</Typography>
                    </Stack>
                    <Stack>
                        <Typography>Calculated Monthly</Typography>
                        <Typography>-</Typography>
                    </Stack>
                </Row>
            </Stack>
            {/* <span>History</span> */}
        </Stack>
    )
}

function SettingsPane() {
    const generalForm = useGeneralForm();
    const profileForm = useProfileForm();
    const lookAndFeelForm = useLookAndFeelForm();
    const timeLocationForm = useTimeLocationForm();
    const developerForm = useDeveloperForm();

    const categories = [
        { id: 'general', label: 'General', form: generalForm },
        { id: 'lookAndFeel', label: 'Look and feel', form: lookAndFeelForm },
        { id: 'profile', label: 'Profile', form: profileForm },
        { id: 'timeAndLocation', label: 'Time and location', form: timeLocationForm },
        { id: 'usage', label: 'Usage', component: UsagePage },
        { id: 'developer', label: 'Developer', form: developerForm },
    ];

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    return (
        <Row alignItems="start" spacing={2} style={{ paddingTop: 16, paddingLeft: 16, paddingRight: 16 }}>
            <Stack spacing={2} style={{ padding: 0 }}>
                <Typography level="h5">&nbsp;</Typography>
                <TextField placeholder="Search..." />
                <Stack>
                    {categories.map(category => (
                        <Checkbox
                            key={category.id}
                            label={category.label}
                            sx={{ p: 2 }}
                            checked={selectedCategory.id === category.id}
                            onChange={(e) => e.target.checked && setSelectedCategory(category)}
                            disableIcon />
                    ))}
                </Stack>
            </Stack>
            <Container maxWidth="md">
                <Stack spacing={2}>
                    <Typography level="h4">{selectedCategory.label}</Typography>
                    {selectedCategory.form && (
                        <FormBuilderProvider components={components}>
                            <FormBuilder form={selectedCategory.form} />
                        </FormBuilderProvider>
                    )}
                    {selectedCategory.component && <selectedCategory.component />}
                </Stack>
            </Container>
        </Row>
    )
}

function useLookAndFeelForm() {
    const form: FormItems = {
        appTheme: useFormField(undefined, noError, 'appTheme', 'App theme')
    };

    return form;
}

function useGeneralForm() {
    const [userLocale, setUserLocale] = useUserSetting<string>('locale', 'en');

    const form: FormItems = {
        language: useFormField(userLocale, noError, 'language', 'Language')
    };

    useEffect(() => {
        if (!form.language?.error &&
            form.language?.value !== userLocale) {
            setUserLocale(form.language?.value);
            window.location.reload();
        }
    }, [form.language, setUserLocale, userLocale]);

    return form;
}

function useProfileForm() {
    const { t } = useLocale('App', 'Settings');
    const [userNickName, setUserNickName] = useUserSetting<string>('nickname', '');

    const profileForm: FormItems = {
        nickname: useFormField(userNickName, isNonEmptyString, 'string', t('Nickname')),
    }

    useEffect(() => {
        if (!profileForm.nickname?.error) {
            setUserNickName(profileForm.nickname?.value?.trim() || undefined);
        }
    }, [setUserNickName, profileForm.nickname]);

    return profileForm;
}

function useDeveloperForm() {
    const { t } = useLocale('App', 'Settings');
    const developerSettingsForm: FormItems = {
        apiEndpoint: useFormField(signalcoApiEndpoint(), isNonEmptyString, 'selectApiEndpoint', t('ApiEndpoint'), { receiveEvent: false })
    };

    useEffect(() => {
        if (!developerSettingsForm.apiEndpoint?.error &&
            developerSettingsForm.apiEndpoint?.value !== signalcoApiEndpoint()) {
            setSignalcoApiEndpoint(developerSettingsForm.apiEndpoint?.value);
            window.location.reload();
        }
    }, [developerSettingsForm.apiEndpoint]);

    return developerSettingsForm;
}

function useTimeLocationForm() {
    const { t } = useLocale('App', 'Settings');
    const [userTimeFormat, setUserTimeFormat] = useUserSetting<string>('timeFormat', '1');
    const [userTimeZone, setUserTimeZone] = useUserSetting<string>('timeZone', '0');
    const [userLocation, setUserLocation] = useUserSetting<[number, number] | undefined>('location', undefined);

    const timeLocationForm: FormItems = {
        timeFormat: useFormField(userTimeFormat, isNotNull, 'selectTimeFormat', t('TimeFormat'), { receiveEvent: false }),
        timeZone: useFormField(userTimeZone, isNotNull, 'selectTimeZone', t('TimeZone'), { receiveEvent: false }),
        location: useFormField(userLocation, noError, 'locationMap', t('Location'))
    };

    useEffect(() => {
        if (!timeLocationForm.timeFormat?.error) {
            setUserTimeFormat(timeLocationForm.timeFormat?.value?.trim() || undefined);
        }
    }, [setUserTimeFormat, timeLocationForm.timeFormat]);

    useEffect(() => {
        if (!timeLocationForm.timeZone?.error) {
            setUserTimeZone(timeLocationForm.timeZone?.value?.trim() || undefined);
        }
    }, [setUserTimeZone, timeLocationForm.timeZone]);

    useEffect(() => {
        if (!timeLocationForm.location?.error) {
            setUserLocation(timeLocationForm.location?.value);
        }
    }, [setUserLocation, timeLocationForm.location]);

    return timeLocationForm;
}

function SettingsIndex() {
    return (
        <SettingsPane />
    );
}

SettingsIndex.layout = AppLayoutWithAuth;

export default SettingsIndex;
1

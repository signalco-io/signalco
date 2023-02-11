'use client';

import { ResponsiveContainer } from 'recharts';
import React, { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getTimeZones } from '@vvo/tzdb';
import { Stack, Row, Typography, Picker, SelectItems, Checkbox, Container, Divider, Loadable } from '@signalco/ui';
import { arraySum, humanizeNumber, sequenceEqual } from '@signalco/js';
import { isNonEmptyString, isNotNull, noError } from '@enterwell/react-form-validation';
import { FormBuilderComponent, FormBuilderComponents } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';
import { FormBuilder, FormBuilderProvider, FormItems, useFormField } from '@enterwell/react-form-builder';
import { now } from '../../src/services/DateTimeProvider';
import { ApiDevelopmentUrl, ApiProductionUrl, setSignalcoApiEndpoint, signalcoApiEndpoint } from '../../src/services/AppSettingsProvider';
import useUserSetting from '../../src/hooks/useUserSetting';
import useLocale, { availableLocales } from '../../src/hooks/useLocale';
import useAllEntities from '../../src/hooks/signalco/useAllEntities';
import SearchInput from '../../components/shared/inputs/SearchInput';
import AppThemePicker from '../../components/settings/AppThemePicker';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';
import LocationMapPicker from '../../components/forms/LocationMapPicker/LocationMapPicker';
import generalFormComponents from '../../components/forms/generalFormComponents';
import ApiBadge from '../../components/development/ApiBadge';

const DynamicGraph = dynamic(() => import('../../components/graphs/Graph'), {
    loading: () => <Loadable isLoading loadingLabel="Loading graph" />,
});

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

type Usage = {
    contactSet: number;
    conduct: number;
    process: number;
    other: number;
}

function LabeledValue({ value, unit, label }: { value: string | number, unit?: string, label: string }) {
    return (
        <Stack>
            <Typography level="body2">{label}</Typography>
            <Row alignItems="end" spacing={1}>
                <Typography level="h5" component="span">
                    {typeof value === 'number' ? humanizeNumber(value) : value}
                </Typography>
                {!!unit && <Typography level="body3" style={{ lineHeight: '24px' }}>{unit}</Typography>}
            </Row>
        </Stack>
    )
}

function sumUsage(u: Partial<Usage>) {
    return u ? (u.other ?? 0) + (u.contactSet ?? 0) + (u.conduct ?? 0) + (u.process ?? 0) : 0;
}

function UsageCurrent() {
    const usersEntities = useAllEntities(6);
    const userEntity = usersEntities.data?.at(0);

    const limit = 2000;

    const nowDate = now();
    const daysInCurrentMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 0).getDate();
    const usages = [...new Array(daysInCurrentMonth).keys()].map(d => {
        const dayUsage = JSON.parse(
            (userEntity?.contacts.find(c =>
                c.channelName === 'signalco' &&
                c.contactName === `usage-${nowDate.getFullYear()}${(nowDate.getMonth() + 1).toString().padStart(2, '0')}${(d + 1).toString().padStart(2, '0')}`)
                ?.valueSerialized)
            ?? '{}');

        return {
            id: `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1).toString().padStart(2, '0')}-${(d + 1).toString().padStart(2, '0')}`,
            value: {
                conduct: dayUsage.conduct ?? 0,
                contactSet: dayUsage.contactSet ?? 0,
                process: dayUsage.process ?? 0,
                other: dayUsage.other ?? 0
            }
        };
    });

    // Last 5 days (including current)
    const calulatedUsageSlice = usages.slice(nowDate.getDate() - 5, nowDate.getDate());
    const usageTotal = arraySum(calulatedUsageSlice.map(s => s.value), sumUsage);

    const dailyCalculated = Math.round(usageTotal / calulatedUsageSlice.length);
    const monthlyCalculated = usageTotal + dailyCalculated * daysInCurrentMonth;

    const predictedUsage = usages.map((u, i) => {
        const isCurrent = i < nowDate.getDate();
        return isCurrent
            ? u
            : ({
                id: u.id,
                value: {
                    conduct: 0,
                    contactSet: 0,
                    process: 0,
                    other: dailyCalculated
                }
            });
    });

    return (
        <Stack spacing={2}>
            <Row spacing={4}>
                <LabeledValue label="Used Today" value={sumUsage(usages[nowDate.getDate() - 1].value)} />
                <LabeledValue label="Used This Month" value={usageTotal} />
                <Divider orientation="vertical" />
                <LabeledValue label="Calculated Daily" value={dailyCalculated} />
                <LabeledValue label="Calculated Monthly" value={monthlyCalculated} />
            </Row>
            <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <DynamicGraph
                        data={predictedUsage}
                        durationMs={daysInCurrentMonth * 24 * 60 * 60 * 1000}
                        width={500}
                        height={300}
                        discrete
                        aggregate
                        limits={[
                            { id: 'executions', value: limit }
                        ]} />
                </ResponsiveContainer>
            </div>
        </Stack>
    )
}

function UsagePlan() {
    return (
        <Row spacing={4} alignItems="start">
            <LabeledValue label="Plan" value="Free" />
            <Stack spacing={2}>
                <LabeledValue label="Executions limit" value={2000} unit="/month" />
            </Stack>
        </Row>
    )
}

function UsagePage() {
    return (
        <Stack spacing={8}>
            <Stack spacing={2}>
                <Typography level="h5">Plan</Typography>
                <UsagePlan />
            </Stack>
            <Stack spacing={2}>
                <Typography level="h5">Current</Typography>
                <UsageCurrent />
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

    const [filteredItems, setFilteredItems] = useState(categories);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    const handleFilteredItems = (updated: typeof categories) => {
        if (!sequenceEqual(updated, filteredItems))
            setFilteredItems(updated);
    };

    return (
        <Row alignItems="start" spacing={2} style={{ paddingTop: 16, paddingLeft: 16, paddingRight: 16 }}>
            <Stack spacing={2} style={{ padding: 0 }}>
                <Typography level="h5">&nbsp;</Typography>
                <SearchInput items={categories} onFilteredItems={handleFilteredItems} />
                <Stack>
                    {filteredItems.map(category => (
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

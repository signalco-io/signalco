'use client';

import { ResponsiveContainer } from 'recharts';
import React, { ComponentProps, ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getTimeZones } from '@vvo/tzdb';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Container } from '@signalco/ui-primitives/Container';
import { Loadable } from '@signalco/ui/Loadable';
import { FilterList } from '@signalco/ui/FilterList';
import { arraySum, humanizeNumber, objectWithKey } from '@signalco/js';
import { isNonEmptyString, isNotNull, noError } from '@enterwell/react-form-validation';
import { FormBuilderComponent, FormBuilderComponents } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';
import { FormBuilder, FormBuilderProvider, FormItems, useFormField } from '@enterwell/react-form-builder';
import { now } from '../../src/services/DateTimeProvider';
import { ApiDevelopmentUrl, ApiProductionUrl, setSignalcoApiEndpoint, signalcoApiEndpoint } from '../../src/services/AppSettingsProvider';
import useUserSetting from '../../src/hooks/useUserSetting';
import useLocale, { availableLocales } from '../../src/hooks/useLocale';
import useAllEntities from '../../src/hooks/signalco/entity/useAllEntities';
import AppThemePicker from '../../components/settings/AppThemePicker';
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

function SelectTimeFormat({ value, label, onChange }: ComponentProps<FormBuilderComponent>) {
    const { t } = useLocale('App', 'Settings');
    return (
        <SelectItems
            label={label}
            value={value}
            onValueChange={onChange}
            items={[
                { value: '0', label: t('TimeFormat12Hour') },
                { value: '1', label: t('TimeFormat24Hour') }
            ]} />
    );
}

function SelectLanguage({ value, label, onChange }: ComponentProps<FormBuilderComponent>) {
    const locales = useLocale('App', 'Locales');
    return (
        <SelectItems
            label={label}
            value={value}
            onValueChange={(v) => onChange(v, { receiveEvent: false })}
            items={availableLocales.map(l => ({ value: l, label: locales.t(l) }))} />
    );
}

const settingsFormComponents: FormBuilderComponents = {
    fieldWrapper: (props) => <SettingsItem {...props} />,
    wrapper: (props) => <Stack spacing={1} {...props} />,
    selectApiEndpoint: ({ value, onChange, label }) => (
        <SelectItems value={value}
            onValueChange={(v) => onChange(v)}
            items={[
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
            ]}
            label={label} />
    ),
    selectTimeFormat: (props) => <SelectTimeFormat {...props} />,
    selectTimeZone: ({ value, onChange, label }) => {
        const timeZones = getTimeZones();
        return (
            <SelectItems value={value}
                onValueChange={onChange}
                items={[
                    { value: '0', label: '+00:00 UTC', disabled: true },
                    ...timeZones.map(tz => ({ value: tz.name, label: tz.currentTimeFormat }))
                ]}
                label={label} />
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
                {!!unit && <Typography level="body3">{unit}</Typography>}
            </Row>
        </Stack>
    )
}

function sumUsage(u: Partial<Usage> | undefined) {
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
            (userEntity?.contacts.find((c: unknown) =>
                objectWithKey(c, 'channelName')?.channelName === 'signalco' &&
                objectWithKey(c, 'channelName')?.contactName === `usage-${nowDate.getFullYear()}${(nowDate.getMonth() + 1).toString().padStart(2, '0')}${(d + 1).toString().padStart(2, '0')}`)
                ?.valueSerialized)
            ?? '{}');

        return {
            id: `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1).toString().padStart(2, '0')}-${(d + 1).toString().padStart(2, '0')}`,
            value: {
                consuct: Number(objectWithKey(dayUsage, 'conduct')?.conduct) || 0,
                contactSet: Number(objectWithKey(dayUsage, 'contactSet')?.contactSet) || 0,
                process: Number(objectWithKey(dayUsage, 'process')?.process) || 0,
                other: Number(objectWithKey(dayUsage, 'other')?.other) || 0
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
                <LabeledValue label="Used Today" value={sumUsage(usages[nowDate.getDate() - 1]?.value)} />
                <LabeledValue label="Used This Month" value={usageTotal} />
                <Divider orientation="vertical" />
                <LabeledValue label="Calculated Daily" value={dailyCalculated} />
                <LabeledValue label="Calculated Monthly" value={monthlyCalculated} />
            </Row>
            <div className="h-96">
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

type SettingsCategory = {
    id: string;
    label: string;
    form?: FormItems;
    component?: () => React.JSX.Element;
}

function SettingsPane() {
    const generalForm = useGeneralForm();
    const profileForm = useProfileForm();
    const lookAndFeelForm = useLookAndFeelForm();
    const timeLocationForm = useTimeLocationForm();
    const developerForm = useDeveloperForm();

    const categories: SettingsCategory[] = [
        { id: 'general', label: 'General', form: generalForm },
        { id: 'lookAndFeel', label: 'Look and feel', form: lookAndFeelForm },
        { id: 'profile', label: 'Profile', form: profileForm },
        { id: 'timeAndLocation', label: 'Time and location', form: timeLocationForm },
        { id: 'usage', label: 'Usage', component: UsagePage },
        { id: 'developer', label: 'Developer', form: developerForm },
    ];

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(categories[0]?.id);
    const selectedCategory = categories.find(c => c.id === selectedCategoryId) ?? categories[0];

    return (
        <div className="flex flex-col gap-4 px-2 sm:flex-row">
            <FilterList selected={selectedCategory?.id} items={categories} onSelected={setSelectedCategoryId} variant="highlight" />
            <Container maxWidth="md" padded={false}>
                <Stack spacing={2}>
                    <Typography className="hidden sm:block" level="h4">{selectedCategory?.label}</Typography>
                    <div>
                        {selectedCategory?.form && (
                            <FormBuilderProvider components={components}>
                                <FormBuilder form={selectedCategory.form} />
                            </FormBuilderProvider>
                        )}
                        {selectedCategory?.component && <selectedCategory.component />}
                    </div>
                </Stack>
            </Container>
        </div>
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

export default function SettingsIndex() {
    return (
        <SettingsPane />
    );
}

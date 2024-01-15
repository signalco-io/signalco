'use client';
import React from 'react';
import { getTimeZones } from '@vvo/tzdb';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Row } from '@signalco/ui-primitives/Row';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';
import { ApiDevelopmentUrl, ApiProductionUrl } from '../../src/services/AppSettingsProvider';
import LocationMapPicker from '../../components/forms/LocationMapPicker/LocationMapPicker';
import ApiBadge from '../../components/development/ApiBadge';
import { SettingsItem } from './components/SettingsItem';
import { SelectTimeFormat } from './components/SelectTimeFormat';
import { SelectLanguage } from './components/SelectLanguage';
import AppThemePicker from './components/AppThemePicker';

export const settingsFormComponents: FormBuilderComponents = {
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

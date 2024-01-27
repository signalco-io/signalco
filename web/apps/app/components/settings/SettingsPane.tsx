'use client';

import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { GeneralFormProvider } from '@signalco/ui-forms/GeneralFormProvider';
import { FilterList } from '@signalco/ui/FilterList';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { FormBuilderProvider } from '@enterwell/react-form-builder';
import { settingsFormComponents } from './settingsFormComponents';
import { UsageSettings as UsageSettings } from './pages/UsageSettings';
import { TimeLocationSettings } from './pages/TimeLocationSettings';
import { ProfileSettings } from './pages/ProfileSettings';
import { LookAndFeelSettings } from './pages/LookAndFeelSettings';
import { GeneralSettings } from './pages/GeneralSettings';
import { DeveloperSettings } from './pages/DeveloperSettings';
import { AuthSettings as AuthSettings } from './pages/AuthSettings';

const settingsCategories = [
    { id: 'general', label: 'General', component: GeneralSettings },
    { id: 'lookAndFeel', label: 'Look and feel', component: LookAndFeelSettings },
    { id: 'profile', label: 'Profile', component: ProfileSettings },
    { id: 'auth', label: 'Auth', component: AuthSettings },
    { id: 'timeAndLocation', label: 'Time and location', component: TimeLocationSettings },
    { id: 'usage', label: 'Usage', component: UsageSettings },
    { id: 'developer', label: 'Developer', component: DeveloperSettings },
];

export function SettingsPane() {
    const [selectedCategoryId, setSelectedCategoryId] = useSearchParam('category');
    const selectedCategory = settingsCategories.find(c => c.id === selectedCategoryId) ?? settingsCategories[0]!;

    return (
        <div className="flex flex-col gap-4 px-2 sm:flex-row">
            <FilterList selected={selectedCategory?.id} items={settingsCategories} onSelected={setSelectedCategoryId} variant="highlight" />
            <Container maxWidth="md" padded={false}>
                <Stack spacing={2}>
                    <Typography className="hidden sm:block" level="h4">{selectedCategory?.label}</Typography>
                    <GeneralFormProvider>
                        <FormBuilderProvider components={settingsFormComponents}>
                            {<selectedCategory.component />}
                        </FormBuilderProvider>
                    </GeneralFormProvider>
                </Stack>
            </Container>
        </div>
    )
}

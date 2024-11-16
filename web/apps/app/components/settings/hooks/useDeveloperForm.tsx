'use client';
import { useEffect } from 'react';
import { isNonEmptyString } from '@enterwell/react-form-validation';
import { FormItems, useFormField } from '@enterwell/react-form-builder';
import { setSignalcoApiEndpoint, signalcoApiEndpoint } from '../../../src/services/AppSettingsProvider';
import useLocale from '../../../src/hooks/useLocale';


export function useDeveloperForm() {
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

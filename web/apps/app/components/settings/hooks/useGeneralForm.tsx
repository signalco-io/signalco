'use client';
import { useEffect } from 'react';
import { noError } from '@enterwell/react-form-validation';
import { FormItems, useFormField } from '@enterwell/react-form-builder';
import useUserSetting from '../../../src/hooks/useUserSetting';


export function useGeneralForm() {
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

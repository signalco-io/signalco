'use client';
import { noError } from '@enterwell/react-form-validation';
import { FormItems, useFormField } from '@enterwell/react-form-builder';


export function useLookAndFeelForm() {
    const form: FormItems = {
        appTheme: useFormField(undefined, noError, 'appTheme', 'App theme')
    };

    return form;
}

'use client';

import React, { ComponentProps } from 'react';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { FormBuilderComponent } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';
import useLocale, { availableLocales } from '../../../src/hooks/useLocale';

export function SelectLanguage({ value, label, onChange }: ComponentProps<FormBuilderComponent>) {
    const locales = useLocale('App', 'Locales');
    return (
        <SelectItems
            label={label}
            value={value}
            onValueChange={(v) => onChange(v, { receiveEvent: false })}
            items={availableLocales.map(l => ({ value: l, label: locales.t(l) }))} />
    );
}

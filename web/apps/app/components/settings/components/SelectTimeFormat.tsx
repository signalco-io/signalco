'use client';

import React, { ComponentProps } from 'react';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { FormBuilderComponent } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';
import useLocale from '../../../src/hooks/useLocale';

export function SelectTimeFormat({ value, label, onChange }: ComponentProps<FormBuilderComponent>) {
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

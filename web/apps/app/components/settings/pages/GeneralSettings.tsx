'use client';
import React from 'react';
import { FormBuilder } from '@enterwell/react-form-builder';
import { useGeneralForm } from '../hooks/useGeneralForm';

export function GeneralSettings() {
    const form = useGeneralForm();
    return <FormBuilder form={form} />;
}

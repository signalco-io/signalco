'use client';
import React from 'react';
import { FormBuilder } from '@enterwell/react-form-builder';
import { useTimeLocationForm } from '../hooks/useTimeLocationForm';

export function TimeLocationSettings() {
    const form = useTimeLocationForm();
    return <FormBuilder form={form} />;
}

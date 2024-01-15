'use client';
import React from 'react';
import { FormBuilder } from '@enterwell/react-form-builder';
import { useDeveloperForm } from '../hooks/useDeveloperForm';

export function DeveloperSettings() {
    const form = useDeveloperForm();
    return <FormBuilder form={form} />;
}

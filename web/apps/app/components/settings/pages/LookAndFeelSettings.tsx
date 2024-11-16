'use client';
import React from 'react';
import { FormBuilder } from '@enterwell/react-form-builder';
import { useLookAndFeelForm } from '../hooks/useLookAndFeelForm';

export function LookAndFeelSettings() {
    const form = useLookAndFeelForm();
    return <FormBuilder form={form} />;
}

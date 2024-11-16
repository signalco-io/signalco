'use client';
import React from 'react';
import { FormBuilder } from '@enterwell/react-form-builder';
import { useProfileForm } from '../hooks/useProfileForm';

export function ProfileSettings() {
    const form = useProfileForm();
    return <FormBuilder form={form} />;
}

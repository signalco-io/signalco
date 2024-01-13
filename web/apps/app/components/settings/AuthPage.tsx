'use client';
import React from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { CreateAuthPatButton } from '../../components/settings/CreateAuthPatButton';
import { AuthPatsList } from '../../components/settings/AuthPatsList';

export function AuthPage() {
    return (
        <Stack spacing={1}>
            <CreateAuthPatButton />
            <AuthPatsList />
        </Stack>
    );
}

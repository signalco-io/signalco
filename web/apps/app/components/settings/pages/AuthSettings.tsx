import React from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { CreateAuthPatButton } from '../components/CreateAuthPatButton';
import { AuthPatsTable } from '../components/AuthPatsTable';

export function AuthSettings() {
    return (
        <Stack spacing={1}>
            <div className="flex flex-row justify-end">
                <CreateAuthPatButton />
            </div>
            <AuthPatsTable />
        </Stack>
    );
}

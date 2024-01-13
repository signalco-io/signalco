import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { UsagePlan, UsageCurrent } from './SettingsPane';

export function UsagePage() {
    return (
        <Stack spacing={8}>
            <Stack spacing={2}>
                <Typography level="h5">Plan</Typography>
                <UsagePlan />
            </Stack>
            <Stack spacing={2}>
                <Typography level="h5">Current</Typography>
                <UsageCurrent />
            </Stack>
            {/* <span>History</span> */}
        </Stack>
    );
}

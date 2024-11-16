import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { UsagePlan } from '../components/UsagePlan';
import { UsageCurrent } from '../components/UsageCurrent';

export function UsageSettings() {
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

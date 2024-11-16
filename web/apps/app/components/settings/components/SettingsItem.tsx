import React, { ReactNode } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';

export function SettingsItem(props: { children: ReactNode; label?: string | undefined; }) {
    return (
        <Stack spacing={1}>
            {props.label && <Typography>{props.label}</Typography>}
            {props.children}
        </Stack>
    );
}

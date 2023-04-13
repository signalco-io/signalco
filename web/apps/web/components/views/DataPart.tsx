'use client';
import React from 'react';
import { Stack, Typography } from '@signalco/ui';

export function DataPart(props: { value: string; subtitle: string; }) {
    return <Stack alignItems="center" spacing={1}>
        <Typography level="h3" component="span" lineHeight={1}>{props.value}</Typography>
        <Typography textTransform="uppercase" secondary lineHeight={1}>{props.subtitle}</Typography>
    </Stack>;
}

import React from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';

export default function PageCenterHeader(props: { header: string; subHeader?: string; secondary?: boolean }) {
    const { header, subHeader, secondary } = props;
    return (
        <header className="py-4">
            <Stack alignItems="center" spacing={2}>
                <Typography level={secondary ? 'h5' : 'h4'}>{header}</Typography>
                {subHeader && <Typography className="text-center opacity-80">{subHeader}</Typography>}
            </Stack>
        </header>
    );
}

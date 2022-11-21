import React from 'react';
import { Typography } from '@signalco/ui';
import { Stack } from '@mui/system';

export default function PageCenterHeader(props: { header: string; subHeader?: string; secondary?: boolean }) {
    const { header, subHeader, secondary } = props;
    return (
        <Stack alignItems="center" spacing={2} sx={{ py: { xs: 2, md: 4 } }}>
            <Typography level={secondary ? 'h5' : 'h4'}>{header}</Typography>
            {subHeader && <Typography>{subHeader}</Typography>}
        </Stack>
    );
}

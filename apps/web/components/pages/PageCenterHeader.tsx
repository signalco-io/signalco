import React from 'react';
import { Typography, Stack, Box } from '@signalco/ui';

export default function PageCenterHeader(props: { header: string; subHeader?: string; secondary?: boolean }) {
    const { header, subHeader, secondary } = props;
    return (
        <Box sx={{ py: { xs: 2, md: 4 } }}>
            <Stack alignItems="center" spacing={2}>
                <Typography level={secondary ? 'h5' : 'h4'}>{header}</Typography>
                {subHeader && <Typography>{subHeader}</Typography>}
            </Stack>
        </Box>
    );
}

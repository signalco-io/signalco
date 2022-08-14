import React from 'react';
import { Stack, Typography } from '@mui/material';

export default function PageCenterHeader(props: { header: string; subHeader?: string; }) {
    const { header, subHeader } = props;
    return (
        <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
            <Typography variant="h1">{header}</Typography>
            {subHeader && <Typography>{subHeader}</Typography>}
        </Stack>
    );
}

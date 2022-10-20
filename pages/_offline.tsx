import React from 'react';
import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import { PageFullLayout } from '../components/layouts/PageFullLayout';
import SignalcoLogotype from '../components/icons/SignalcoLogotype';

function OfflinePage() {
    return (
        <Stack
            sx={{
                my: '20vh'
            }}
            alignItems="center"
            spacing={4}
        >
            <div>
                <SignalcoLogotype width={230} />
            </div>
            <Typography variant="h1" fontWeight={300} color="textSecondary">You are offline...</Typography>
        </Stack>
    );
}

OfflinePage.layout = PageFullLayout;

export default OfflinePage;

import React from 'react';
import { Typography } from '@signalco/ui';
import { Stack } from '@mui/system';
import { AppLayout } from '../components/layouts/AppLayout';
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
            <Typography level="h1" fontWeight={300} textColor="text.secondary">You are offline...</Typography>
        </Stack>
    );
}

OfflinePage.layout = AppLayout;

export default OfflinePage;

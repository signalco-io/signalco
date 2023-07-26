'use client';

import { useEffect } from 'react';
import { Stack } from '@signalco/ui/dist/Stack';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useAuth0 } from '@auth0/auth0-react';

export default function AppLogoutPage() {
    const { logout } = useAuth0();

    useEffect(() => {
        logout();
    }, [logout])

    return (
        <div style={{ padding: 42 }}>
            <Stack spacing={2} alignItems="center" justifyContent="center">
                <Loadable isLoading loadingLabel="Logging you out..."></Loadable>
                <div>Logging you out...</div>
            </Stack>
        </div>
    );
}

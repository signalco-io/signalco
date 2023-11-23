'use client';

import { useEffect } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Loadable } from '@signalco/ui/Loadable';
import { useAuth0 } from '@auth0/auth0-react';

export default function AppLogoutPage() {
    const { logout } = useAuth0();

    useEffect(() => {
        logout();
    }, [logout])

    return (
        <div className="p-10">
            <Stack spacing={2} alignItems="center" justifyContent="center">
                <Loadable isLoading loadingLabel="Logging you out..."></Loadable>
                <div>Logging you out...</div>
            </Stack>
        </div>
    );
}

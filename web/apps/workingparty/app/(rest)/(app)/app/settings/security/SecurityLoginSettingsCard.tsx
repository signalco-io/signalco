'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Loadable } from '@signalco/ui/Loadable';
import { useCurrentUser } from '../../../../../../src/hooks/data/users/useCurrentUser';
import { SettingsCard } from '../../../../../../src/components/settings/SettingsCard';

export function SecurityLoginSettingsCard() {
    const currentUser = useCurrentUser();

    return (
        <SettingsCard header="Login">
            <Loadable
                isLoading={currentUser.isLoading}
                loadingLabel="Loading login info..."
                placeholder="skeletonText"
                width={300}>
                <Typography level="body1" secondary>You are using email <strong>{currentUser?.data?.user?.email}</strong> to login.</Typography>
            </Loadable>
        </SettingsCard>
    );
}

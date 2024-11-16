'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Loadable } from '@signalco/ui/Loadable';
import { SettingsCard } from '../../../../../../src/components/settings/SettingsCard';
import { User } from '../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../packages/auth-client/src/useCurrentUser';

export function SecurityLoginSettingsCard() {
    const currentUser = useCurrentUser<User>();

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

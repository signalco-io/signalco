'use client';

import { FormEvent, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { Loadable } from '@signalco/ui/Loadable';
import { useCurrentUserUpdate } from '../../../../../../src/hooks/data/users/useCurrentUserUpdate';
import { SettingsCardActions } from '../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../src/components/settings/SettingsCard';
import { type User } from '../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../packages/auth-client/src/useCurrentUser';

function ProfileDisplayNameSettingsForm({ user }: { user: User }) {
    const [displayName, setDisplayName] = useState<string>(user.displayName);
    return (
        <Input
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)} />
    )
}

export function ProfileDisplayNameSettingsCard() {
    const currentUser = useCurrentUser<User>();
    const currentUserUpdate = useCurrentUserUpdate();

    const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
    const memberSinceDisplay = currentUser.data?.user?.createdAt
        ? dateFormatter.format(currentUser.data?.user?.createdAt * 1000)
        : undefined;

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const displayName = data.get('displayName');
        if (typeof displayName !== 'string' || displayName.length <= 0) {
            return;
        }

        try {
            await currentUserUpdate.mutateAsync({ displayName });
            showNotification('Display name updated', 'success');
        } catch {
            showNotification('Failed to update display name', 'error');
        }
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <SettingsCard header="Display Name">
                <Typography level="body1" secondary>The name that will be displayed to other users. It can be your full name, nickname, or anything else you prefer.</Typography>
                <Loadable
                    isLoading={currentUser.isLoading}
                    loadingLabel="Loading display name..."
                    placeholder="skeletonRect"
                    className="w-full"
                    error={currentUser.error}
                    width={300}
                    height={40}>
                    {currentUser.data?.user && <ProfileDisplayNameSettingsForm user={currentUser.data?.user} />}
                </Loadable>
                <SettingsCardActions className="justify-between">
                    <Typography level="body2">{memberSinceDisplay ? `Member since ${memberSinceDisplay}` : ''}</Typography>
                    <Button size="sm" variant="solid" type="submit">Save</Button>
                </SettingsCardActions>
            </SettingsCard>
        </form>
    );
}

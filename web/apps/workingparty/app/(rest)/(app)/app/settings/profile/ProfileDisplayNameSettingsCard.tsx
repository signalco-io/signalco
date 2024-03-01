'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { Loadable } from '@signalco/ui/Loadable';
import { useCurrentUser } from '../../../../../../src/hooks/data/users/useCurrentUser';
import { SettingsCardActions } from '../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../src/components/settings/SettingsCard';

export function ProfileDisplayNameSettingsCard() {
    const currentUser = useCurrentUser();

    const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

    return (
        <SettingsCard header="Display Name">
            <Typography level="body1" secondary>The name that will be displayed to other users. It can be your full name, nickname, or anything else you prefer.</Typography>
            <Loadable isLoading={currentUser.isLoading} loadingLabel="Loading display name..." placeholder="skeletonRect" className="w-full" width={300} height={40}>
                <Input value={currentUser.data?.user?.displayName} />
            </Loadable>
            <SettingsCardActions className="justify-between">
                <Typography level="body2">Member since {dateFormatter.format(currentUser.data?.user?.createdAt)}</Typography>
                <Button size="sm" variant="solid">Save</Button>
            </SettingsCardActions>
        </SettingsCard>
    );
}

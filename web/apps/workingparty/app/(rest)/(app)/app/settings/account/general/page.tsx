'use client';

import { FormEvent, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Input } from '@signalco/ui-primitives/Input';
import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { Loadable } from '@signalco/ui/Loadable';
import { useAccountUpdate } from '../../../../../../../src/hooks/data/account/useAccountUpdate';
import { Account, useAccount } from '../../../../../../../src/hooks/data/account/useAccount';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';
import { User } from '../../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../../packages/auth-client/src/useCurrentUser';

function SettingsAccountGeneralForm({ account }: { account: Account }) {
    const [name, setName] = useState<string>(account.name);
    return (
        <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)} />
    )
}

export default function SettingsAccountGeneralPage() {
    const currentUser = useCurrentUser<User>();
    const accountId = currentUser.data?.user?.accountIds[0];
    const account = useAccount(accountId);
    const accountUpdate = useAccountUpdate(accountId);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = data.get('name');
        if (typeof name !== 'string' || name.length <= 0) {
            return;
        }

        try {
            await accountUpdate.mutateAsync({ name });
            showNotification('Account name updated', 'success');
        } catch {
            showNotification('Failed to update account name', 'error');
        }
    }

    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
                <Typography level="h1" className="text-2xl">Account</Typography>
                <form onSubmit={handleFormSubmit}>
                    <SettingsCard header="Account Name">
                        <Stack spacing={2}>
                            <Typography level="body1" secondary>The account name visible to users. For example, the name of your company or department.</Typography>
                            <Loadable
                                isLoading={currentUser.isLoading || account.isLoading}
                                loadingLabel="Loading display name..."
                                placeholder="skeletonRect"
                                className="w-full"
                                width={300}
                                height={40}
                                error={currentUser.error || account.error}>
                                {account.data && <SettingsAccountGeneralForm account={account.data} />}
                            </Loadable>
                        </Stack>
                        <SettingsCardActions className="justify-end">
                            <Button size="sm" variant="solid">
                                Save
                            </Button>
                        </SettingsCardActions>
                    </SettingsCard>
                </form>
            </Stack>
        </Container>
    )
}
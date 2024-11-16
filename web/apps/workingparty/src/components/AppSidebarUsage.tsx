'use client';

import Link from 'next/link';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { Row } from '@signalco/ui-primitives/Row';
import { Progress } from '@signalco/ui-primitives/Progress';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { Loadable } from '@signalco/ui/Loadable';
import { KnownPages } from '../knownPages';
import { useAccountUsage } from '../hooks/data/account/useAccountUsage';
import { useAccountSubscriptions } from '../hooks/data/account/useAccountSubscriptions';
import { useCurrentUser } from '../../../../packages/auth-client/src/useCurrentUser';
import { User } from './providers/AppAuthProvider';

export function AppSidebarUsage() {
    const currentUser = useCurrentUser<User>();
    const accountId = currentUser.data?.user?.accountIds[0];
    const usage = useAccountUsage(accountId);
    const subscriptions = useAccountSubscriptions(accountId);

    const percentage = usage.data?.messages.total
        ? Math.ceil((usage.data.messages.used / usage.data.messages.total) * 100)
        : 100;
    const hasUpgradePath = subscriptions.data?.filter(subscription => subscription.active).some(subscription => subscription.hasUpgradePath);

    return (
        <Stack spacing={2} className="p-2">
            <Loadable placeholder={<Skeleton className="h-8 w-full" />} isLoading={usage.isLoading || currentUser.isLoading} loadingLabel="Loading usage...">
                <Link href={KnownPages.AppSettingsAccountUsage}>
                    <Stack spacing={1}>
                        <Row justifyContent="space-between">
                            <Typography level="body2" tertiary semiBold>Usage</Typography>
                            <Typography level="body2" tertiary>{percentage}%</Typography>
                        </Row>
                        <Progress value={percentage} className="h-2" trackClassName={cx(percentage < 100 ? 'bg-zinc-600' : 'bg-red-500')} />
                    </Stack>
                </Link>
                {(hasUpgradePath || percentage >= 100) && (
                    <Button
                        href={KnownPages.AppSettingsAccountBilling}
                        fullWidth>
                        Upgrade
                    </Button>
                )}
            </Loadable>
        </Stack>
    );
}

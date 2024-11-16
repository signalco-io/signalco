'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useAccountUsage } from '../../../../../../../src/hooks/data/account/useAccountUsage';
import { User } from '../../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../../packages/auth-client/src/useCurrentUser';
import { UsageCard } from './UsageCard';
import { InsightsItemSkeleton } from './InsightsItemSkeleton';
import { InsightsItem } from './InsightsItem';

export function InsightsUsageCard() {
    const currentUser = useCurrentUser<User>();
    const accountId = currentUser.data?.user?.accountIds[0];
    const usage = useAccountUsage(accountId);

    const isLoading = usage.isPending || usage.isLoading || currentUser.isLoading;
    const error = usage.error || currentUser.error;

    return (
        <UsageCard>
            <div className="-m-8 grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_1fr]">
                <div className="col-span-5 px-4 py-2">
                    <Row justifyContent="space-between">
                        <Typography level="body1">Usage in the current billing cycle</Typography>
                        <NavigatingButton
                            variant="outlined"
                            href={KnownPages.AppSettingsAccountBilling}
                            size="sm">
                            See Current Plan
                        </NavigatingButton>
                    </Row>
                </div>
                <Divider className="col-span-5" />
                <div className="p-4">
                    <Loadable
                        isLoading={isLoading}
                        loadingLabel="Loading usage data..."
                        placeholder={<InsightsItemSkeleton />}
                        error={error}>
                        <InsightsItem
                            name="Messages"
                            value={usage.data?.messages.used}
                            maxValue={usage.data?.messages.total}
                            unlimited={usage.data?.messages.unlimited} />
                    </Loadable>
                </div>
                <Divider orientation="vertical" />
                <div className="p-4">
                    <Loadable
                        isLoading={isLoading}
                        loadingLabel="Loading usage data..."
                        placeholder={<InsightsItemSkeleton />}
                        error={error}>
                        <InsightsItem
                            name="Workers"
                            value={usage.data?.workers.used}
                            maxValue={usage.data?.workers.total}
                            unlimited={usage.data?.workers.unlimited} />
                    </Loadable>
                </div>
            </div>
        </UsageCard>
    );
}

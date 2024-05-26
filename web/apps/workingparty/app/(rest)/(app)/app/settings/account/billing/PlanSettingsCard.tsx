'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Button } from '@signalco/ui-primitives/Button';
import { Warning } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useAccountUsage } from '../../../../../../../src/hooks/data/account/useAccountUsage';
import { useAccountSubscriptions } from '../../../../../../../src/hooks/data/account/useAccountSubscriptions';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';
import { User } from '../../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../../packages/auth-client/src/useCurrentUser';

export function PlanSettingsCard() {
    const currentUser = useCurrentUser<User>();
    const accountId = currentUser.data?.user?.accountIds[0];
    const subscriptions = useAccountSubscriptions(accountId);
    const activeSubscription = subscriptions.data?.find(subscription => subscription.active);
    const usage = useAccountUsage(accountId);

    const cycleFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

    const currentPlanInsight = activeSubscription?.plan
        ? <>You are currently on <strong>{activeSubscription?.plan?.name || 'Unknown'}</strong> plan.</>
        : <>You are currently have no active plan.</>;
    const currentPlanCancelled = activeSubscription?.end
        ? <>Your current plan is cancelled. Plan will stay active until <strong>{new Date(activeSubscription.end).toLocaleDateString(undefined, { dateStyle: 'long' })}</strong> but will not renew automatically.</>
        : null;

    return (
        <SettingsCard header="Plan">
            <Loadable
                isLoading={subscriptions.isPending || subscriptions.isLoading || usage.isPending || usage.isLoading}
                error={subscriptions.error || usage.error}
                loadingLabel="Loading subscriptions..."
                placeholder="skeletonText"
                width={300}
            >
                <Row justifyContent="space-between" spacing={2}>
                    <div>
                        <Typography level="body1">
                            {currentPlanInsight}
                        </Typography>
                        {!currentPlanCancelled && usage.data?.period?.start && (
                            <Typography level="body1">
                                The next payment of <strong>{activeSubscription?.plan?.currency.toUpperCase()} {activeSubscription?.plan?.price.toFixed(2)}</strong> will occur on <strong>{usage.data?.period.end?.toLocaleDateString(undefined, { dateStyle: 'long' })}</strong>.
                            </Typography>
                        )}
                        {currentPlanCancelled && (
                            <Row spacing={1}>
                                <Warning className="size-5 text-yellow-600" />
                                <Typography level="body1" className="mt-2">
                                    {currentPlanCancelled}
                                </Typography>
                            </Row>
                        )}
                    </div>
                    {(activeSubscription?.hasUpgradePath ?? true) && (
                        <NavigatingButton
                            size="sm"
                            href={KnownPages.AppSettingsAccountBillingPlans}>
                            Upgrade
                        </NavigatingButton>
                    )}
                </Row>
            </Loadable>
            {usage.data?.period?.start && (
                <>
                    <Divider />
                    <Stack>
                        <Row justifyContent="space-between">
                            <Typography level="body1">
                                Current billing cycle ({cycleFormatter.format(usage.data?.period.start)} - {cycleFormatter.format(usage.data?.period.end)})
                            </Typography>
                            <NavigatingButton size="sm" href={KnownPages.AppSettingsAccountUsage}>View Usage</NavigatingButton>
                        </Row>
                    </Stack>
                </>
            )}
            <SettingsCardActions className="justify-between">
                <Typography level="body1" tertiary>See more info about <Button variant="link" size="xs" href={KnownPages.Pricing} className="text-base">Pricing</Button></Typography>
                <Row spacing={2}>
                    <Typography level="body1" tertiary>Custom needs?</Typography>
                    <NavigatingButton variant="solid" size="sm" href={KnownPages.Contact}>Contact Sales</NavigatingButton>
                </Row>
            </SettingsCardActions>
        </SettingsCard>
    );
}

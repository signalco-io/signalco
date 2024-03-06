'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Button } from '@signalco/ui-primitives/Button';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useCurrentUser } from '../../../../../../../src/hooks/data/users/useCurrentUser';
import { useAccountUsage } from '../../../../../../../src/hooks/data/account/useAccountUsage';
import { useAccountSubscriptions } from '../../../../../../../src/hooks/data/account/useAccountSubscriptions';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';

export function PlanSettingsCard() {
    const currentUser = useCurrentUser();
    const accountId = currentUser.data?.user?.accountIds[0];
    const subscriptions = useAccountSubscriptions(accountId);
    const activeSubscription = subscriptions.data?.find(subscription => subscription.active);
    const usage = useAccountUsage(accountId);

    const cycleFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

    const currentPlanInsight = activeSubscription?.plan
        ? <>You are currently on <strong>{activeSubscription?.plan?.name || 'Unknown'}</strong> plan.</>
        : <>You are currently have no active plan.</>;

    return (
        <SettingsCard header="Plan">
            <Row justifyContent="space-between">
                <div>
                    <Typography level="body1">
                        {currentPlanInsight}
                    </Typography>
                    {usage.data?.period?.start && (
                        <Typography level="body1">
                            The next payment of <strong>{activeSubscription?.currency.toUpperCase()} {activeSubscription?.price.toFixed(2)}</strong> will occur on <strong>{usage.data?.period.end?.toLocaleDateString(undefined, { dateStyle: 'long' })}</strong>.
                        </Typography>
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
            {usage.data?.period?.start && (
                <>
                    <Divider />
                    <Stack>
                        <Row justifyContent="space-between">
                            <Typography level="body1">
                                Current billing cycle ({cycleFormatter.format(usage.data?.period.start)} - {cycleFormatter.format(usage.data?.period.end)})
                            </Typography>
                            <NavigatingButton size="sm">View Usage</NavigatingButton>
                        </Row>
                    </Stack>
                </>
            )}
            <SettingsCardActions className="justify-between">
                <Typography level="body1" tertiary>See more info about <Button variant="link" size="xs" href={KnownPages.Pricing} className="text-base">Pricing</Button></Typography>
                <Row spacing={2}>
                    <Typography level="body1" tertiary>Custom needs?</Typography>
                    <NavigatingButton variant="solid" size="sm">Contact Sales</NavigatingButton>
                </Row>
            </SettingsCardActions>
        </SettingsCard>
    );
}

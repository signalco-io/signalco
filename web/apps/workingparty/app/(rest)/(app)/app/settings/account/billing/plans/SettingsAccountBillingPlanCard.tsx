'use client';

import { useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Tabs, TabsList, TabsTrigger } from '@signalco/ui-primitives/Tabs';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { Chip } from '@signalco/ui-primitives/Chip';
import { showNotification } from '@signalco/ui-notifications';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { CheckoutSessionDto } from '../../../../../../../api/accounts/[accountId]/billing/checkout/[planId]/route';
import { clientStripe } from '../../../../../../../../src/lib/stripe/clientStripe';
import { usePlans } from '../../../../../../../../src/hooks/data/plans/usePlans';
import { useAccountSubscriptions } from '../../../../../../../../src/hooks/data/account/useAccountSubscriptions';
import { SettingsCardActions } from '../../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../../src/components/settings/SettingsCard';
import { User } from '../../../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../../../packages/auth-client/src/useCurrentUser';

export function SettingsAccountBillingPlanCard() {
    const [selectedPeriod, setSelectedPeriod] = useSearchParam('period', 'monthly');
    const plans = usePlans();
    const filteredPlans = plans.data?.filter(plan => plan.period === selectedPeriod);

    const currentUser = useCurrentUser<User>();
    const accountId = currentUser.data?.user?.accountIds[0];
    const subscriptions = useAccountSubscriptions(accountId);
    const activePlanId = subscriptions.data?.find(s => s.active)?.plan?.id;

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const canUpgrade = selectedPlanId && activePlanId !== selectedPlanId;

    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            if (!accountId || !selectedPlanId) {
                showNotification('Please select a plan to upgrade to.', 'warning');
                return;
            }

            const sessionResponse = await fetch(`/api/accounts/${accountId}/billing/checkout/${selectedPlanId}`);
            if (!sessionResponse.ok) {
                showNotification('Failed to create checkout session. Please try again.', 'error');
                return;
            }

            const session = await sessionResponse.json() as CheckoutSessionDto;
            const stripe = await clientStripe();
            stripe?.redirectToCheckout({ sessionId: session.sessionId });
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <SettingsCard header="Plans">
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <Stack spacing={2}>
                    <TabsList className="self-center border">
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                    <Loadable
                        isLoading={plans.isLoading}
                        error={plans.error}
                        loadingLabel="Loading plans..."
                    >
                        <List variant="outlined">
                            {!filteredPlans?.length && (
                                <ListItem label="No plans available" />
                            )}
                            {filteredPlans?.map(plan => (
                                <ListItem
                                    variant="outlined"
                                    key={plan.id}
                                    nodeId={plan.id}
                                    selected={selectedPlanId === plan.id}
                                    onSelected={setSelectedPlanId}
                                    label={(
                                        <Row spacing={1} justifyContent="space-between">
                                            <Row spacing={1}>
                                                <Typography>{plan.name}</Typography>
                                                {activePlanId === plan.id && <Chip color="info">Current</Chip>}
                                            </Row>
                                            <Typography>{plan.price} {plan.currency.toUpperCase()}</Typography>
                                        </Row>
                                    )}>
                                </ListItem>
                            ))}
                        </List>
                    </Loadable>
                    <SettingsCardActions className="justify-end">
                        <NavigatingButton
                            variant="solid"
                            disabled={!canUpgrade}
                            className="self-end"
                            loading={checkoutLoading}
                            onClick={handleCheckout}
                        >
                            Upgrade
                        </NavigatingButton>
                    </SettingsCardActions>
                </Stack>
            </Tabs>
        </SettingsCard>
    );
}

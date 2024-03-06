'use client';

import { useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Tabs, TabsList, TabsTrigger } from '@signalco/ui-primitives/Tabs';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { useCurrentUser } from '../../../../../../../../src/hooks/data/users/useCurrentUser';
import { usePlans } from '../../../../../../../../src/hooks/data/plans/usePlans';
import { useAccountSubscriptions } from '../../../../../../../../src/hooks/data/account/useAccountSubscriptions';
import { SettingsCardActions } from '../../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../../src/components/settings/SettingsCard';

export default function SettingsAccountBillingPlansPage() {
    const [selectedPeriod, setSelectedPeriod] = useSearchParam('period', 'monthly');
    const plans = usePlans();
    const filteredPlans = plans.data?.filter(plan => plan.period === selectedPeriod);

    const currentUser = useCurrentUser();
    const accountId = currentUser.data?.user?.accountIds[0];
    const subscriptions = useAccountSubscriptions(accountId);
    const activePlanId = subscriptions.data?.find(s => s.active)?.plan?.id;

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const canUpgrade = selectedPlanId && activePlanId !== selectedPlanId;

    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
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
                                                    <Typography>{plan.name}</Typography>
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
                                >
                                    Upgrade
                                </NavigatingButton>
                            </SettingsCardActions>
                        </Stack>
                    </Tabs>
                </SettingsCard>
            </Stack>
        </Container>
    )
}
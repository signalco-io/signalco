'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Button } from '@signalco/ui-primitives/Button';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useAccountUsage } from '../../../../../../../src/hooks/data/account/useAccountUsage';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';

export function PlanSettingsCard() {
    const usage = useAccountUsage();

    const cycleFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

    return (
        <SettingsCard header="Plan">
            <Row justifyContent="space-between">
                <div>
                    <Typography level="body1">
                        You are currently on <strong>{usage.data?.plan.name || 'Unknown'}</strong> plan.
                    </Typography>
                    <Typography level="body1">
                        The next payment of <strong>{usage.data?.plan.currency.toUpperCase()} {usage.data?.plan.price.toFixed(2)}</strong> will occur on <strong>{usage.data?.usage.period.end.toLocaleDateString(undefined, { dateStyle: 'long' })}</strong>.
                    </Typography>
                </div>
                {usage.data?.plan.hasUpgradePath && <NavigatingButton size="sm">Upgrade</NavigatingButton>}
            </Row>
            <Divider />
            <Stack>
                <Row justifyContent="space-between">
                    <Typography level="body1">
                        Current billing cycle ({cycleFormatter.format(usage.data?.usage.period.start)} - {cycleFormatter.format(usage.data?.usage.period.end)})
                    </Typography>
                    <NavigatingButton size="sm">View Usage</NavigatingButton>
                </Row>
            </Stack>
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

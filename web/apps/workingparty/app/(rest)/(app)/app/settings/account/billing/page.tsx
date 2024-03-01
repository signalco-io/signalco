import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { PlanSettingsCard } from './PlanSettingsCard';
import { PaymentSettingsCard } from './PaymentSettingsCard';
import { BillingInfoSettingsCard } from './BillingInfoSettingsCard';

export default function SettingsAccountBillingPage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
                <Typography level="h1" className="text-2xl">Billing</Typography>
                <PlanSettingsCard />
                <PaymentSettingsCard />
                <BillingInfoSettingsCard />
            </Stack>
        </Container>
    )
}
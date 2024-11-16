import { Suspense } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { SettingsAccountBillingPlanCard } from './SettingsAccountBillingPlanCard';

export default function SettingsAccountBillingPlansPage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
                <Suspense>
                    <SettingsAccountBillingPlanCard />
                </Suspense>
            </Stack>
        </Container>
    )
}
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { Info } from '@signalco/ui-icons';
import { Alert } from '@signalco/ui/Alert';
import { InsightsUsageCard } from './InsightsUsageCard';

export default function SettingsAccountUsagePage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
                <Typography level="h1" className="text-2xl">Usage</Typography>
                <InsightsUsageCard />
                <Alert startDecorator={<Info className="size-5" />}>More detailed usage data will be available soon.</Alert>
            </Stack>
        </Container>
    )
}
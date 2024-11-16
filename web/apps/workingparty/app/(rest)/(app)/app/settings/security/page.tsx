import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { Info } from '@signalco/ui-icons';
import { Alert } from '@signalco/ui/Alert';
import { SecurityLoginSettingsCard } from './SecurityLoginSettingsCard';

export default function SettingsSecurityPage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
            <Typography level="h1" className="text-2xl">Security</Typography>
                <SecurityLoginSettingsCard />
                <Alert startDecorator={<Info className="size-5" />}>
                    More security settings will be available soon.
                </Alert>
            </Stack>
        </Container>
    )
}
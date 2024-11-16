import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { ProfileDisplayNameSettingsCard } from './ProfileDisplayNameSettingsCard';

export default function SettingsProfilePage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Stack spacing={4}>
                <Typography level="h1" className="text-2xl">Profile</Typography>
                <ProfileDisplayNameSettingsCard />
            </Stack>
        </Container>
    )
}
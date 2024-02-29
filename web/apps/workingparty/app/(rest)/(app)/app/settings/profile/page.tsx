import { Typography } from '@signalco/ui-primitives/Typography';
import { Container } from '@signalco/ui-primitives/Container';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';

export default function SettingsProfilePage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Typography level="h1" className="text-2xl">Profile</Typography>
            <NoDataPlaceholder>
                No profile settings available
            </NoDataPlaceholder>
        </Container>
    )
}
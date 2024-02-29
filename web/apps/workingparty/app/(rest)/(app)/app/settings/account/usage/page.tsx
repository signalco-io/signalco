import { Typography } from '@signalco/ui-primitives/Typography';
import { Container } from '@signalco/ui-primitives/Container';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';

export default function SettingsAccountUsagePage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Typography level="h1" className="text-2xl">Usage</Typography>
            <NoDataPlaceholder>
                No usage data available
            </NoDataPlaceholder>
        </Container>
    )
}